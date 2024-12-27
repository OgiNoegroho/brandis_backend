// src/routes/laporanOutlet.routes.ts

import { Router } from "express";
import { Pool } from "pg";
import { LaporanOutletController } from "../controllers/laporanOutlet.controller";
import { LaporanOutletService } from "../services/laporanOutlet.service";
import { LaporanOutletModel } from "../models/laporanOutlet.model";
import { authMiddleware } from "../middleware/auth";

export const laporanOutletRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const laporanOutletModel = new LaporanOutletModel(dbPool);
  const laporanOutletService = new LaporanOutletService(laporanOutletModel);
  const laporanOutletController = new LaporanOutletController(
    laporanOutletService
  );

    router.get("/laporanOutlet/:outlet_id", authMiddleware, (req, res) =>
      laporanOutletController.getAllLaporanDistribusi(req, res)
    );

  router.put("/faktur/:faktur_id/status", authMiddleware, (req, res) =>
    laporanOutletController.updateFakturStatus(req, res)
  );

  router.put("/faktur/:faktur_id/jumlah-dibayar", authMiddleware, (req, res) =>
    laporanOutletController.addToFakturAmountPaid(req, res)
  );

  return router;
};
