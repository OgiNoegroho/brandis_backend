export interface TotalOutstandingInvoices {
  total_outstanding_invoices: number;
  total_outstanding_amount: number;
}

export interface OverdueInvoice {
  faktur_id: string;
  distribusi_id: string;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  overdue_days: number;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
  sisa_tagihan: number;
}

export interface FinancialSummaryByOutlet {
  outlet_name: string;
  total_invoices: number;
  total_tagihan: number;
  total_dibayar: number;
  total_outstanding: number;
}

export interface MonthlyFinancialTrends {
  bulan: string;
  jumlah_faktur: number;
  total_tagihan: number;
  total_dibayar: number;
  total_outstanding: number;
}

export interface PaymentStatusDistribution {
  status_pembayaran: string;
  jumlah_faktur: number;
  total_tagihan: number;
  total_dibayar: number;
}
