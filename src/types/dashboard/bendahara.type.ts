// //src\types\dashboard\bendahara.type.ts

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

export interface OverdueInvoice {
  id: string;
  status_pembayaran: string;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
}
