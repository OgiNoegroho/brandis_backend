// src/models/notifikasiFaktur.model.ts
import { Pool } from "pg";
import { InvoiceNotification } from "../types/notifikasiFaktur.type";

export class NotifikasiFakturModel {
  constructor(private db: Pool) {}

  async processOverdueInvoices(): Promise<void> {
    const query = `
  WITH overdue_invoices AS (
    -- Step 1: Get all unpaid invoices
    SELECT 
      fd.id AS faktur_id,            -- Invoice ID
      fd.distribusi_id,              -- Distribusi ID (distribution ID)
      fd.tanggal_jatuh_tempo,        -- Due date
      fd.status_pembayaran           -- Payment status
    FROM brandis.faktur_distribusi fd
    WHERE fd.status_pembayaran = 'Belum Lunas'  -- Only unpaid invoices
  ),
  updated_invoices AS (
    -- Step 2: Update overdue invoices status to 'Jatuh Tempo'
    UPDATE brandis.faktur_distribusi fd
    SET 
      status_pembayaran = 'Jatuh Tempo',  -- Change status to 'Jatuh Tempo'
      diperbarui_pada = CURRENT_TIMESTAMP -- Update timestamp
    FROM overdue_invoices oi
    WHERE fd.id = oi.faktur_id
      AND fd.tanggal_jatuh_tempo < CURRENT_DATE  -- Only overdue invoices
    RETURNING fd.id AS faktur_id, fd.distribusi_id, fd.outlet  -- Updated column name
  ),
  new_notifications AS (
    -- Step 3: Select invoices that need new notifications
    SELECT 
      ui.faktur_id,
      ui.distribusi_id,
      ui.outlet
    FROM updated_invoices ui
    LEFT JOIN brandis.notifikasi_faktur_distribusi nf
      ON ui.faktur_id = nf.faktur_id
    WHERE nf.id IS NULL  -- Only select invoices without existing notifications
  )
  -- Step 4: Insert new notifications for overdue invoices
  INSERT INTO brandis.notifikasi_faktur_distribusi (
    faktur_id,
    status_notifikasi,
    alasan,
    distribusi_id,
    outlet_id,
    created_at,
    updated_at
  )
  SELECT 
    faktur_id,
    'Pending',             -- Notification status 'Pending'
    'Overdue',             -- Reason 'Overdue'
    distribusi_id,
    outlet,                -- Updated column name
    CURRENT_TIMESTAMP,     -- Current timestamp
    CURRENT_TIMESTAMP      -- Current timestamp
  FROM new_notifications
  RETURNING id;
`;


    const client = await this.db.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Execute the overdue invoices query
      const result = await client.query(query);

      // Log how many invoices were processed
      console.log(`Processed ${result.rows.length} overdue invoices`);

      await client.query("COMMIT"); // Commit transaction
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback in case of error
      console.error("Error in processOverdueInvoices:", error);
      throw error;
    } finally {
      client.release(); // Release the database connection
    }
  }

  // Method to fetch invoice notifications (optional)
  async getInvoiceNotifications(): Promise<InvoiceNotification[]> {
    const query = `
      SELECT 
        nf.id,
        nf.faktur_id,
        nf.status_notifikasi,
        nf.alasan,
        nf.tanggal_notifikasi,
        nf.distribusi_id,
        nf.outlet_id,
        fd.status_pembayaran,
        fd.tanggal_jatuh_tempo,
        fd.jumlah_tagihan
      FROM brandis.notifikasi_faktur_distribusi nf
      JOIN brandis.faktur_distribusi fd ON nf.faktur_id = fd.id
      ORDER BY nf.created_at DESC;
    `;

    const result = await this.db.query<InvoiceNotification>(query);
    return result.rows;
  }
}
