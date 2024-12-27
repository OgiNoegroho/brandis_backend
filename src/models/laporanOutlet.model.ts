// src/models/laporanOutlet.model.ts

import { Pool } from "pg";
import { StatusPembayaran } from "../types/laporanOutlet.type";

export class LaporanOutletModel {
  constructor(private db: Pool) {}

  // Query to get all distributions for an outlet
  async getAllLaporanDistribusi(outlet_id: number) {
    const query = `
 SELECT 
      d.id AS distribusi_id,                     -- Distribusi ID
      d.dibuat_pada AS distribusi_created_at,    -- Distribution created date
      fd.id AS faktur_id,                        -- Faktur ID
      fd.status_pembayaran                       -- Payment status
    FROM 
      brandis.distribusi d
    LEFT JOIN 
      brandis.faktur_distribusi fd ON fd.distribusi_id = d.id
    WHERE 
      d.outlet_id = $1
    ORDER BY 
      d.dibuat_pada DESC
  `;
    const result = await this.db.query(query, [outlet_id]);
    return result.rows;
  }

  // Model method to update the status of a Faktur
  async updateFakturStatus(
    faktur_id: string,
    status_pembayaran: StatusPembayaran
  ) {
    const client = await this.db.connect();

    try {
      // Update the faktur status in the database
      const updateQuery = `
        UPDATE brandis.faktur_distribusi 
        SET status_pembayaran = $1, diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, status_pembayaran;
      `;

      const result = await client.query(updateQuery, [
        status_pembayaran,
        faktur_id,
      ]);

      if (result.rowCount === 0) {
        throw new Error(`Faktur with ID ${faktur_id} not found`);
      }

      return result.rows[0]; // Return updated faktur details
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  }

  async addToFakturAmountPaid(faktur_id: string, jumlah_dibayar: number) {
    const client = await this.db.connect();

    try {
      // Start a transaction to ensure data consistency
      await client.query("BEGIN");

      // Update jumlah_dibayar in the database and ensure precision
      const updateQuery = `
      UPDATE brandis.faktur_distribusi
      SET 
        jumlah_dibayar = jumlah_dibayar + $1,
        diperbarui_pada = CURRENT_TIMESTAMP,
        status_pembayaran = 
          CASE 
            WHEN jumlah_dibayar + $1 = jumlah_tagihan THEN 'Lunas'
            ELSE status_pembayaran 
          END
      WHERE id = $2
      AND jumlah_dibayar + $1 <= jumlah_tagihan
      RETURNING id, jumlah_dibayar, status_pembayaran;
    `;

      const updateResult = await client.query(updateQuery, [
        jumlah_dibayar,
        faktur_id,
      ]);

      if (updateResult.rowCount === 0) {
        // If no row was updated, handle the error specifically
        const checkFakturQuery = `
        SELECT id FROM brandis.faktur_distribusi WHERE id = $1
      `;
        const checkFakturResult = await client.query(checkFakturQuery, [
          faktur_id,
        ]);

        if (checkFakturResult.rowCount === 0) {
          throw new Error(`Faktur with ID ${faktur_id} not found.`);
        } else {
          throw new Error(
            `The total amount paid exceeds the outstanding balance for Faktur with ID ${faktur_id}.`
          );
        }
      }

      // Commit the transaction
      await client.query("COMMIT");

      return updateResult.rows[0]; // Return the updated faktur details
    } catch (error) {
      // Roll back the transaction in case of an error
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}