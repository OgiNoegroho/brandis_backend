// src/controllers/notifikasiFaktur.controller.ts

import { Request, Response } from "express";
import { NotifikasiFakturService } from "../services/notifikasiFaktur.service";
import { NotifikasiFakturModel } from "../models/notifikasiFaktur.model";
import { Pool } from "pg";

export class NotifikasiFakturController {
  constructor(private db: Pool) {}

  private getService(): NotifikasiFakturService {
    const model = new NotifikasiFakturModel(this.db);
    return new NotifikasiFakturService(model);
  }

  async handleOverdueInvoices(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      await service.processOverdueInvoices();
      res
        .status(200)
        .json({ message: "Overdue invoices processed successfully." });
    } catch (error) {
      console.error("Error processing overdue invoices:", error);
      res.status(500).json({ message: "Failed to process overdue invoices." });
    }
  }

  async getInvoiceNotifications(req: Request, res: Response): Promise<void> {
    try {
      const service = this.getService();
      const notifications = await service.getInvoiceNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching invoice notifications:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch invoice notifications." });
    }
  }
}
