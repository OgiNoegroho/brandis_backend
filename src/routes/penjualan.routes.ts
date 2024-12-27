import { Router } from "express";
import { Pool } from "pg";
import { SalesController } from "../controllers/penjualan.controller";
import { SalesService } from "../services/penjualan.service";
import { SalesModel } from "../models/penjualan.model";
import { authMiddleware } from "../middleware/auth";

export const salesRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const salesModel = new SalesModel(dbPool);
  const salesService = new SalesService(salesModel);
  const salesController = new SalesController(salesService);

  router.get("/sales/:outlet_id", authMiddleware, (req, res) =>
    salesController.getSalesByOutlet(req, res)
  );

  router.post("/sales", authMiddleware, (req, res) =>
    salesController.createSale(req, res)
  );

  return router;
};
