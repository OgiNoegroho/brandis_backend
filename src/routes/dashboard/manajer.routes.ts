// src/routes/manajer.routes.ts
import { Router } from "express";
import { Pool } from "pg";
import { ManajerController } from "../../controllers/dashboard/manajer.controller";
import { ManajerService } from "../../services/dashboard/manajer.service";
import { ManajerModel } from "../../models/dashboard/manajer.model";
import { authMiddleware } from "../../middleware/auth";

export const manajerRoutes = (dbPool: Pool): Router => {
  const router = Router();

  // Create instances of the necessary classes
  const manajerModel = new ManajerModel(dbPool);
  const manajerService = new ManajerService(manajerModel);
  const manajerController = new ManajerController(manajerService);

  // MANAJER
  router.get("/manajer/batchDiproduksiBulanIni", authMiddleware, (req, res) =>
    manajerController.getBatchDiproduksiBulanIni(req, res)
  );

  router.get("/manajer/stokRendahDiGudang", authMiddleware, (req, res) =>
    manajerController.getStokRendahDiGudang(req, res)
  );

  router.get("/manajer/totalPengembalianProduk", authMiddleware, (req, res) =>
    manajerController.getTotalPengembalianProduk(req, res)
  );

  return router;
};
