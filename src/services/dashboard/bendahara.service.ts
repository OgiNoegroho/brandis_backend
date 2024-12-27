// //src\services\dashboard\bendahara.service.ts
import { BendaharaModel } from "../../models/dashboard/bendahara.model";

export class BendaharaService {
  private bendaharaModel: BendaharaModel;

  constructor(bendaharaModel: BendaharaModel) {
    this.bendaharaModel = bendaharaModel;
  }

  // Get financial summary of Faktur Distribusi
  async getRingkasanFakturDistribusi() {
    return this.bendaharaModel.getRingkasanFakturDistribusi();
  }

  // Get current month revenue with optional filters for outlet or product
  async getPendapatanBulanIni(outletId?: number, productId?: number) {
    return this.bendaharaModel.getPendapatanBulanIni(outletId, productId);
  }

  // Get overdue invoices
  async getOverdueInvoices() {
    return this.bendaharaModel.getOverdueInvoices();
  }

  // Get invoices that are due today
  async getFakturJatuhTempoHariIni() {
    return this.bendaharaModel.getFakturJatuhTempoHariIni();
  }
}
