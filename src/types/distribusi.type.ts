// src/routes/distribution.type.ts

export enum StatusPembayaran {
  LUNAS = "Lunas",
  MENUNGGU = "Menunggu",
  JATUH_TEMPO = "Jatuh Tempo",
}

export interface Distribusi {
  id?: number;
  outlet_id: number;
  dibuat_pada?: Date;
  diperbarui_pada?: Date;
}

export interface DetailDistribusi {
  id?: number;
  distribusi_id?: number;
  batch_id: number;
  kuantitas_terjual: number;
  dibuat_pada?: Date;
  diperbarui_pada?: Date;
}

export interface FakturDistribusi {
  id: string;
  distribusi_id: number;
  status_pembayaran: StatusPembayaran;
  tanggal_faktur: Date;
  tanggal_jatuh_tempo: Date;
  jumlah_tagihan: number;
  jumlah_dibayar?: number;
  dibuat_pada?: Date;
  diperbarui_pada?: Date;
}

// Request body types
export interface CreateDistributionRequestBody {
  outlet_id: number;
  faktur_id: string;
  status_pembayaran: StatusPembayaran;
  tanggal_faktur: string; // Can be converted to Date in your controller
  tanggal_jatuh_tempo: string; // Can be converted to Date in your controller
  details: {
    batch_id: number;
    kuantitas_terjual: number;
  }[];
}

// Add these interfaces to existing types
export interface DistribusiWithDetails extends Distribusi {
  details?: DetailDistribusiWithProductInfo[];
}

export interface DetailDistribusiWithProductInfo extends DetailDistribusi {
  batch_name?: string;
  product_name?: string;
}

export interface FakturDistribusiWithDetails extends FakturDistribusi {
  outlet_name?: string;
  outlet_address?: string;
  invoice_details?: {
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}
