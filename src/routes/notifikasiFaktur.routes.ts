// src/routes/notifikasiFaktur.route.ts

import { Router } from "express";
import { Pool } from "pg";
import { NotifikasiFakturController } from "../controllers/notifikasiFaktur.controller";
import { authMiddleware } from "../middleware/auth";

export const notifikasiFakturRoutes = (db: Pool): Router => {
  const router = Router();
  const controller = new NotifikasiFakturController(db);

  router.post("/notifikasi-faktur/process", authMiddleware, (req, res) =>
    controller.handleOverdueInvoices(req, res)
  );

  router.get("/notifikasi-faktur/logs", authMiddleware, (req, res) =>
    controller.getInvoiceNotifications(req, res)
  );

  return router;
};
