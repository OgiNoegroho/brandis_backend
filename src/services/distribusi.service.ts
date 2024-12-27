// src/routes/distribution.service.ts

import { DistributionModel } from "../models/distribusi.model";
import {
  Distribusi,
  DetailDistribusi,
  FakturDistribusi,
  StatusPembayaran,
} from "../types/distribusi.type";

export class DistributionService {
  constructor(private distributionModel: DistributionModel) {}

  async createDistributionWithFaktur(
    distribution: Distribusi,
    details: DetailDistribusi[],
    faktur_id: string,
    status_pembayaran: StatusPembayaran,
    tanggal_faktur: string,
    tanggal_jatuh_tempo: string
  ) {
    // Validate input
    if (!distribution.outlet_id) {
      throw new Error("Outlet ID is required");
    }

    if (!details || details.length === 0) {
      throw new Error("Distribution must have at least one detail");
    }

    // Call the model to handle the transaction for both Distribusi and Faktur
    return this.distributionModel.createDistributionAndFakturTransaction(
      distribution,
      details,
      faktur_id,
      status_pembayaran,
      tanggal_faktur,
      tanggal_jatuh_tempo
    );
  }

  async createFaktur(faktur: FakturDistribusi) {
    return this.distributionModel.createFaktur(faktur);
  }

  async getAllDistribusi(outlet_id: number) {
    return this.distributionModel.getAllDistribusi(outlet_id);
  }

  async getDistribusiById(distribusi_id: number) {
    return this.distributionModel.getDistribusiById(distribusi_id);
  }

  async getFakturDistribusi(distribusi_id: number) {
    return this.distributionModel.getFakturDistribusi(distribusi_id);
  }

  // Service method to update Faktur status
  async updateFakturStatus(
    faktur_id: string,
    status_pembayaran: StatusPembayaran
  ) {
    // Validate input
    if (!faktur_id || !status_pembayaran) {
      throw new Error("Faktur ID and status are required");
    }

    // Call the model method to update the faktur status in the database
    return await this.distributionModel.updateFakturStatus(
      faktur_id,
      status_pembayaran
    );
  }

  // Service method to add to jumlah_dibayar
  async addToFakturAmountPaid(faktur_id: string, jumlah_dibayar: number) {
    // Validate input
    if (!faktur_id || jumlah_dibayar === undefined) {
      throw new Error("Faktur ID and jumlah_dibayar are required");
    }

    // Call the model method to add the amount to jumlah_dibayar
    return await this.distributionModel.addToFakturAmountPaid(
      faktur_id,
      jumlah_dibayar
    );
  }
}
