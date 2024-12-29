// src/types/fakturStatus.type.ts

export interface FakturJatuhTempo {
  id: number;
  faktur_id: string;
  distribusi_id: number;
  tanggal_faktur: Date;
  tanggal_jatuh_tempo: Date;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
  status_awal: string;
  status_akhir: string;
  dibuat_pada: Date;
}

export interface FakturStatusLog {
  id: number;
  faktur_id: string;
  tanggal_perubahan: Date;
  status_awal: string;
  status_akhir: string;
  dibuat_pada: Date;
}

export interface FakturStatusSummary {
  total_belum_lunas: number;
  total_jatuh_tempo: number;
  total_tagihan_belum_lunas: string;
  total_tagihan_jatuh_tempo: string;
}
