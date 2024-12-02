// src/routes/product.route.ts
import { Router } from 'express';
import { Pool } from 'mysql2/promise';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth';

export const productRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const productModel = new ProductModel(dbPool);
  const productService = new ProductService(productModel);
  const productController = new ProductController(productService);

  router.post('/products', authMiddleware, productController.addProduct);
  router.get('/products', authMiddleware, productController.getAllProducts);
  router.get('/products/:id', authMiddleware, productController.getProductById);
  router.put('/products/:id', authMiddleware, productController.editProduct);
  router.delete('/products/:id', authMiddleware, productController.removeProduct);

  return router;
};
