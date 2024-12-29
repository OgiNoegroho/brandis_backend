// //src\types\dashboard\bendahara.type.ts

// Total Outstanding Invoices
export interface TotalOutstandingInvoices {
  total_outstanding_invoices: number;
  total_outstanding_amount: number;
}

// Overdue Invoices (Details of overdue invoices)
export interface OverdueInvoice {
  faktur_id: string;
  distribusi_id: string;
  tanggal_faktur: string;       // The date of invoice creation
  tanggal_jatuh_tempo: string;  // The due date of the invoice
  overdue_days: number;         // Days overdue
  jumlah_tagihan: number;       // The total amount due
  jumlah_dibayar: number;       // The amount already paid
  sisa_tagihan: number;         // The remaining balance
}

// Financial Summary by Outlet (Summary per outlet)
export interface FinancialSummaryByOutlet {
  outlet_name: string;          // Name of the outlet
  total_invoices: number;       // Total invoices for the outlet
  total_tagihan: number;        // Total billed amount for the outlet
  total_dibayar: number;        // Total amount paid for the outlet
  total_outstanding: number;    // Total outstanding amount for the outlet
}

// Returns Summary (Summary of product returns)
export interface ReturnsSummary {
  alasan: string;               // Reason for the return
  jumlah_pengembalian: number;  // Number of return instances
  total_kuantitas_dikembalikan: number;  // Total quantity of items returned
}

// Monthly Financial Trends (Financial trends on a monthly basis)
export interface MonthlyFinancialTrends {
  bulan: string;                // The month (in YYYY-MM format)
  jumlah_faktur: number;        // Number of invoices in the month
  total_tagihan: number;        // Total billed amount in the month
  total_dibayar: number;        // Total paid amount in the month
  total_outstanding: number;    // Total outstanding amount in the month
}

// General Invoice Data (Used for invoice-related data responses)
export interface InvoiceData {
  faktur_id: string;
  outlet_id: string;
  tanggal_faktur: string;
  tanggal_jatuh_tempo: string;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
  status_pembayaran: string;    // Payment status (e.g., Lunas, Belum Lunas, Jatuh Tempo)
}

// Returns Data (Return transaction details)
export interface ReturnData {
  return_id: string;
  faktur_id: string;
  kuantitas: number;            // Quantity of returned items
  alasan: string;               // Reason for the return
  tanggal_pengembalian: string; // Date of return
}

// Financial Transactions (General financial transaction data)
export interface FinancialTransaction {
  transaction_id: string;
  faktur_id: string;
  jumlah_tagihan: number;
  jumlah_dibayar: number;
  tanggal_transaksi: string;
  jenis_transaksi: string;      // Type of transaction (e.g., Payment, Refund)
  status: string;               // Transaction status (e.g., Success, Failed)
}
