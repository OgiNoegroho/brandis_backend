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
