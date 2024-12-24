import { BendaharaModel } from "../../models/dashboard/bendahara.model";

export class BendaharaService {
  private bendaharaModel: BendaharaModel;

  constructor(bendaharaModel: BendaharaModel) {
    this.bendaharaModel = bendaharaModel;
  }

  // BENDAHARA

  async getRingkasanFakturDistribusi() {
    return this.bendaharaModel.getRingkasanFakturDistribusi();
  }

  async getPendapatanBulanIni() {
    return this.bendaharaModel.getPendapatanBulanIni();
  }

  async getFakturJatuhTempoHariIni() {
    return this.bendaharaModel.getFakturJatuhTempoHariIni();
  }
}
