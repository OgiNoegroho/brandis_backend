// src/routes/distribution.routes.ts

import { Router } from 'express';
import { Pool } from 'pg';
import { DistributionController } from '../controllers/distribution.controller';
import { DistributionService } from '../services/distribution.service';
import { DistributionModel } from '../models/distribution.model';
import { authMiddleware } from '../middleware/auth';

export const distributionRoutes = (dbPool: Pool): Router => {
  const router = Router();

  // Create instances of the necessary classes
  const distributionModel = new DistributionModel(dbPool);
  const distributionService = new DistributionService(distributionModel);
  const distributionController = new DistributionController(
    distributionService
  );

  // Define the POST route for creating a distribution
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

  // Define the route for updating the status of a faktur
  router.put("/faktur/:faktur_id/status", authMiddleware, (req, res) =>
    distributionController.updateFakturStatus(req, res)
  );

  // Define the route for adding to jumlah_dibayar
  router.put("/faktur/:faktur_id/jumlah-dibayar", authMiddleware, (req, res) =>
    distributionController.addToFakturAmountPaid(req, res)
  );

  return router;
};
