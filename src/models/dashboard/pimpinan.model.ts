import { Pool } from "pg";

export class PimpinanModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }
  // Total Sales for the current month, showing outlet, product details, quantity sold, and total price
  async getTotalPenjualan() {
    const query = `
    SELECT
      o.nama AS outlet_name,
      pr.nama AS product_name,
      SUM(dp.kuantitas_terjual) AS quantity_sold,
      SUM(dp.kuantitas_terjual * pr.harga) AS total_sales
    FROM brandis.detail_penjualan dp
    JOIN brandis.penjualan p ON dp.penjualan_id = p.id
    JOIN brandis.outlet o ON p.outlet_id = o.id
    JOIN brandis.batch b ON dp.batch_id = b.id
    JOIN brandis.produk pr ON b.produk_id = pr.id
    WHERE DATE_PART('month', p.dibuat_pada) = DATE_PART('month', CURRENT_DATE)
      AND DATE_PART('year', p.dibuat_pada) = DATE_PART('year', CURRENT_DATE)
    GROUP BY o.nama, pr.nama
    ORDER BY o.nama, total_sales DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Total Distribution for the current month, showing outlet, product details, quantity distributed, and total distribution
  async getTotalDistribusi() {
    const query = `
    SELECT
      o.nama AS outlet_name,
      pr.nama AS product_name,
      SUM(dd.kuantitas_terjual) AS quantity_distributed,
      SUM(dd.kuantitas_terjual * pr.harga) AS total_distribution
    FROM brandis.detail_distribusi dd
    JOIN brandis.distribusi d ON dd.distribusi_id = d.id
    JOIN brandis.outlet o ON d.outlet_id = o.id
    JOIN brandis.batch b ON dd.batch_id = b.id
    JOIN brandis.produk pr ON b.produk_id = pr.id
    WHERE DATE_PART('month', d.dibuat_pada) = DATE_PART('month', CURRENT_DATE)
      AND DATE_PART('year', d.dibuat_pada) = DATE_PART('year', CURRENT_DATE)
    GROUP BY o.nama, pr.nama
    ORDER BY o.nama, total_distribution DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Top 5 Most Sold Products in the last month with quantity sold and total sales
  async getTopProdukTerlaris() {
    const query = `
    SELECT
      pr.nama AS product_name,
      SUM(dp.kuantitas_terjual) AS quantity_sold,
      SUM(dp.kuantitas_terjual * pr.harga) AS total_sales
    FROM brandis.detail_penjualan dp
    JOIN brandis.batch b ON dp.batch_id = b.id
    JOIN brandis.produk pr ON b.produk_id = pr.id
    JOIN brandis.penjualan p ON dp.penjualan_id = p.id
    WHERE p.dibuat_pada >= CURRENT_DATE - INTERVAL '1 month'
    GROUP BY pr.nama
    ORDER BY total_sales DESC
    LIMIT 5;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Total Stock in the Warehouse, detailed per product
  async getTotalStokGudang() {
    const query = `
    SELECT
      pr.nama AS product_name,
      SUM(b.kuantitas) AS total_stock
    FROM brandis.batch b
    JOIN brandis.produk pr ON b.produk_id = pr.id
    GROUP BY pr.nama
    ORDER BY total_stock DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Count of Expiring Batches within the next 30 days, with product details
  async getBatchKadaluarsa() {
    const query = `
    SELECT
      COUNT(*) AS total_batch_kadaluarsa,
      pr.nama AS product_name,
      b.tanggal_kadaluarsa AS expiry_date
    FROM brandis.batch b
    JOIN brandis.produk pr ON b.produk_id = pr.id
    WHERE b.tanggal_kadaluarsa <= CURRENT_DATE + INTERVAL '30 days'
    GROUP BY pr.nama, b.tanggal_kadaluarsa
    ORDER BY b.tanggal_kadaluarsa;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}
