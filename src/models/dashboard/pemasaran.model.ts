//src\models\dashboard\pemasaran.model.ts
import { Pool } from "pg";

export class PemasaranModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  async getTotalStokOutlet() {
    const query = `
    SELECT 
      o.nama AS outlet_nama, 
      COUNT(DISTINCT pr.id) AS jumlah_produk, 
      SUM(so.kuantitas) AS total_kuantitas
    FROM brandis.stok_outlet so
    JOIN brandis.outlet o ON so.outlet_id = o.id
    JOIN brandis.batch b ON so.batch_id = b.id
    JOIN brandis.produk pr ON b.produk_id = pr.id
    GROUP BY o.nama
    ORDER BY o.nama;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getOutletStokRendah() {
    const query = `
     SELECT 
    o.nama AS outlet_nama, 
    pr.nama AS produk_nama, 
    SUM(so.kuantitas) AS stok
FROM brandis.stok_outlet so
JOIN brandis.outlet o ON so.outlet_id = o.id
JOIN brandis.batch b ON so.batch_id = b.id
JOIN brandis.produk pr ON b.produk_id = pr.id
GROUP BY o.nama, pr.nama
HAVING SUM(so.kuantitas) < 20
ORDER BY stok ASC;

    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getOutletTerbaik() {
    const query = `
    SELECT 
    o.nama AS outlet_nama,
    SUM(dp.kuantitas_terjual) AS total_terjual
FROM brandis.detail_penjualan dp
JOIN brandis.penjualan p ON dp.penjualan_id = p.id
JOIN brandis.outlet o ON p.outlet_id = o.id
GROUP BY o.nama
ORDER BY total_terjual DESC
LIMIT 3;

    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getOutletTerendah() {
    const query = `
    SELECT 
    o.nama AS outlet_nama,
    SUM(dp.kuantitas_terjual) AS total_terjual
FROM brandis.detail_penjualan dp
JOIN brandis.penjualan p ON dp.penjualan_id = p.id
JOIN brandis.outlet o ON p.outlet_id = o.id
GROUP BY o.nama
ORDER BY total_terjual ASC
LIMIT 3;

    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getTotalProdukDikembalikan() {
    const query = `
    SELECT 
      o.nama AS outlet_nama,
      pr.nama AS produk_nama, 
      SUM(dp.kuantitas) AS total_dikembalikan,
      TRIM(TO_CHAR(pg.tanggal_pengembalian, 'Month')) AS bulan_pengembalian
    FROM brandis.detail_pengembalian dp
    JOIN brandis.pengembalian pg ON dp.pengembalian_id = pg.id
    JOIN brandis.outlet o ON pg.outlet_id = o.id
    JOIN brandis.batch b ON dp.batch_id = b.id
    JOIN brandis.produk pr ON b.produk_id = pr.id
    WHERE DATE_TRUNC('month', pg.tanggal_pengembalian) = DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY o.nama, pr.nama, bulan_pengembalian
    ORDER BY total_dikembalikan DESC;
  `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}
