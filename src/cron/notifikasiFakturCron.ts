// src\cron\notifikasiFakturCron.ts

import cron from "node-cron";
import { Pool } from "pg";
import { NotifikasiFakturService } from "../services/notifikasiFaktur.service";
import { NotifikasiFakturModel } from "../models/notifikasiFaktur.model";

export const scheduleNotifikasiFakturCron = (db: Pool): void => {
  const model = new NotifikasiFakturModel(db);
  const service = new NotifikasiFakturService(model);

  // Schedule cron job to run daily at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running overdue invoices cron job...");
    try {
      // Process overdue invoices
      await service.processOverdueInvoices();
      console.log("Overdue invoices processed successfully.");
    } catch (error) {
      console.error("Error during overdue invoices cron job:", error);
    }
  });

  // Run cron job immediately on server startup
  (async () => {
    console.log("Running overdue invoices cron job on startup...");
    try {
      // Process overdue invoices on startup
      await service.processOverdueInvoices();
      console.log("Overdue invoices processed successfully on startup.");
    } catch (error) {
      console.error(
        "Error during overdue invoices cron job on startup:",
        error
      );
    }
  })();
};
