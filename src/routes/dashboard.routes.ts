// src/routes/dashboard.routes.ts
import { Router } from "express";
import { Pool } from "pg";
import { DashboardController } from "../controllers/dashboard.controller";
import { DashboardService } from "../services/dashboard.service";
import { DashboardModel } from "../models/dashboard.model";
import { authMiddleware } from "../middleware/auth";

export const dashboardRoutes = (dbPool: Pool): Router => {
  const router = Router();

  // Create instances of the necessary classes
  const dashboardModel = new DashboardModel(dbPool);
  const dashboardService = new DashboardService(dashboardModel);
  const dashboardController = new DashboardController(dashboardService);

  // Define the routes with authentication middleware
  // PIMPINAN
router.get('/dashboard/totalPenjualan', authMiddleware, (req, res) =>
  dashboardController.getTotalPenjualan(req, res)
);

router.get('/dashboard/totalDistribusi', authMiddleware, (req, res) =>
  dashboardController.getTotalDistribusi(req, res)
);

router.get('/dashboard/topProdukTerlaris', authMiddleware, (req, res) =>
  dashboardController.getTopProdukTerlaris(req, res)
);

router.get('/dashboard/totalStokGudang', authMiddleware, (req, res) =>
  dashboardController.getTotalStokGudang(req, res)
);

router.get('/dashboard/batchKadaluarsa', authMiddleware, (req, res) =>
  dashboardController.getBatchKadaluarsa(req, res)
);

// MARKETING
router.get('/dashboard/totalStokOutlet', authMiddleware, (req, res) =>
  dashboardController.getTotalStokOutlet(req, res)
);

router.get('/dashboard/outletStokRendah', authMiddleware, (req, res) =>
  dashboardController.getOutletStokRendah(req, res)
);

router.get('/dashboard/outletTerbaik', authMiddleware, (req, res) =>
  dashboardController.getOutletTerbaik(req, res)
);

router.get('/dashboard/outletTerendah', authMiddleware, (req, res) =>
  dashboardController.getOutletTerendah(req, res)
);

router.get('/dashboard/totalProdukDikembalikan', authMiddleware, (req, res) =>
  dashboardController.getTotalProdukDikembalikan(req, res)
);

// BENDAHARA
router.get('/dashboard/ringkasanFakturDistribusi', authMiddleware, (req, res) =>
  dashboardController.getRingkasanFakturDistribusi(req, res)
);

router.get('/dashboard/pendapatanBulanIni', authMiddleware, (req, res) =>
  dashboardController.getPendapatanBulanIni(req, res)
);

router.get('/dashboard/fakturJatuhTempoHariIni', authMiddleware, (req, res) =>
  dashboardController.getFakturJatuhTempoHariIni(req, res)
);

// MANAJER
router.get('/dashboard/batchDiproduksiBulanIni', authMiddleware, (req, res) =>
  dashboardController.getBatchDiproduksiBulanIni(req, res)
);

router.get('/dashboard/stokRendahDiGudang', authMiddleware, (req, res) =>
  dashboardController.getStokRendahDiGudang(req, res)
);

router.get('/dashboard/totalPengembalianProduk', authMiddleware, (req, res) =>
  dashboardController.getTotalPengembalianProduk(req, res)
);

  return router;
};
