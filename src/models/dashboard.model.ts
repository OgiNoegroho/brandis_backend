//src\models\dashboard.model.ts
import { Pool } from "pg";

export class DashboardModel {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }
  
  //PIMPINAN
  // Total Penjualan (bulan ini)
  async getTotalPenjualan() {
    const query = `
      SELECT SUM(dp.kuantitas_terjual) AS total_penjualan
      FROM brandis.detail_penjualan dp
      JOIN brandis.penjualan p ON dp.penjualan_id = p.id
      WHERE DATE_PART('month', p.dibuat_pada) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', p.dibuat_pada) = DATE_PART('year', CURRENT_DATE);
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Total Distribusi (bulan ini)
  async getTotalDistribusi() {
    const query = `
      SELECT SUM(dd.kuantitas_terjual) AS total_distribusi
      FROM brandis.detail_distribusi dd
      JOIN brandis.distribusi d ON dd.distribusi_id = d.id
      WHERE DATE_PART('month', d.dibuat_pada) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', d.dibuat_pada) = DATE_PART('year', CURRENT_DATE);
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Top 5 Produk Terlaris
  async getTopProdukTerlaris() {
    const query = `
      SELECT pr.nama AS nama_produk, SUM(dp.kuantitas_terjual) AS total_terjual
FROM brandis.detail_penjualan dp
JOIN brandis.batch b ON dp.batch_id = b.id
JOIN brandis.produk pr ON b.produk_id = pr.id
JOIN brandis.penjualan p ON dp.penjualan_id = p.id
WHERE p.dibuat_pada >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY pr.nama
ORDER BY total_terjual DESC
LIMIT 5;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Total Stok di Gudang
  async getTotalStokGudang() {
    const query = `
      SELECT SUM(kuantitas) AS total_stok_gudang
      FROM brandis.batch;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Batch Kadaluarsa atau Mendekati Kadaluarsa
  async getBatchKadaluarsa() {
    const query = `
      SELECT COUNT(*) AS total_batch_kadaluarsa
      FROM brandis.batch
      WHERE tanggal_kadaluarsa <= CURRENT_DATE + INTERVAL '30 days';
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  //MARKETING
  // Total Stok Outlet
  async getTotalStokOutlet() {
    const query = `
      SELECT SUM(kuantitas) AS total_stok_outlet
      FROM brandis.stok_outlet;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  // Outlet dengan Stok Rendah
async getOutletStokRendah() {
    const query = `
      SELECT o.nama AS outlet_nama, SUM(so.kuantitas) AS stok
      FROM brandis.stok_outlet so
      JOIN brandis.outlet o ON so.outlet_id = o.id
      GROUP BY o.nama
      HAVING SUM(so.kuantitas) < 20;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
  
  // Penjualan Outlet Terbaik
  async getOutletTerbaik() {
    const query = `
      SELECT o.nama AS outlet_nama, SUM(dp.kuantitas_terjual) AS total_terjual
      FROM brandis.detail_penjualan dp
      JOIN brandis.penjualan p ON dp.penjualan_id = p.id
      JOIN brandis.outlet o ON p.outlet_id = o.id
      GROUP BY o.nama
      ORDER BY total_terjual DESC
      LIMIT 1;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
  
  // Penjualan Outlet Terendah
  async getOutletTerendah() {
    const query = `
      SELECT o.nama AS outlet_nama, SUM(dp.kuantitas_terjual) AS total_terjual
      FROM brandis.detail_penjualan dp
      JOIN brandis.penjualan p ON dp.penjualan_id = p.id
      JOIN brandis.outlet o ON p.outlet_id = o.id
      GROUP BY o.nama
      ORDER BY total_terjual ASC
      LIMIT 1;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
  

  // Total Produk Dikembalikan
  async getTotalProdukDikembalikan() {
    const query = `
      SELECT SUM(dp.kuantitas) AS total_produk_dikembalikan
      FROM brandis.detail_pengembalian dp
      JOIN brandis.pengembalian p ON dp.pengembalian_id = p.id
      WHERE DATE_PART('month', p.tanggal_pengembalian) = DATE_PART('month', CURRENT_DATE);
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  //BENDAHARA

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

    async getPendapatanBulanIni() {
        const query = `
        SELECT SUM(jumlah_dibayar) AS total_pendapatan
        FROM brandis.faktur_penjualan
        WHERE DATE_PART('month', dibuat_pada) = DATE_PART('month', CURRENT_DATE)
            AND DATE_PART('year', dibuat_pada) = DATE_PART('year', CURRENT_DATE);
        `;
        const result = await this.dbPool.query(query);
        return result.rows;
    }

    async getFakturJatuhTempoHariIni() {
        const query = `
        SELECT COUNT(*) AS faktur_jatuh_tempo
        FROM brandis.faktur_penjualan
        WHERE tanggal_jatuh_tempo = CURRENT_DATE;
        `;
        const result = await this.dbPool.query(query);
        return result.rows;
    }

  //MANAJER
  async getBatchDiproduksiBulanIni() {
    const query = `
      SELECT COUNT(*) AS batch_diproduksi
      FROM brandis.batch
      WHERE DATE_PART('month', dibuat_pada) = DATE_PART('month', CURRENT_DATE)
        AND DATE_PART('year', dibuat_pada) = DATE_PART('year', CURRENT_DATE);
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getStokRendahDiGudang() {
    const query = `
      SELECT nama, kuantitas
      FROM brandis.batch
      WHERE kuantitas < 20;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }

  async getTotalPengembalianProduk() {
    const query = `
      SELECT SUM(dp.kuantitas) AS total_produk_dikembalikan
      FROM brandis.detail_pengembalian dp;
    `;
    const result = await this.dbPool.query(query);
    return result.rows;
  }
}


      

