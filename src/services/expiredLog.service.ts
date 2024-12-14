import { ExpiredBatchModel } from '../models/expiredLog.model';
import { ExpiredBatchLog } from '../types/expiredLog.type';

export class ExpiredBatchService {
  constructor(private model: ExpiredBatchModel) {}

  async moveExpiredBatches(): Promise<void> {
    await this.model.moveExpiredBatches();
  }

  async getExpiredBatches(): Promise<ExpiredBatchLog[]> {
    return await this.model.getExpiredBatches();
  }
}
