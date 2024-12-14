import { Request, Response } from 'express';
import { DistributionService } from '../services/distribution.service';
import { Distribusi, DetailDistribusi, CreateDistributionRequestBody, StatusPembayaran } from '../types/distribution.type';

export class DistributionController {
  constructor(private distributionService: DistributionService) {}

  async createDistribution(req: Request, res: Response) {
    try {
      const { outlet_id, faktur_id, status_pembayaran, tanggal_faktur, tanggal_jatuh_tempo, details }: CreateDistributionRequestBody = req.body;

      // Ensure status_pembayaran is a valid value from StatusPembayaran enum
      if (!Object.values(StatusPembayaran).includes(status_pembayaran)) {
        throw new Error('Invalid status_pembayaran');
      }

      const distribution: Distribusi = {
        outlet_id
      };

      const distributionDetails: DetailDistribusi[] = details.map((detail) => ({
        batch_id: detail.batch_id,
        kuantitas_terjual: detail.kuantitas_terjual
      }));

      // Now, create both the distribution and faktur in a single transaction
      const result = await this.distributionService.createDistributionWithFaktur(
        distribution,
        distributionDetails,
        faktur_id,
        status_pembayaran,
        tanggal_faktur,
        tanggal_jatuh_tempo
      );

      // Return the result, which will include distribusi_id and faktur_id
      res.status(201).json({
        distribusi_id: result.distribusi_id,
        faktur_id: result.faktur_id
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  // Fetch all distributions by outlet ID
  async getAllDistribusi(req: Request, res: Response) {
    try {
      const { outlet_id } = req.params;

      const distributions = await this.distributionService.getAllDistribusi(Number(outlet_id));

      res.status(200).json(distributions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  // Fetch distribution details by distribution ID
  async getDistribusiById(req: Request, res: Response) {
    try {
      const { distribusi_id } = req.params;

      const distributionDetails = await this.distributionService.getDistribusiById(Number(distribusi_id));

      res.status(200).json(distributionDetails);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  // Fetch invoice details by distribution ID
  async getFakturDistribusi(req: Request, res: Response) {
    try {
      const { distribusi_id } = req.params;

      const invoice = await this.distributionService.getFakturDistribusi(Number(distribusi_id));

      res.status(200).json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }
}
