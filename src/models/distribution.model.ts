import { Pool } from 'pg';
import { Distribusi, DetailDistribusi, FakturDistribusi, StatusPembayaran } from '../types/distribution.type';

export class DistributionModel {
  constructor(private db: Pool) {}

  async createDistributionAndFakturTransaction(
    distribution: Distribusi,
    details: DetailDistribusi[],
    faktur_id: string,
    status_pembayaran: StatusPembayaran,
    tanggal_faktur: string,
    tanggal_jatuh_tempo: string
  ) {
    const client = await this.db.connect();

    try {
      // Start transaction
      await client.query("BEGIN");

      // 1. Insert distribution
      const distributionQuery = `INSERT INTO brandis.distribusi (outlet_id) VALUES ($1) RETURNING id`;
      const distributionResult = await client.query(distributionQuery, [
        distribution.outlet_id,
      ]);
      const distributionId = distributionResult.rows[0].id;

      // 2. Insert details and update batches
      for (const detail of details) {
        const detailQuery = `INSERT INTO brandis.detail_distribusi (distribusi_id, batch_id, kuantitas_terjual) VALUES ($1, $2, $3)`;
        await client.query(detailQuery, [
          distributionId,
          detail.batch_id,
          detail.kuantitas_terjual,
        ]);

        const batchUpdateQuery = `UPDATE brandis.batch SET kuantitas = kuantitas - $1 WHERE id = $2 AND kuantitas >= $1`;
        const batchUpdateResult = await client.query(batchUpdateQuery, [
          detail.kuantitas_terjual,
          detail.batch_id,
        ]);

        if (batchUpdateResult.rowCount === 0) {
          throw new Error(`Insufficient quantity in batch ${detail.batch_id}`);
        }

        const stockUpsertQuery = `INSERT INTO brandis.stok_outlet (outlet_id, batch_id, kuantitas) VALUES ($1, $2, $3) ON CONFLICT (outlet_id, batch_id) DO UPDATE SET kuantitas = stok_outlet.kuantitas + $3, diperbarui_pada = CURRENT_TIMESTAMP`;
        await client.query(stockUpsertQuery, [
          distribution.outlet_id,
          detail.batch_id,
          detail.kuantitas_terjual,
        ]);
      }

      // 3. Fetch the current count of invoices for the date
      const date = new Date(tanggal_faktur);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;

      const countQuery = `
      SELECT COUNT(*) as count 
      FROM brandis.faktur_distribusi 
      WHERE DATE(tanggal_faktur) = $1
    `;
      const countResult = await client.query(countQuery, [date]);
      const currentCount = parseInt(countResult.rows[0].count, 10) + 1;

      // Generate faktur_id
      const fakturId = `${formattedDate}-${String(currentCount).padStart(
        3,
        "0"
      )}`;

      // 4. Calculate total invoice amount
      const totalAmountQuery = `
      SELECT SUM(p.harga * dd.kuantitas_terjual) as total_amount
      FROM brandis.detail_distribusi dd
      JOIN brandis.batch b ON dd.batch_id = b.id
      JOIN brandis.produk p ON b.produk_id = p.id
      WHERE dd.distribusi_id = $1
    `;
      const amountResult = await client.query(totalAmountQuery, [
        distributionId,
      ]);
      const totalAmount = parseFloat(amountResult.rows[0].total_amount);

      // Handle jumlah_dibayar (amount paid), assuming it's 0 initially
      const jumlahDibayar = 0;

      // 5. Insert faktur
      const fakturQuery = `
      INSERT INTO brandis.faktur_distribusi 
      (id, distribusi_id, status_pembayaran, tanggal_faktur, tanggal_jatuh_tempo, jumlah_tagihan, jumlah_dibayar)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
      const fakturResult = await client.query(fakturQuery, [
        fakturId,
        distributionId,
        status_pembayaran,
        new Date(tanggal_faktur),
        new Date(tanggal_jatuh_tempo),
        totalAmount,
        jumlahDibayar,
      ]);

      const finalFakturId = fakturResult.rows[0].id;

      // Commit transaction
      await client.query("COMMIT");

      return {
        distribusi_id: distributionId,
        faktur_id: finalFakturId,
      };
    } catch (error) {
      // Rollback transaction in case of error
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Release the client back to the pool
      client.release();
    }
  }

  // This method handles creating the faktur in the database
  async createFaktur(faktur: FakturDistribusi) {
    const query = `
      INSERT INTO brandis.faktur_distribusi 
      (id, distribusi_id, status_pembayaran, tanggal_faktur, tanggal_jatuh_tempo, jumlah_tagihan, jumlah_dibayar)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    const result = await this.db.query(query, [
      faktur.id,
      faktur.distribusi_id,
      faktur.status_pembayaran,
      faktur.tanggal_faktur,
      faktur.tanggal_jatuh_tempo,
      faktur.jumlah_tagihan,
      faktur.jumlah_dibayar,
    ]);
    return result.rows[0];
  }

  // Query to get all distributions for an outlet
  async getAllDistribusi(outlet_id: number) {
    const query = `
    SELECT 
      d.id AS distribusi_id,
      d.dibuat_pada AS distribusi_created_at,
      fd.id AS faktur_id                     -- Faktur ID from faktur_distribusi
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

  // Query to get distribution details by ID
  async getDistribusiById(distribusi_id: number) {
    const query = `
    SELECT 
      dd.batch_id,
      b.nama AS batch_name,
      p.nama AS product_name,
      dd.kuantitas_terjual AS quantity
    FROM 
      brandis.detail_distribusi dd
    JOIN 
      brandis.batch b ON dd.batch_id = b.id
    JOIN 
      brandis.produk p ON b.produk_id = p.id
    WHERE 
      dd.distribusi_id = $1
    ORDER BY 
      dd.dibuat_pada ASC
  `;
    const result = await this.db.query(query, [distribusi_id]);
    return result.rows;
  }

  // Query to get invoice details by distribution ID
  async getFakturDistribusi(distribusi_id: number) {
    const query = `
    SELECT 
      f.id AS invoice_number,
      f.tanggal_faktur AS invoice_date,
      f.tanggal_jatuh_tempo AS due_date,
      o.nama AS outlet_name,
      o.alamat AS outlet_address,
      p.nama AS product_name,
      dd.kuantitas_terjual AS quantity,
      p.harga AS unit_price,
      (dd.kuantitas_terjual * p.harga) AS total_price,
      f.jumlah_tagihan AS grand_total,
      f.jumlah_dibayar AS amount_paid,
      (f.jumlah_tagihan - f.jumlah_dibayar) AS balance_due,
      f.status_pembayaran AS payment_status
    FROM 
      brandis.faktur_distribusi f
    JOIN 
      brandis.distribusi d ON f.distribusi_id = d.id
    JOIN 
      brandis.detail_distribusi dd ON d.id = dd.distribusi_id
    JOIN 
      brandis.batch b ON dd.batch_id = b.id
    JOIN 
      brandis.produk p ON b.produk_id = p.id
    JOIN 
      brandis.outlet o ON d.outlet_id = o.id
    WHERE 
      f.distribusi_id = $1
    ORDER BY 
      p.nama
  `;
    const result = await this.db.query(query, [distribusi_id]);
    return result.rows;
  }
}
