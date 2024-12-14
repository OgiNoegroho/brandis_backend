import { DistributionModel } from '../models/distribution.model';
import { Distribusi, DetailDistribusi, FakturDistribusi, StatusPembayaran } from '../types/distribution.type';

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
      throw new Error('Outlet ID is required');
    }

    if (!details || details.length === 0) {
      throw new Error('Distribution must have at least one detail');
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

  // This method handles creating the faktur in the database
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
}
