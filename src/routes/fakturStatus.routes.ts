// src/routes/fakturStatus.route.ts

import { Router } from "express";
import { Pool } from "pg";
import { FakturStatusController } from "../controllers/fakturStatus.controller";
import { authMiddleware } from "../middleware/auth";

export const fakturStatusRoutes = (db: Pool): Router => {
  const router = Router();
  const controller = new FakturStatusController(db);

  router.post("/faktur/update-overdue", authMiddleware, (req, res) =>
    controller.handleUpdateOverdueInvoices(req, res)
  );

  router.get("/faktur/status-logs", authMiddleware, (req, res) =>
    controller.getStatusLogs(req, res)
  );

  router.get("/faktur/status-summary", authMiddleware, (req, res) =>
    controller.getStatusSummary(req, res)
  );

  return router;
};
