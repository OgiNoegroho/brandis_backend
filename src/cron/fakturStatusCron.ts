// src/cron/fakturStatusCron.ts

import cron from "node-cron";
import { Pool } from "pg";
import { FakturStatusService } from "../services/fakturStatus.service";
import { FakturStatusModel } from "../models/fakturStatus.model";

export const scheduleFakturStatusCron = (db: Pool): void => {
  const model = new FakturStatusModel(db);
  const service = new FakturStatusService(model);

  // Schedule the cron job to run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running invoice status update cron job...");
    try {
      await service.updateOverdueInvoices();
      console.log("Invoice status update completed successfully.");
    } catch (error) {
      console.error("Error during invoice status update cron job:", error);
    }
  });

  // Run the cron job immediately on startup
  (async () => {
    console.log("Running invoice status update on startup...");
    try {
      await service.updateOverdueInvoices();
      console.log("Invoice status update completed successfully on startup.");
    } catch (error) {
      console.error("Error during invoice status update on startup:", error);
    }
  })();
};
