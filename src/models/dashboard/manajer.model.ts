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
      SELECT COUNT(*) AS batch_diproduksi
      FROM brandis.batch
      WHERE DATE_PART('month', dibuat_pada) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', dibuat_pada) = DATE_PART('year', CURRENT_DATE);
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
      SELECT SUM(dp.kuantitas) AS total_produk_dikembalikan
      FROM brandis.detail_pengembalian dp;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}


      

