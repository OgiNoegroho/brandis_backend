import { Router } from 'express';
import { Pool } from 'pg';
import { InventoryModel } from '../models/inventory.model';
import { InventoryService } from '../services/inventory.service';
import { InventoryController } from '../controllers/inventory.controller';
import { authMiddleware } from '../middleware/auth';

export const inventoryRoutes = (dbPool: Pool): Router => {
  const router = Router();
  const inventoryModel = new InventoryModel(dbPool);
  const inventoryService = new InventoryService(inventoryModel);
  const inventoryController = new InventoryController(inventoryService);

  router.get('/inventory', authMiddleware, (req, res) => inventoryController.getInventory(req, res));
  router.get(
    '/inventory/batch/:produkId', // Changed to match controller and model
    authMiddleware, 
    (req, res) => inventoryController.getBatchDetails(req, res)
  );
  router.post('/inventory/batch', authMiddleware, (req, res) => inventoryController.createBatch(req, res));
  router.put('/inventory/batch/:produkId', authMiddleware, (req, res) => inventoryController.updateBatch(req, res)); // Changed to match controller and model
  router.delete('/inventory/batch/:produkId', authMiddleware, (req, res) => inventoryController.deleteBatch(req, res)); // Changed to match controller and model

  return router;
};