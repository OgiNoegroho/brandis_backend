import { Router } from 'express';
import { Pool } from 'pg';
import { ExpiredBatchController } from '../controllers/kadaluarsa.controller';
import { authMiddleware } from '../middleware/auth';

export const expiredBatchRoutes = (db: Pool): Router => {
  const router = Router();
  const controller = new ExpiredBatchController(db);

  // Route to handle expired batches manually
  router.post('/expired-batches/process', authMiddleware, (req, res) => controller.handleExpiredBatches(req, res));

  // Route to fetch expired batch logs
  router.get('/expired-batches/logs', authMiddleware, (req, res) => controller.getExpiredBatches(req, res));

  return router;
};
