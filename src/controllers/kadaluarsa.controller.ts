import { ExpiredBatchService } from "../services/kadaluarsa.service";
import { ExpiredBatchModel } from "../models/kadaluarsa.model";
import { Pool } from "pg";
import { Request, Response } from "express";

export class ExpiredBatchController {
  constructor(private db: Pool) {}

  private getService(): ExpiredBatchService {
    const model = new ExpiredBatchModel(this.db);
    return new ExpiredBatchService(model);
  }

  async handleExpiredBatches(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      await service.moveExpiredBatches();
      res
        .status(200)
        .json({ message: "Expired batches processed successfully." });
    } catch (error) {
      console.error("Error processing expired batches:", error);
      res.status(500).json({ message: "Failed to process expired batches" });
    }
  }

  async getExpiredBatches(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      const logs = await service.getExpiredBatches();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching expired batches:", error);
      res.status(500).json({ message: "Failed to fetch expired batches" });
    }
  }
}
