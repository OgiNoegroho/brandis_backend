// src\services\kadaluarsa.service.ts

import { ExpiredBatchModel } from "../models/kadaluarsa.model";
import { ExpiredBatchLog } from "../types/kadaluarsa.type";

export class ExpiredBatchService {
  constructor(private model: ExpiredBatchModel) {}

  async moveExpiredBatches(): Promise<void> {
    await this.model.moveExpiredBatches();
  }

  async getExpiredBatches(): Promise<ExpiredBatchLog[]> {
    return await this.model.getExpiredBatches();
  }
}
