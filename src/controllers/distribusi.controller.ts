// src/routes/distribution.controller.ts

import { Request, Response } from "express";
import { DistributionService } from "../services/distribusi.service";
import {
  Distribusi,
  DetailDistribusi,
  CreateDistributionRequestBody,
  StatusPembayaran,
} from "../types/distribusi.type";

export class DistributionController {
  constructor(private distributionService: DistributionService) {}

  async createDistribution(req: Request, res: Response) {
    try {
      const {
        outlet_id,
        faktur_id,
        status_pembayaran,
        tanggal_faktur,
        tanggal_jatuh_tempo,
        details,
      }: CreateDistributionRequestBody = req.body;

      if (!Object.values(StatusPembayaran).includes(status_pembayaran)) {
        throw new Error("Invalid status_pembayaran");
      }

      const distribution: Distribusi = {
        outlet_id,
      };

      const distributionDetails: DetailDistribusi[] = details.map((detail) => ({
        batch_id: detail.batch_id,
        kuantitas_terjual: detail.kuantitas_terjual,
      }));

      const result =
        await this.distributionService.createDistributionWithFaktur(
          distribution,
          distributionDetails,
          faktur_id,
          status_pembayaran,
          tanggal_faktur,
          tanggal_jatuh_tempo
        );

      res.status(201).json({
        distribusi_id: result.distribusi_id,
        faktur_id: result.faktur_id,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async getAllDistribusi(req: Request, res: Response) {
    try {
      const { outlet_id } = req.params;

      const distributions = await this.distributionService.getAllDistribusi(
        Number(outlet_id)
      );

      res.status(200).json(distributions);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async getDistribusiById(req: Request, res: Response) {
    try {
      const { distribusi_id } = req.params;

      const distributionDetails =
        await this.distributionService.getDistribusiById(Number(distribusi_id));

      res.status(200).json(distributionDetails);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async getFakturDistribusi(req: Request, res: Response) {
    try {
      const { distribusi_id } = req.params;

      const invoice = await this.distributionService.getFakturDistribusi(
        Number(distribusi_id)
      );

      res.status(200).json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unknown error occurred" });
      }
    }
  }

  async updateFakturStatus(req: Request, res: Response): Promise<void> {
    const faktur_id = req.params.faktur_id;
    const { status_pembayaran } = req.body;

    if (!faktur_id || !status_pembayaran) {
      res.status(400).json({ error: "Faktur ID and status are required" });
      return;
    }

    try {
      // Ensure status_pembayaran is a valid value from StatusPembayaran enum
      if (!Object.values(StatusPembayaran).includes(status_pembayaran)) {
        res.status(400).json({ error: "Invalid status_pembayaran" });
        return;
      }

      const updatedFaktur = await this.distributionService.updateFakturStatus(
        faktur_id,
        status_pembayaran as StatusPembayaran
      );

      res.status(200).json(updatedFaktur);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  // Controller method to handle adding to jumlah_dibayar
  async addToFakturAmountPaid(req: Request, res: Response): Promise<void> {
    const faktur_id = req.params.faktur_id; // Get faktur_id from the route parameter
    const { jumlah_dibayar } = req.body;

    if (!faktur_id || jumlah_dibayar === undefined) {
      res
        .status(400)
        .json({ error: "Faktur ID and jumlah_dibayar are required" });
      return;
    }

    try {
      const updatedFaktur =
        await this.distributionService.addToFakturAmountPaid(
          faktur_id,
          jumlah_dibayar
        );
      res.status(200).json(updatedFaktur); // Send updated faktur details as response
    } catch (error) {
      console.error("Error adding to jumlah_dibayar:", error);

      // Check if error is an instance of Error (to safely access the message)
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          // Handle specific error when faktur not found
          res.status(404).json({ error: "Faktur not found" });
        } else if (error.message.includes("exceeds")) {
          // Handle specific error when the payment exceeds the outstanding balance
          res
            .status(400)
            .json({ error: "Payment exceeds the outstanding balance" });
        } else {
          // General error
          res.status(500).json({ error: error.message });
        }
      } else {
        // Handle unknown errors
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  }
}
