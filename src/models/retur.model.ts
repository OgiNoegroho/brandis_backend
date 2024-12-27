import { Pool } from "pg";
import { ReturnDTO, ReturnResult } from "../types/retur.type";

export class ReturnModel {
  constructor(private dbPool: Pool) {}

  async createReturn(returnDataList: ReturnDTO[]): Promise<ReturnResult[]> {
    const client = await this.dbPool.connect(); // Get a client for the transaction
    try {
      await client.query("BEGIN"); // Start transaction

      const returnResults: ReturnResult[] = [];

      for (const returnData of returnDataList) {
        const { outlet_id, batch_id, kuantitas, alasan } = returnData;

        // Check current stock in stok_outlet
        const stockQuery = `
        SELECT kuantitas 
        FROM brandis.stok_outlet 
        WHERE outlet_id = $1 AND batch_id = $2
        FOR UPDATE;
      `;
        const stockResult = await client.query(stockQuery, [
          outlet_id,
          batch_id,
        ]);

        if (stockResult.rowCount === 0) {
          throw new Error(
            `No stock available for batch ${batch_id} in outlet ${outlet_id}`
          );
        }

        const currentStock = stockResult.rows[0].kuantitas;
        if (currentStock < kuantitas) {
          throw new Error(
            `Insufficient stock for batch ${batch_id} in outlet ${outlet_id}`
          );
        }

        // Decrease stock in stok_outlet
        const updateStockQuery = `
        UPDATE brandis.stok_outlet 
        SET kuantitas = kuantitas - $1, diperbarui_pada = CURRENT_TIMESTAMP
        WHERE outlet_id = $2 AND batch_id = $3;
      `;
        await client.query(updateStockQuery, [kuantitas, outlet_id, batch_id]);

        // Insert into pengembalian table
        const returnQuery = `
        INSERT INTO brandis.pengembalian (outlet_id) 
        VALUES ($1) 
        RETURNING id;
      `;
        const returnResult = await client.query(returnQuery, [outlet_id]);
        const returnId = returnResult.rows[0].id;

        // Insert into detail_pengembalian table
        const detailQuery = `
        INSERT INTO brandis.detail_pengembalian (pengembalian_id, batch_id, kuantitas, alasan) 
        VALUES ($1, $2, $3, $4);
      `;
        await client.query(detailQuery, [
          returnId,
          batch_id,
          kuantitas,
          alasan,
        ]);

        returnResults.push({ return_id: returnId });
      }

      await client.query("COMMIT"); // Commit transaction

      return returnResults; // Return all the created returns
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      throw error;
    } finally {
      client.release(); // Release the client
    }
  }

  async getReturnHistory(outletId: number): Promise<any[]> {
    const query = `
      SELECT 
        p.id AS return_id,
        p.outlet_id,
        dp.batch_id,
        dp.kuantitas AS quantity,
        dp.alasan AS reason,
        dp.dibuat_pada AS return_date,
        pr.nama AS product_name  -- Corrected column name
      FROM brandis.pengembalian p
      INNER JOIN brandis.detail_pengembalian dp ON p.id = dp.pengembalian_id
      INNER JOIN brandis.batch b ON dp.batch_id = b.id
      INNER JOIN brandis.produk pr ON b.produk_id = pr.id  -- Join produk table for product name
      WHERE p.outlet_id = $1
      ORDER BY dp.dibuat_pada DESC;
    `;

    const result = await this.dbPool.query(query, [outletId]);
    return result.rows;
  }

  // New method to get all product details from stock outlet for a specific outlet ID
  async getAllProductDetailsFromStockOutletByOutletId(
    outletId: number
  ): Promise<any[]> {
    const query = `
    SELECT 
      pr.id AS product_id,          -- Product ID
      pr.nama AS product_name       -- Product Name
    FROM brandis.stok_outlet so
    JOIN brandis.batch b ON so.batch_id = b.id    -- Join with Batch table
    JOIN brandis.produk pr ON b.produk_id = pr.id  -- Join with Produk table
    WHERE so.outlet_id = $1          -- Filter by specific outlet_id
    ORDER BY pr.nama;                -- Optional: Order by product name
  `;

    const result = await this.dbPool.query(query, [outletId]);
    return result.rows;
  }

  // New method to get batch details (batch ID, batch name, and quantity)
  async getBatchDetailsByProductId(productId: number): Promise<any[]> {
    const query = `
      SELECT 
        b.id AS batch_id,             -- Batch ID
        b.nama AS batch_name,         -- Batch Name
        so.kuantitas                  -- Quantity in Stock
      FROM brandis.stok_outlet so
      INNER JOIN brandis.batch b ON so.batch_id = b.id   -- Join with Batch table to get batch details
      WHERE b.produk_id = $1        -- Filter by product ID
      ORDER BY b.nama;               -- Optional: You can order by batch name or any other column
    `;

    const result = await this.dbPool.query(query, [productId]);
    return result.rows;
  }
}
