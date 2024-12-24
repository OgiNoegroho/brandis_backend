import { Router } from "express";
import { Pool } from "pg";
import { PimpinanController } from "../../controllers/dashboard/pimpinan.controller";
import { PimpinanService } from "../../services/dashboard/pimpinan.service";
import { PimpinanModel } from "../../models/dashboard/pimpinan.model";
import { authMiddleware } from "../../middleware/auth";

export const pimpinanRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const pimpinanModel = new PimpinanModel(dbPool);
  const pimpinanService = new PimpinanService(pimpinanModel);
  const pimpinanController = new PimpinanController(pimpinanService);

  // Define routes with authentication middleware
  router.get("/pimpinan/totalPenjualan", authMiddleware, (req, res) =>
    pimpinanController.getTotalPenjualan(req, res)
  );

  router.get("/pimpinan/totalDistribusi", authMiddleware, (req, res) =>
    pimpinanController.getTotalDistribusi(req, res)
  );

  router.get("/pimpinan/topProdukTerlaris", authMiddleware, (req, res) =>
    pimpinanController.getTopProdukTerlaris(req, res)
  );

  router.get("/pimpinan/totalStokGudang", authMiddleware, (req, res) =>
    pimpinanController.getTotalStokGudang(req, res)
  );

  router.get("/pimpinan/batchKadaluarsa", authMiddleware, (req, res) =>
    pimpinanController.getBatchKadaluarsa(req, res)
  );

  return router;
};
