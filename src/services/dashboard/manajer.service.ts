//src\services\dashboard.service.ts
import { ManajerModel } from "../../models/dashboard/manajer.model";

export class ManajerService {
  private manajerModel: ManajerModel;

  constructor(manajerModel: ManajerModel) {
    this.manajerModel = manajerModel;
  }
  // MANAJER
  async getBatchDiproduksiBulanIni() {
    return this.manajerModel.getBatchDiproduksiBulanIni();
  }

  async getStokRendahDiGudang() {
    return this.manajerModel.getStokRendahDiGudang();
  }

  async getTotalPengembalianProduk() {
    return this.manajerModel.getTotalPengembalianProduk();
  }
}
