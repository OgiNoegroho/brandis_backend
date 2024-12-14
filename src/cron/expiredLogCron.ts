import cron from 'node-cron';
import { Pool } from 'pg';
import { ExpiredBatchService } from '../services/expiredLog.service';
import { ExpiredBatchModel } from '../models/expiredLog.model';

export const scheduleExpiredBatchCron = (db: Pool): void => {
  const model = new ExpiredBatchModel(db);
  const service = new ExpiredBatchService(model);

  // Schedule the cron job to run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running expired batch cron job...');
    try {
      await service.moveExpiredBatches();
      console.log('Expired batch handling completed successfully.');
    } catch (error) {
      console.error('Error during expired batch cron job:', error);
    }
  });  

  // Run the cron job immediately on backend startup
  (async () => {
    console.log('Running expired batch cron job on startup...');
    try {
      await service.moveExpiredBatches();
      console.log('Expired batch handling completed successfully on startup.');
    } catch (error) {
      console.error('Error during expired batch cron job on startup:', error);
    }
  })();
};
