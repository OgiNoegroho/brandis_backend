import { Request, Response } from "express";
import { LaporanOutletService } from "../services/laporanOutlet.service";
import { StatusPembayaran } from "../types/laporanOutlet.type";

export class LaporanOutletController {
  constructor(private laporanoutletService: LaporanOutletService) {}

  async getAllLaporanDistribusi(req: Request, res: Response) {
    try {
      const { outlet_id } = req.params;

      const distributions = await this.laporanoutletService.getAllLaporanDistribusi(
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

  async updateFakturStatus(req: Request, res: Response): Promise<void> {
    const faktur_id = req.params.faktur_id;
    const { status_pembayaran } = req.body;

    if (!faktur_id || !status_pembayaran) {
      res
        .status(400)
        .json({ error: "Faktur ID and status_pembayaran are required" });
      return;
    }

    try {
      if (!Object.values(StatusPembayaran).includes(status_pembayaran)) {
        res.status(400).json({ error: "Invalid status_pembayaran value" });
        return;
      }

      const updatedFaktur = await this.laporanoutletService.updateFakturStatus(
        faktur_id,
        status_pembayaran as StatusPembayaran
      );

      res.status(200).json(updatedFaktur);
    } catch (error) {
      console.error("Error updating faktur status:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
      });
    }
  }

  async addToFakturAmountPaid(req: Request, res: Response): Promise<void> {
    const faktur_id = req.params.faktur_id;
    const { jumlah_dibayar } = req.body;

    if (!faktur_id || jumlah_dibayar === undefined) {
      res
        .status(400)
        .json({ error: "Faktur ID and jumlah_dibayar are required" });
      return;
    }

    try {
      const updatedFaktur =
        await this.laporanoutletService.addToFakturAmountPaid(
          faktur_id,
          jumlah_dibayar
        );

      res.status(200).json(updatedFaktur);
    } catch (error) {
      console.error("Error adding to jumlah_dibayar:", error);
      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ error: "Faktur not found" });
        } else if (error.message.includes("exceeds")) {
          res
            .status(400)
            .json({ error: "Payment exceeds the outstanding balance" });
        } else {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.status(500).json({ error: "An unexpected error occurred." });
      }
    }
  }
}
