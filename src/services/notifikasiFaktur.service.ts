// src/services/notifikasiFaktur.service.ts

import { NotifikasiFakturModel } from "../models/notifikasiFaktur.model";
import { InvoiceNotification } from "../types/notifikasiFaktur.type";

export class NotifikasiFakturService {
  constructor(private model: NotifikasiFakturModel) {}

  async processOverdueInvoices(): Promise<void> {
    console.log("Started processing overdue invoices.");
    await this.model.processOverdueInvoices();
  }

  async getInvoiceNotifications(): Promise<InvoiceNotification[]> {
    return this.model.getInvoiceNotifications();
  }
}
