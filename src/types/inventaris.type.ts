export interface BatchDetails {
  id: number;
  nama: string;
  kuantitas: number;
  tanggal_kadaluarsa: Date;
  dibuat_pada: Date;
  diperbarui_pada: Date;
}

export interface Inventory {
  nama: string;  
  kuantitas: number;
  ketersediaan: string;
}

export interface InventoryDTO {
  nama: string;
  produk_id: number;
  kuantitas: number;
  tanggal_kadaluarsa: Date;
}
