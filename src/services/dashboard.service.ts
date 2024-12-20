//src\services\dashboard.service.ts
import { DashboardModel } from "../models/dashboard.model";

export class DashboardService {
  private dashboardModel: DashboardModel;

  constructor(dashboardModel: DashboardModel) {
    this.dashboardModel = dashboardModel;
  }

   // PIMPINAN
   async getTotalPenjualan() {
    return this.dashboardModel.getTotalPenjualan();
  }

  async getTotalDistribusi() {
    return this.dashboardModel.getTotalDistribusi();
  }

  async getTopProdukTerlaris() {
    return this.dashboardModel.getTopProdukTerlaris();
  }

  async getTotalStokGudang() {
    return this.dashboardModel.getTotalStokGudang();
  }

  async getBatchKadaluarsa() {
    return this.dashboardModel.getBatchKadaluarsa();
  }

  // MARKETING
  async getTotalStokOutlet() {
    return this.dashboardModel.getTotalStokOutlet();
  }

  async getOutletStokRendah() {
    return this.dashboardModel.getOutletStokRendah();
  }

  async getOutletTerbaik() {
    return this.dashboardModel.getOutletTerbaik();
  }

  async getOutletTerendah() {
    return this.dashboardModel.getOutletTerendah();
  }

  async getTotalProdukDikembalikan() {
    return this.dashboardModel.getTotalProdukDikembalikan();
  }

  // BENDAHARA

  async getRingkasanFakturDistribusi() {
    return this.dashboardModel.getRingkasanFakturDistribusi();
  }

  async getPendapatanBulanIni() {
    return this.dashboardModel.getPendapatanBulanIni();
  }

  async getFakturJatuhTempoHariIni() {
    return this.dashboardModel.getFakturJatuhTempoHariIni();
  }

  // MANAJER
  async getBatchDiproduksiBulanIni() {
    return this.dashboardModel.getBatchDiproduksiBulanIni();
  }

  async getStokRendahDiGudang() {
    return this.dashboardModel.getStokRendahDiGudang();
  }

  async getTotalPengembalianProduk() {
    return this.dashboardModel.getTotalPengembalianProduk();
  }
}
