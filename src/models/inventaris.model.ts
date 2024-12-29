// InventoryModel.ts
import { Pool, QueryResult } from "pg";
import {
  BatchDetails,
  Inventory,
  InventoryDTO,
} from "../types/inventaris.type";

export class InventoryModel {
  constructor(private dbPool: Pool) {}

  async getInventory(): Promise<Inventory[]> {
    const query = `
      SELECT 
        p.id AS produk_id,  -- Include product ID
        p.nama AS nama_produk, 
        COALESCE(SUM(CASE 
          WHEN b.tanggal_kadaluarsa >= CURRENT_DATE THEN b.kuantitas
          ELSE 0
        END), 0) AS kuantitas,  -- Sum quantities for non-expired batches
        CASE 
          WHEN COALESCE(SUM(CASE 
            WHEN b.tanggal_kadaluarsa >= CURRENT_DATE THEN b.kuantitas
            ELSE 0
          END), 0) > 10 THEN 'Stok Tersedia' 
          WHEN COALESCE(SUM(CASE 
            WHEN b.tanggal_kadaluarsa >= CURRENT_DATE THEN b.kuantitas
            ELSE 0
          END), 0) BETWEEN 1 AND 10 THEN 'Stok Menipis' 
          ELSE 'Stok Habis' 
        END AS ketersediaan 
      FROM brandis.produk p
      LEFT JOIN brandis.batch b ON p.id = b.produk_id
      GROUP BY p.id, p.nama  -- Group by p.id to include it in the SELECT
    `;
    const result: QueryResult = await this.dbPool.query(query);
    return result.rows;
  }

  async getAllBatches(): Promise<BatchDetails[]> {
    const query = `
    SELECT 
      b.id AS batch_id,
      b.nama AS nama_batch,
      p.nama AS nama_produk,
      b.kuantitas,
      b.dibuat_pada,
      b.tanggal_kadaluarsa
    FROM brandis.batch b
    JOIN brandis.produk p ON b.produk_id = p.id
    WHERE b.tanggal_kadaluarsa >= CURRENT_DATE -- Exclude expired batches
      AND b.kuantitas > 0 -- Exclude empty batches
    ORDER BY b.id
  `;
    const result: QueryResult = await this.dbPool.query(query);
    return result.rows;
  }

  async getEmptyBatches(): Promise<BatchDetails[]> {
    const query = `
    SELECT 
      b.id AS batch_id,
      b.nama AS nama_batch,
      p.nama AS nama_produk,
      b.kuantitas,
      b.dibuat_pada,
      b.tanggal_kadaluarsa
    FROM brandis.batch b
    JOIN brandis.produk p ON b.produk_id = p.id
    WHERE b.kuantitas = 0 -- Only empty batches
    ORDER BY b.id
  `;
    const result: QueryResult = await this.dbPool.query(query);
    return result.rows;
  }

  async getInventoryDetail(produkId: string): Promise<BatchDetails[]> {
    const query = `
SELECT  
    b.id AS batch_id,
    b.nama AS nama_batch,
    p.nama AS nama_produk,
    b.kuantitas AS kuantitas_batch,
    b.tanggal_kadaluarsa,
    b.dibuat_pada AS produksi_pada
FROM brandis.batch b
JOIN brandis.produk p ON b.produk_id = p.id  -- Join to get the product name
WHERE b.produk_id = $1
  AND b.tanggal_kadaluarsa >= CURRENT_DATE  -- Exclude expired batches
  AND b.kuantitas > 0  -- Exclude batches with zero quantity
ORDER BY b.tanggal_kadaluarsa ASC;  -- Order by expiration date in ascending order (earliest first)
    `;
    const result: QueryResult = await this.dbPool.query(query, [produkId]);
    return result.rows;
  }

  async getBatchDetails(batchId: string): Promise<BatchDetails[]> {
    const query = `
      SELECT 
        b.id AS batch_id, 
        b.nama AS nama_batch, 
        p.nama AS nama_produk,
        b.kuantitas AS kuantitas_batch, 
        b.tanggal_kadaluarsa, 
        b.dibuat_pada, 
        b.diperbarui_pada
      FROM brandis.batch b
      JOIN brandis.produk p ON p.id = b.produk_id
      WHERE b.id = $1  -- Use batch_id to fetch batch details
        AND b.tanggal_kadaluarsa >= CURRENT_DATE  -- Exclude expired batches
      ORDER BY b.id
    `;
    const result: QueryResult = await this.dbPool.query(query, [batchId]);
    return result.rows;
  }

  async createBatch(batchData: InventoryDTO): Promise<BatchDetails> {
    // Step 1: Get today's date in D/M/YYYY format
    const today = new Date();
    const formattedDate = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`; // D/M/YYYY

    // Step 2: Count existing batches created today to generate the sequence number
    const countQuery = `
    SELECT COUNT(*) AS batch_count
    FROM brandis.batch
    WHERE dibuat_pada::date = CURRENT_DATE
  `;

    const countResult = await this.dbPool.query(countQuery);
    const batchCount = parseInt(countResult.rows[0].batch_count, 10) + 1; // Increment count for the new batch

    // Step 3: Generate the nama batch
    const sequenceNumber = batchCount.toString().padStart(3, "0"); // Pad sequence to 3 digits
    const namaBatch = `${formattedDate}-${sequenceNumber}`; // Combine date and sequence number

    // Step 4: Insert the batch into the database
    const query = `
    INSERT INTO brandis.batch (nama, produk_id, kuantitas, tanggal_kadaluarsa, dibuat_pada, diperbarui_pada)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id AS batch_id, nama AS nama_batch, kuantitas AS kuantitas_batch, 
              tanggal_kadaluarsa, dibuat_pada, diperbarui_pada, produk_id
  `;

    const { produk_id, kuantitas, tanggal_kadaluarsa } = batchData;
    const result: QueryResult = await this.dbPool.query(query, [
      namaBatch, // Use the generated batch name
      produk_id,
      kuantitas,
      tanggal_kadaluarsa,
    ]);

    const batch = result.rows[0];

    // Step 5: Retrieve the product name for the created batch
    const productQuery = `
    SELECT nama FROM brandis.produk WHERE id = $1
  `;
    const productResult = await this.dbPool.query(productQuery, [
      batch.produk_id,
    ]);

    // Step 6: Return the batch details
    return {
      ...batch,
      nama_produk: productResult.rows[0]?.nama || "Unknown Product",
    };
  }

  async updateBatch(
    batchId: string,
    batchData: Partial<InventoryDTO>
  ): Promise<BatchDetails> {
    const fields = Object.keys(batchData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE brandis.batch
      SET ${fields}, diperbarui_pada = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id AS batch_id, nama AS nama_batch, kuantitas AS kuantitas_batch, 
                tanggal_kadaluarsa, dibuat_pada, diperbarui_pada, produk_id
    `;

    const values = [batchId, ...Object.values(batchData)];
    const result: QueryResult = await this.dbPool.query(query, values);

    const updatedBatch = result.rows[0];

    const productQuery = `
      SELECT nama FROM brandis.produk WHERE id = $1
    `;
    const productResult = await this.dbPool.query(productQuery, [
      updatedBatch.produk_id,
    ]);

    return {
      ...updatedBatch,
      nama_produk: productResult.rows[0]?.nama || "Unknown Product",
    };
  }

  async deleteBatch(batchId: string): Promise<void> {
    const query = `
      DELETE FROM brandis.batch
      WHERE id = $1
    `;
    await this.dbPool.query(query, [batchId]);
  }
}
