// //src\routes\dashboard\bendahara.routes.ts

import { Router } from "express";
import { Pool } from "pg";
import { BendaharaController } from "../../controllers/dashboard/bendahara.controller";
import { BendaharaService } from "../../services/dashboard/bendahara.service";
import { BendaharaModel } from "../../models/dashboard/bendahara.model";
import { authMiddleware } from "../../middleware/auth";

export const bendaharaRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const bendaharaModel = new BendaharaModel(dbPool);
  const bendaharaService = new BendaharaService(bendaharaModel);
  const bendaharaController = new BendaharaController(bendaharaService);

  // BENDAHARA
  router.get(
    "/bendahara/ringkasanFakturDistribusi",
    authMiddleware,
    (req, res) => bendaharaController.getRingkasanFakturDistribusi(req, res)
  );

  router.get("/bendahara/pendapatanBulanIni", authMiddleware, (req, res) =>
    bendaharaController.getPendapatanBulanIni(req, res)
  );

  router.get("/bendahara/overdueInvoices", authMiddleware, (req, res) =>
    bendaharaController.getOverdueInvoices(req, res)
  );

  router.get("/bendahara/fakturJatuhTempoHariIni", authMiddleware, (req, res) =>
    bendaharaController.getFakturJatuhTempoHariIni(req, res)
  );

  return router;
};
