import { Pool } from "pg";

export class BendaharaModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  async getRingkasanFakturDistribusi() {
    const query = `
        SELECT 
            status_pembayaran, 
            SUM(jumlah_tagihan) AS total_tagihan
        FROM brandis.faktur_distribusi
        GROUP BY status_pembayaran;
        `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getPendapatanBulanIni() {
    const query = `
        SELECT SUM(jumlah_dibayar) AS total_pendapatan
        FROM brandis.faktur_penjualan
        WHERE DATE_PART('month', dibuat_pada) = DATE_PART('month', CURRENT_DATE)
            AND DATE_PART('year', dibuat_pada) = DATE_PART('year', CURRENT_DATE);
        `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getFakturJatuhTempoHariIni() {
    const query = `
        SELECT COUNT(*) AS faktur_jatuh_tempo
        FROM brandis.faktur_penjualan
        WHERE tanggal_jatuh_tempo = CURRENT_DATE;
        `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}