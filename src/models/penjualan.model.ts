import { Pool } from "pg";
import { SaleDetail } from "../types/penjualan.type";

export class SalesModel {
  constructor(private db: Pool) {}

  async getSalesByOutlet(outlet_id: number) {
    const query = `
      SELECT 
        p.id AS penjualan_id,
        p.dibuat_pada,
        d.batch_id,
        d.kuantitas_terjual,
        b.nama AS batch_name,
        pr.nama AS product_name
      FROM brandis.penjualan p
      JOIN brandis.detail_penjualan d ON p.id = d.penjualan_id
      JOIN brandis.batch b ON d.batch_id = b.id
      JOIN brandis.produk pr ON b.produk_id = pr.id
      WHERE p.outlet_id = $1
      ORDER BY p.dibuat_pada DESC
    `;
    const result = await this.db.query(query, [outlet_id]);
    return result.rows;
  }

  async createSale(outlet_id: number, saleDetails: SaleDetail[]) {
    const client = await this.db.connect();
    const saleResponses = [];

    try {
      await client.query("BEGIN");

      let saleId: number;
      try {
        const insertSaleQuery = `
                INSERT INTO brandis.penjualan (outlet_id) 
                VALUES ($1) 
                RETURNING id;
            `;
        const saleResult = await client.query(insertSaleQuery, [outlet_id]);
        saleId = saleResult.rows[0].id;
      } catch (error) {
        throw new Error(`Failed to create sale record: ${error}`);
      }

      for (const detail of saleDetails) {
        const { product_id, kuantitas_terjual } = detail;

        let remainingQuantity = kuantitas_terjual;
        const batchesUsed = [];

        const totalStockQuery = `
                SELECT SUM(so.kuantitas) AS total_stock
                FROM brandis.stok_outlet so
                INNER JOIN brandis.batch b ON so.batch_id = b.id
                WHERE so.outlet_id = $1 AND b.produk_id = $2
                GROUP BY b.produk_id;
            `;
        const totalStockResult = await client.query(totalStockQuery, [
          outlet_id,
          product_id,
        ]);
        const totalStock = totalStockResult.rows[0]?.total_stock || 0;

        if (totalStock < kuantitas_terjual) {
          throw new Error(
            `Not enough stock for product ID ${product_id}. Total available: ${totalStock}`
          );
        }

        // Step 3: Find batches for the product in the given outlet, ordered by nearest expiration date
        try {
          const batchQuery = `
                    SELECT so.batch_id, so.kuantitas, b.tanggal_kadaluarsa
                    FROM brandis.stok_outlet so
                    INNER JOIN brandis.batch b ON so.batch_id = b.id
                    WHERE so.outlet_id = $1 AND b.produk_id = $2 AND so.kuantitas > 0
                    ORDER BY b.tanggal_kadaluarsa ASC
                    FOR UPDATE;
                `;
          const batchResult = await client.query(batchQuery, [
            outlet_id,
            product_id,
          ]);

          if (batchResult.rows.length === 0) {
            throw new Error(`Not enough stock for product ID ${product_id}.`);
          }

          for (const batch of batchResult.rows) {
            if (remainingQuantity <= 0) break;

            const quantityToTake = Math.min(batch.kuantitas, remainingQuantity);
            remainingQuantity -= quantityToTake;

            const insertDetailQuery = `
    INSERT INTO brandis.detail_penjualan (penjualan_id, batch_id, kuantitas_terjual) 
    VALUES ($1, $2, $3);
  `;
            await client.query(insertDetailQuery, [
              saleId,
              batch.batch_id,
              quantityToTake,
            ]);

            const updateOutletStockQuery = `
    UPDATE brandis.stok_outlet
    SET kuantitas = kuantitas - $1
    WHERE outlet_id = $2 AND batch_id = $3;
  `;
            await client.query(updateOutletStockQuery, [
              quantityToTake,
              outlet_id,
              batch.batch_id,
            ]);

            batchesUsed.push({
              batch_id: batch.batch_id,
              quantity_sold: quantityToTake,
            });
          }

          if (remainingQuantity > 0) {
            throw new Error(
              `Not enough stock to fulfill the request for product ID ${product_id}. Remaining: ${remainingQuantity}`
            );
          }
        } catch (error) {
          throw new Error(
            `Failed to process batches for product ID ${product_id}: ${error}`
          );
        }

        saleResponses.push({
          product_id,
          batches_used: batchesUsed,
        });
      }

      await client.query("COMMIT");
      return { saleId, saleDetails: saleResponses };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Transaction failed: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  }
}
