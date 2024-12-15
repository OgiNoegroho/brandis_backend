import { Pool } from 'pg';
import { ExpiredBatchLog } from '../types/expiredLog.type';


export class ExpiredBatchModel {
  constructor(private db: Pool) {}

  async moveExpiredBatches(): Promise<void> {
    const query = `
      WITH expired_batches AS (
        SELECT 
          b.id AS batch_id,
          b.nama,
          b.produk_id,
          b.kuantitas,
          b.tanggal_kadaluarsa
        FROM brandis.batch b
        LEFT JOIN brandis.batchKadaluarsa bc ON b.id = bc.batch_id
        LEFT JOIN brandis.batchKadaluarsaLog bcl ON b.id = bcl.batch_id
        WHERE b.tanggal_kadaluarsa < CURRENT_DATE
          AND bc.batch_id IS NULL
          AND bcl.batch_id IS NULL
      ),
      moved_batches AS (
        INSERT INTO brandis.batchKadaluarsa (batch_id, nama, produk_id, kuantitas, tanggal_kadaluarsa)
        SELECT 
          batch_id, 
          nama, 
          produk_id, 
          kuantitas, 
          tanggal_kadaluarsa
        FROM expired_batches
        RETURNING batch_id
      ),
      logged_batches AS (
        INSERT INTO brandis.batchKadaluarsaLog (batch_id, expired_on, moved)
        SELECT 
          batch_id, 
          tanggal_kadaluarsa,
          TRUE
        FROM expired_batches
        RETURNING batch_id
      )
      SELECT * FROM logged_batches;
    `;
  
    const client = await this.db.connect();
    await client.query('BEGIN');  // Start the transaction
    await client.query(query);
    await client.query('COMMIT'); // Commit the transaction
    client.release();  // Release the client back to the pool
  }
  

// Updated query for getExpiredBatches()
async getExpiredBatches(): Promise<ExpiredBatchLog[]> {
  const query = `
    SELECT 
      log.id,
      log.batch_id,
      log.expired_on,
      log.moved,
      b.nama AS batch_name
    FROM brandis.batchKadaluarsaLog log
    LEFT JOIN brandis.batch b ON log.batch_id = b.id
    ORDER BY log.expired_on DESC;  -- Order by expired_on, not created_at
  `;

  const result = await this.db.query<ExpiredBatchLog>(query);
  return result.rows;
}

}
