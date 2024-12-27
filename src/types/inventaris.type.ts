export interface BatchDetails {
  id: number;                  // batch_id in the database
  nama: string;                // nama in the batch table
  kuantitas: number;           // kuantitas in the batch table
  tanggal_kadaluarsa: Date;    // tanggal_kadaluarsa in the batch table
  dibuat_pada: Date;           // dibuat_pada in the batch table
  diperbarui_pada: Date;       // diperbarui_pada in the batch table
}

export interface Inventory {
  nama: string;                // nama in the produk table
  kuantitas: number;           // kuantitas (aggregated from batch kuantitas)
  ketersediaan: string;        // a derived value for availability (based on business rules)
}

export interface InventoryDTO {
  nama: string;                // nama in the batch table
  produk_id: number;           // produk_id in the batch table
  kuantitas: number;           // kuantitas in the batch table
  tanggal_kadaluarsa: Date;    // tanggal_kadaluarsa in the batch table
}
