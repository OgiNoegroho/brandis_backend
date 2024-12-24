export interface TotalStokOutlet {
  outlet_nama: string;
  produk_nama: string;
  total_kuantitas: number;
}

export interface OutletStokRendah {
  outlet_nama: string;
  produk_nama: string;
  stok: number;
}

export interface OutletTerbaik {
  outlet_nama: string;
  produk_nama: string;
  total_terjual: number;
}

export interface OutletTerendah {
  outlet_nama: string;
  produk_nama: string;
  total_terjual: number;
}

export interface TotalProdukDikembalikan {
  produk_nama: string;
  total_dikembalikan: number;
  bulan: number;
}
