import { PemasaranModel } from "../../models/dashboard/pemasaran.model";

export class PemasaranService {
  private pemasaranModel: PemasaranModel;

  constructor(pemasaranModel: PemasaranModel) {
    this.pemasaranModel = pemasaranModel;
  }

  async getTotalStokOutlet() {
    return this.pemasaranModel.getTotalStokOutlet();
  }

  async getOutletStokRendah() {
    return this.pemasaranModel.getOutletStokRendah();
  }

  async getOutletTerbaik() {
    return this.pemasaranModel.getOutletTerbaik();
  }

  async getOutletTerendah() {
    return this.pemasaranModel.getOutletTerendah();
  }

  async getTotalProdukDikembalikan() {
    return this.pemasaranModel.getTotalProdukDikembalikan();
  }
}
