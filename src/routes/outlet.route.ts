// src/routes/product.model.ts

import { Router } from 'express';
import { Pool } from 'pg';
import { OutletController } from '../controllers/outlet.controller';
import { OutletService } from '../services/outlet.service';
import { OutletModel } from '../models/outlet.model';
import { authMiddleware } from '../middleware/auth';

export const outletRoutes = (dbPool: Pool): Router => {
  const router = Router();
  
  // Create instances of the necessary classes
  const outletModel = new OutletModel(dbPool);
  const outletService = new OutletService(outletModel);
  const outletController = new OutletController(outletService);

  // Define the routes with authentication middleware where necessary
  router.get('/outlet', (req, res) => outletController.getAllOutlets(req, res));

  router.get('/outlet/:id', (req, res) => outletController.getOutletById(req, res));

  router.post('/outlet', authMiddleware, (req, res) => outletController.addOutlet(req, res));

  router.put('/outlet/:id', authMiddleware, (req, res) => outletController.editOutlet(req, res));

  router.delete('/outlet/:id', authMiddleware, (req, res) => outletController.deleteOutlet(req, res));

    // New route for stock overview
    router.get('/outlet/:id/stock-overview', authMiddleware, (req, res) => {
      const { id } = req.params;
      outletController.getStockOverviewForOutlet(req, res, parseInt(id));
    });

  return router;
};