// src/types/notifikasiFaktur.type.ts

export interface InvoiceNotification {
  id: number;
  faktur_id: string;
  status_notifikasi: string;
  alasan: string | null;
  tanggal_notifikasi: string;
  distribusi_id: number;
  outlet_id: number;
}
