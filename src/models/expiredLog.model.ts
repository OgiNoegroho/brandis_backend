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
          b.tanggal_kadaluarsa  -- Get the original tanggal_kadaluarsa from the batch table
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
          tanggal_kadaluarsa  -- Use the original tanggal_kadaluarsa from expired batches
        FROM expired_batches
        RETURNING batch_id  -- This will return the batch_ids that were inserted into batchKadaluarsa
      ),
      logged_batches AS (
        INSERT INTO brandis.batchKadaluarsaLog (batch_id, expired_on, moved)
        SELECT 
          batch_id, 
          tanggal_kadaluarsa,  -- Use the original tanggal_kadaluarsa for expired_on
          TRUE
        FROM expired_batches
        RETURNING batch_id  -- This will return the batch_ids that were inserted into batchKadaluarsaLog
      )
      -- Closing the query properly by selecting from logged_batches
      SELECT * FROM logged_batches;  -- Ensure that the query has a final SELECT statement
    `;
  
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');  // Start the transaction
      const result = await client.query(query);
      console.log('Expired batch move results:', result); // Log the query result
      await client.query('COMMIT'); // Commit the transaction
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback on error
      console.error('Error moving expired batches:', error);
      throw error;
    } finally {
      client.release();  // Release the client back to the pool
    }
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
