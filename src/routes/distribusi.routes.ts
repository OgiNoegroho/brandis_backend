// src/routes/distribution.routes.ts

import { Router } from "express";
import { Pool } from "pg";
import { DistributionController } from "../controllers/distribusi.controller";
import { DistributionService } from "../services/distribusi.service";
import { DistributionModel } from "../models/distribusi.model";
import { authMiddleware } from "../middleware/auth";

export const distributionRoutes = (dbPool: Pool): Router => {
  const router = Router();
  
  const distributionModel = new DistributionModel(dbPool);
  const distributionService = new DistributionService(distributionModel);
  const distributionController = new DistributionController(
    distributionService
  );

  router.post("/distribusi", authMiddleware, (req, res) =>
    distributionController.createDistribution(req, res)
  );

  router.get("/distribusi/:outlet_id", authMiddleware, (req, res) =>
    distributionController.getAllDistribusi(req, res)
  );

  router.get("/distribusi/detail/:distribusi_id", authMiddleware, (req, res) =>
    distributionController.getDistribusiById(req, res)
  );

  router.get("/faktur/:distribusi_id", authMiddleware, (req, res) =>
    distributionController.getFakturDistribusi(req, res)
  );

  return router;
};
