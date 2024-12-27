import { LaporanOutletModel } from "../models/laporanOutlet.model";
import { StatusPembayaran } from "../types/laporanOutlet.type";

export class LaporanOutletService {
  constructor(private laporanoutletModel: LaporanOutletModel) {}

  async getAllLaporanDistribusi(outlet_id: number) {
    return this.laporanoutletModel.getAllLaporanDistribusi(outlet_id);
  }

  async updateFakturStatus(
    faktur_id: string,
    status_pembayaran: StatusPembayaran
  ) {
    if (!faktur_id || !status_pembayaran) {
      throw new Error("Faktur ID and status_pembayaran are required");
    }

    return await this.laporanoutletModel.updateFakturStatus(
      faktur_id,
      status_pembayaran
    );
  }

  async addToFakturAmountPaid(faktur_id: string, jumlah_dibayar: number) {
    if (!faktur_id || jumlah_dibayar === undefined) {
      throw new Error("Faktur ID and jumlah_dibayar are required");
    }

    return await this.laporanoutletModel.addToFakturAmountPaid(
      faktur_id,
      jumlah_dibayar
    );
  }
}
