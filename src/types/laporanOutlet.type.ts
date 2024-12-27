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
  MENUNGGU = "Menunggu",
  JATUH_TEMPO = "Jatuh Tempo",
}
