// //src\models\dashboard\bendahara.model.ts

import { Pool } from "pg";

export class BendaharaModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  // Get financial summary of Faktur Distribusi
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

  // Get current month revenue
  async getPendapatanBulanIni(outletId?: number, productId?: number) {
    let query = `
        SELECT SUM(jumlah_dibayar) AS total_pendapatan
        FROM brandis.faktur_penjualan
        WHERE DATE_PART('month', dibuat_pada) = DATE_PART('month', CURRENT_DATE)
          AND DATE_PART('year', dibuat_pada) = DATE_PART('year', CURRENT_DATE)
    `;

    if (outletId) {
      query += ` AND outlet_id = $1`;
    }

    if (productId) {
      query += ` AND EXISTS (
                  SELECT 1
                  FROM brandis.detail_penjualan dp
                  WHERE dp.penjualan_id = faktur_penjualan.penjualan_id
                  AND dp.batch_id IN (SELECT id FROM brandis.batch WHERE produk_id = $2)
                )`;
    }

    const result = await this.dbPool.query(
      query,
      [outletId, productId].filter(Boolean)
    );
    return result.rows;
  }

  // Get overdue invoices
  async getOverdueInvoices() {
    const query = `
      SELECT id, status_pembayaran, tanggal_faktur, tanggal_jatuh_tempo, jumlah_tagihan, jumlah_dibayar
      FROM brandis.faktur_penjualan
      WHERE tanggal_jatuh_tempo < CURRENT_DATE AND status_pembayaran != 'Lunas';
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Get invoices that are due today
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
