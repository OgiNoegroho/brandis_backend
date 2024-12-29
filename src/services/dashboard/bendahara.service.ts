import { BendaharaModel } from "../../models/dashboard/bendahara.model";

export class BendaharaService {
  private bendaharaModel: BendaharaModel;

  constructor(bendaharaModel: BendaharaModel) {
    this.bendaharaModel = bendaharaModel;
  }

  async getOverdueInvoices() {
    return this.bendaharaModel.getOverdueInvoices();
  }

  async getFinancialSummaryByOutlet() {
    return this.bendaharaModel.getFinancialSummaryByOutlet();
  }

  async getPaymentStatusDistribution() {
    return this.bendaharaModel.getPaymentStatusDistribution();
  }
}
