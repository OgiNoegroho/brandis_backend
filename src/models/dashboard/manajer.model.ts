//src\models\dashboard.model.ts
import { Pool } from "pg";

export class ManajerModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  //MANAJER
  async getBatchDiproduksiBulanIni() {
    const query = `
      SELECT p.nama as product_name, b.kuantitas as quantity
      FROM brandis.batch b
      JOIN brandis.produk p ON b.produk_id = p.id
      WHERE DATE_PART('month', b.dibuat_pada) = DATE_PART('month', CURRENT_DATE) 
      AND DATE_PART('year', b.dibuat_pada) = DATE_PART('year', CURRENT_DATE);
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getStokRendahDiGudang() {
    const query = `
      SELECT nama, kuantitas
      FROM brandis.batch
      WHERE kuantitas < 20;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getTotalPengembalianProduk() {
    const query = `
      SELECT p.nama as product_name, o.nama as outlet_name, dp.kuantitas as quantity
      FROM brandis.pengembalian pn
      JOIN brandis.detail_pengembalian dp ON dp.pengembalian_id = pn.id
      JOIN brandis.batch b ON dp.batch_id = b.id
      JOIN brandis.produk p ON b.produk_id = p.id
      JOIN brandis.outlet o ON pn.outlet_id = o.id;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}
