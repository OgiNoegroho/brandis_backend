// src/types/laporanOutlet.type.ts

export interface Outlet {
  id?: number;
  nama: string;
  alamat: string;
  nomor_telepon?: string;
  dibuat_pada?: Date;
}


export enum StatusPembayaran {
  LUNAS = "Lunas",
  BELUM_LUNAS = "Belum Lunas",
  JATUH_TEMPO = "Jatuh Tempo",
}
