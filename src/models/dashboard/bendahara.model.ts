import { Pool } from "pg";

export class BendaharaModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  async getOverdueInvoices() {
    const query = `
      SELECT 
        id AS faktur_id,
        distribusi_id,
        tanggal_faktur,
        tanggal_jatuh_tempo,
        NOW()::DATE - tanggal_jatuh_tempo AS overdue_days,
        jumlah_tagihan,
        jumlah_dibayar,
        (jumlah_tagihan - jumlah_dibayar) AS sisa_tagihan
      FROM brandis.faktur_distribusi
      WHERE status_pembayaran = 'Jatuh Tempo'
      ORDER BY overdue_days DESC;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getFinancialSummaryByOutlet() {
    const query = `
      SELECT 
        o.nama AS outlet_name,
        COUNT(f.id) AS total_invoices,
        SUM(f.jumlah_tagihan) AS total_tagihan,
        SUM(f.jumlah_dibayar) AS total_dibayar,
        SUM(f.jumlah_tagihan - f.jumlah_dibayar) AS total_outstanding
      FROM brandis.faktur_distribusi f
      JOIN brandis.distribusi d ON f.distribusi_id = d.id
      JOIN brandis.outlet o ON d.outlet_id = o.id
      GROUP BY o.nama
      ORDER BY total_outstanding DESC;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getPaymentStatusDistribution() {
    const query = `
      SELECT 
        status_pembayaran,
        COUNT(*) AS jumlah_faktur,
        SUM(jumlah_tagihan) AS total_tagihan,
        SUM(jumlah_dibayar) AS total_dibayar
      FROM brandis.faktur_distribusi
      GROUP BY status_pembayaran
      ORDER BY jumlah_faktur DESC;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}
