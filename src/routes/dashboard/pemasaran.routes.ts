import { Router } from "express";
import { Pool } from "pg";
import { PemasaranController } from "../../controllers/dashboard/pemasaran.controller";
import { PemasaranService } from "../../services/dashboard/pemasaran.service";
import { PemasaranModel } from "../../models/dashboard/pemasaran.model";
import { authMiddleware } from "../../middleware/auth";

export const pemasaranRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const pemasaranModel = new PemasaranModel(dbPool);
  const pemasaranService = new PemasaranService(pemasaranModel);
  const pemasaranController = new PemasaranController(pemasaranService);

  // MARKETING
  router.get("/pemasaran/totalStokOutlet", authMiddleware, (req, res) =>
    pemasaranController.getTotalStokOutlet(req, res)
  );

  router.get("/pemasaran/outletStokRendah", authMiddleware, (req, res) =>
    pemasaranController.getOutletStokRendah(req, res)
  );

  router.get("/pemasaran/outletTerbaik", authMiddleware, (req, res) =>
    pemasaranController.getOutletTerbaik(req, res)
  );

  router.get("/pemasaran/outletTerendah", authMiddleware, (req, res) =>
    pemasaranController.getOutletTerendah(req, res)
  );

  router.get("/pemasaran/totalProdukDikembalikan", authMiddleware, (req, res) =>
    pemasaranController.getTotalProdukDikembalikan(req, res)
  );

  return router;
};
