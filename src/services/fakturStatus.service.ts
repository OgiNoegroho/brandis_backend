// src/services/fakturStatus.service.ts

import { FakturStatusModel } from "../models/fakturStatus.model";
import {
  FakturJatuhTempo,
  FakturStatusLog,
  FakturStatusSummary,
} from "../types/fakturStatus.type";

export class FakturStatusService {
  constructor(private model: FakturStatusModel) {}

  async updateOverdueInvoices(): Promise<void> {
    await this.model.updateOverdueInvoices();
  }

  async getStatusLogs(): Promise<FakturStatusLog[]> {
    return await this.model.getStatusLogs();
  }

  async getStatusSummary(): Promise<FakturStatusSummary> {
    return await this.model.getStatusSummary();
  }
}
