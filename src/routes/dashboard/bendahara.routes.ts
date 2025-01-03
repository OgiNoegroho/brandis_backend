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

  router.get("/bendahara/overdueInvoices",
    authMiddleware, (req, res) => bendaharaController.getOverdueInvoices(req, res)
  );

  router.get(
    "/bendahara/financialSummaryByOutlet",
    authMiddleware, (req, res) => bendaharaController.getFinancialSummaryByOutlet(req, res)
  );

  router.get(
    "/bendahara/paymentStatusDistribution",
    authMiddleware, (req, res) => bendaharaController.getPaymentStatusDistribution(req, res)
  );

  return router;
};
