// src/models/fakturStatus.model.ts

import { Pool } from "pg";
import {
  FakturJatuhTempo,
  FakturStatusLog,
  FakturStatusSummary,
} from "../types/fakturStatus.type";

export class FakturStatusModel {
  constructor(private db: Pool) {}

  async updateOverdueInvoices(): Promise<void> {
    const query = `
      WITH overdue_invoices AS (
        SELECT 
          id as faktur_id,
          distribusi_id,
          tanggal_faktur,
          tanggal_jatuh_tempo,
          jumlah_tagihan,
          jumlah_dibayar
        FROM brandis.faktur_distribusi
        WHERE status_pembayaran = 'Belum Lunas'::brandis.status_pembayaran
          AND tanggal_jatuh_tempo <= CURRENT_DATE
      ),
      update_status AS (
        UPDATE brandis.faktur_distribusi
        SET 
          status_pembayaran = 'Jatuh Tempo'::brandis.status_pembayaran,
          diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id IN (SELECT faktur_id FROM overdue_invoices)
        RETURNING id
      ),
      insert_overdue AS (
        INSERT INTO brandis.faktur_jatuh_tempo 
          (faktur_id, distribusi_id, tanggal_faktur, tanggal_jatuh_tempo, 
           jumlah_tagihan, jumlah_dibayar, status_awal, status_akhir)
        SELECT 
          faktur_id,
          distribusi_id,
          tanggal_faktur,
          tanggal_jatuh_tempo,
          jumlah_tagihan,
          jumlah_dibayar,
          'Belum Lunas'::brandis.status_pembayaran,
          'Jatuh Tempo'::brandis.status_pembayaran
        FROM overdue_invoices
      )
      INSERT INTO brandis.faktur_status_log 
        (faktur_id, tanggal_perubahan, status_awal, status_akhir)
      SELECT 
        faktur_id,
        CURRENT_DATE,
        'Belum Lunas'::brandis.status_pembayaran,
        'Jatuh Tempo'::brandis.status_pembayaran
      FROM overdue_invoices;
    `;

    const client = await this.db.connect();
    try {
      await client.query("BEGIN");
      await client.query(query);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getStatusLogs(): Promise<FakturStatusLog[]> {
    const query = `
      SELECT 
        id,
        faktur_id,
        tanggal_perubahan,
        status_awal,
        status_akhir,
        dibuat_pada
      FROM brandis.faktur_status_log
      ORDER BY dibuat_pada DESC;
    `;

    const result = await this.db.query<FakturStatusLog>(query);
    return result.rows;
  }

  async getStatusSummary(): Promise<FakturStatusSummary> {
    const query = `
      SELECT 
        SUM(CASE WHEN status_pembayaran = 'Belum Lunas'::brandis.status_pembayaran THEN 1 ELSE 0 END) as total_belum_lunas,
        SUM(CASE WHEN status_pembayaran = 'Jatuh Tempo'::brandis.status_pembayaran THEN 1 ELSE 0 END) as total_jatuh_tempo,
        SUM(CASE WHEN status_pembayaran = 'Belum Lunas'::brandis.status_pembayaran 
          THEN jumlah_tagihan - jumlah_dibayar ELSE 0 END) as total_tagihan_belum_lunas,
        SUM(CASE WHEN status_pembayaran = 'Jatuh Tempo'::brandis.status_pembayaran 
          THEN jumlah_tagihan - jumlah_dibayar ELSE 0 END) as total_tagihan_jatuh_tempo
      FROM brandis.faktur_distribusi
      WHERE status_pembayaran IN ('Belum Lunas'::brandis.status_pembayaran, 'Jatuh Tempo'::brandis.status_pembayaran);
    `;

    const result = await this.db.query<FakturStatusSummary>(query);
    return result.rows[0];
  }
}
