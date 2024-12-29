// src\routes\kadaluarsa.route.ts

import { Router } from "express";
import { Pool } from "pg";
import { ExpiredBatchController } from "../controllers/kadaluarsa.controller";
import { authMiddleware } from "../middleware/auth";

export const expiredBatchRoutes = (db: Pool): Router => {
  const router = Router();
  const controller = new ExpiredBatchController(db);

  router.post("/expired-batches/process", authMiddleware, (req, res) =>
    controller.handleExpiredBatches(req, res)
  );

  router.get("/expired-batches/logs", authMiddleware, (req, res) =>
    controller.getExpiredBatches(req, res)
  );

  return router;
};
