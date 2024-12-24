import { Router } from 'express';
import { Pool } from 'pg';
import { ReturnModel } from '../models/return.model';
import { ReturnService } from '../services/return.service';
import { ReturnController } from '../controllers/return.controller';
import { authMiddleware } from '../middleware/auth';

export const returnRoutes = (dbPool: Pool): Router => {
  const router = Router();
  const returnModel = new ReturnModel(dbPool);
  const returnService = new ReturnService(returnModel);
  const returnController = new ReturnController(returnService);

  router.post('/returns', authMiddleware, (req, res) => returnController.createReturn(req, res));
  router.get('/returns/:outletId', authMiddleware, (req, res) => returnController.getReturnHistory(req, res));
  // New routes for product details and batch details
  router.get('/returns/:outletId/products', authMiddleware, (req, res) => returnController.getProductDetails(req, res));

  router.get('/returns/:productId/batches', authMiddleware, (req, res) => returnController.getBatchDetailsByProductId(req, res));


  return router;
};
