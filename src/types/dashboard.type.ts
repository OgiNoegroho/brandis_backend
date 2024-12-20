//src\types\dashboard.type.ts
export interface TotalPenjualan {
    total_penjualan: number;
  }
  
  export interface TotalDistribusi {
    total_distribusi: number;
  }
  
  export interface TopProdukTerlaris {
    nama_produk: string;
    total_terjual: number;
  }
  
  export interface TotalStokGudang {
    total_stok_gudang: number;
  }
  
  export interface BatchKadaluarsa {
    total_batch_kadaluarsa: number;
  }
  
  export interface TotalStokOutlet {
    total_stok_outlet: number;
  }
  
  export interface OutletStokRendah {
    outlet_id: string;
    stok: number;
  }
  
  export interface OutletTerbaik {
    outlet_id: string;
    total_terjual: number;
  }
  
  export interface OutletTerendah {
    outlet_id: string;
    total_terjual: number;
  }
  
  export interface TotalProdukDikembalikan {
    total_produk_dikembalikan: number;
  }
  
  export interface RingkasanFakturDistribusi {
    status_pembayaran: string;
    total_tagihan: number;
  }
  
  export interface PendapatanBulanIni {
    total_pendapatan: number;
  }
  
  export interface FakturJatuhTempoHariIni {
    faktur_jatuh_tempo: number;
  }
  
  export interface BatchDiproduksiBulanIni {
    batch_diproduksi: number;
  }
  
  export interface StokRendahDiGudang {
    nama: string;
    kuantitas: number;
  }
  
  export interface TotalPengembalianProduk {
    total_produk_dikembalikan: number;
  }