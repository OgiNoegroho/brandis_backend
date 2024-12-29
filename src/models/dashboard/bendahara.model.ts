// //src\models\dashboard\bendahara.model.ts

import { Pool } from "pg";

export class BendaharaModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  // Total Outstanding Invoices
  async getTotalOutstandingInvoices() {
    const query = `
    SELECT 
      COUNT(*) AS total_outstanding_invoices,
      SUM(jumlah_tagihan - jumlah_dibayar) AS total_outstanding_amount
    FROM 
      brandis.faktur_distribusi
    WHERE 
      status_pembayaran IN ('Belum Lunas', 'Jatuh Tempo');
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Overdue Invoices
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
    FROM 
      brandis.faktur_distribusi
    WHERE 
      status_pembayaran = 'Jatuh Tempo';
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Financial Summary by Outlet
  async getFinancialSummaryByOutlet() {
    const query = `
    SELECT 
      o.nama AS outlet_name,
      COUNT(f.id) AS total_invoices,
      SUM(f.jumlah_tagihan) AS total_tagihan,
      SUM(f.jumlah_dibayar) AS total_dibayar,
      SUM(f.jumlah_tagihan - f.jumlah_dibayar) AS total_outstanding
    FROM 
      brandis.faktur_distribusi f
    JOIN 
      brandis.outlet o ON f.outlet_id = o.id
    GROUP BY 
      o.nama
    ORDER BY 
      total_outstanding DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Returns Summary
  async getReturnsSummary() {
    const query = `
    SELECT 
      alasan,
      COUNT(*) AS jumlah_pengembalian,
      SUM(kuantitas) AS total_kuantitas_dikembalikan
    FROM 
      brandis.detail_pengembalian
    GROUP BY 
      alasan
    ORDER BY 
      total_kuantitas_dikembalikan DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Monthly Financial Trends
  async getMonthlyFinancialTrends() {
    const query = `
    SELECT 
      DATE_TRUNC('month', tanggal_faktur) AS bulan,
      COUNT(*) AS jumlah_faktur,
      SUM(jumlah_tagihan) AS total_tagihan,
      SUM(jumlah_dibayar) AS total_dibayar,
      SUM(jumlah_tagihan - jumlah_dibayar) AS total_outstanding
    FROM 
      brandis.faktur_distribusi
    GROUP BY 
      DATE_TRUNC('month', tanggal_faktur)
    ORDER BY 
      bulan DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}
