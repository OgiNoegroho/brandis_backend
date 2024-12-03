import { Pool, QueryResult } from 'pg';
import { BatchDetails, Inventory, InventoryDTO } from '../types/inventory.type';

export class InventoryModel {
  constructor(private dbPool: Pool) {}

  async getInventory(): Promise<Inventory[]> {
    const query = `
      SELECT 
        p.nama AS nama_produk, 
        COALESCE(SUM(os.kuantitas), 0) AS kuantitas, 
        CASE 
          WHEN COALESCE(SUM(os.kuantitas), 0) > 10 THEN 'In stock' 
          WHEN COALESCE(SUM(os.kuantitas), 0) BETWEEN 1 AND 10 THEN 'Low stock' 
          ELSE 'Out of stock' 
        END AS ketersediaan 
      FROM brandis.produk p
      LEFT JOIN brandis.batch b ON p.id = b.produk_id
      LEFT JOIN brandis.stok_outlet os ON b.id = os.batch_id
      GROUP BY p.nama
    `;
    const result: QueryResult = await this.dbPool.query(query);
    return result.rows;
  }

  async getBatchDetails(produkId: string): Promise<BatchDetails[]> {
    const query = `
      SELECT 
        b.id AS batch_id, 
        b.nama AS nama_batch, 
        b.kuantitas AS kuantitas_batch, 
        b.tanggal_kadaluarsa, 
        b.dibuat_pada, 
        b.diperbarui_pada
      FROM brandis.batch b
      WHERE b.produk_id = $1
      ORDER BY b.id
    `;
    const result: QueryResult = await this.dbPool.query(query, [produkId]);
    return result.rows;
  }

  async createBatch(batchData: InventoryDTO): Promise<BatchDetails> {
    const query = `
      INSERT INTO brandis.batch (nama, produk_id, kuantitas, tanggal_kadaluarsa, dibuat_pada, diperbarui_pada)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id AS batch_id, nama AS nama_batch, kuantitas AS kuantitas_batch, 
                tanggal_kadaluarsa, dibuat_pada, diperbarui_pada
    `;
    const { nama, produk_id, kuantitas, tanggal_kadaluarsa } = batchData;
    const result: QueryResult = await this.dbPool.query(query, [
      nama,
      produk_id,
      kuantitas,
      tanggal_kadaluarsa,
    ]);
    return result.rows[0];
  }

  async updateBatch(produkId: string, batchData: Partial<InventoryDTO>): Promise<BatchDetails> {
    const fields = Object.keys(batchData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const query = `
      UPDATE brandis.batch
      SET ${fields}, diperbarui_pada = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id AS batch_id, nama AS nama_batch, kuantitas AS kuantitas_batch, 
                tanggal_kadaluarsa, dibuat_pada, diperbarui_pada
    `;
    const values = [produkId, ...Object.values(batchData)];
    const result: QueryResult = await this.dbPool.query(query, values);
    return result.rows[0];
  }

  async deleteBatch(produkId: string): Promise<void> {
    const query = `
      DELETE FROM brandis.batch
      WHERE id = $1
    `;
    await this.dbPool.query(query, [produkId]);
  }
}