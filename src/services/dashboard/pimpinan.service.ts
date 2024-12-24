import { PimpinanModel } from "../../models/dashboard/pimpinan.model";

export class PimpinanService {
  private pimpinanModel: PimpinanModel;

  constructor(pimpinanModel: PimpinanModel) {
    this.pimpinanModel = pimpinanModel;
  }

  // Retrieve total sales for the current month
  async getTotalPenjualan() {
    return this.pimpinanModel.getTotalPenjualan();
  }

  // Retrieve total distribution for the current month
  async getTotalDistribusi() {
    return this.pimpinanModel.getTotalDistribusi();
  }

  // Retrieve top 5 most sold products for the last month
  async getTopProdukTerlaris() {
    return this.pimpinanModel.getTopProdukTerlaris();
  }

  // Retrieve total stock in the warehouse
  async getTotalStokGudang() {
    return this.pimpinanModel.getTotalStokGudang();
  }

  // Retrieve number of batches expiring in the next 30 days
  async getBatchKadaluarsa() {
    return this.pimpinanModel.getBatchKadaluarsa();
  }
}
