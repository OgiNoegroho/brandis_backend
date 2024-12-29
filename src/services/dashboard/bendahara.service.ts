// //src\services\dashboard\bendahara.service.ts
import { BendaharaModel } from "../../models/dashboard/bendahara.model";

export class BendaharaService {
  private bendaharaModel: BendaharaModel;

  constructor(bendaharaModel: BendaharaModel) {
    this.bendaharaModel = bendaharaModel;
  }

  // Get total outstanding invoices
  async getTotalOutstandingInvoices() {
    return this.bendaharaModel.getTotalOutstandingInvoices();
  }

  // Get overdue invoices
  async getOverdueInvoices() {
    return this.bendaharaModel.getOverdueInvoices();
  }

  // Get financial summary by outlet
  async getFinancialSummaryByOutlet() {
    return this.bendaharaModel.getFinancialSummaryByOutlet();
  }

  // Get returns summary
  async getReturnsSummary() {
    return this.bendaharaModel.getReturnsSummary();
  }

  // Get monthly financial trends
  async getMonthlyFinancialTrends() {
    return this.bendaharaModel.getMonthlyFinancialTrends();
  }
}

