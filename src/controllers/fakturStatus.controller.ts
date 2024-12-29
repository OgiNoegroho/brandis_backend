// src/controllers/fakturStatus.controller.ts

import { FakturStatusService } from "../services/fakturStatus.service";
import { FakturStatusModel } from "../models/fakturStatus.model";
import { Pool } from "pg";
import { Request, Response } from "express";

export class FakturStatusController {
  constructor(private db: Pool) {}

  private getService(): FakturStatusService {
    const model = new FakturStatusModel(this.db);
    return new FakturStatusService(model);
  }

  async handleUpdateOverdueInvoices(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const service = this.getService();
      await service.updateOverdueInvoices();
      res.status(200).json({
        message: "Overdue invoices processed successfully.",
      });
    } catch (error) {
      console.error("Error processing overdue invoices:", error);
      res.status(500).json({
        message: "Failed to process overdue invoices",
      });
    }
  }

  async getStatusLogs(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      const logs = await service.getStatusLogs();
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching status logs:", error);
      res.status(500).json({
        message: "Failed to fetch status logs",
      });
    }
  }

  async getStatusSummary(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      const summary = await service.getStatusSummary();
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching status summary:", error);
      res.status(500).json({
        message: "Failed to fetch status summary",
      });
    }
  }
}
