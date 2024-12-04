// src/routes/product.model.ts

import { Router } from 'express';
import { Pool } from 'pg';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload.middleware';

export const productRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const productModel = new ProductModel(dbPool);
  const productService = new ProductService(productModel);
  const productController = new ProductController(productService);

  // POST route to add a product with image upload
  router.post('/products', authMiddleware, upload.single('image'), productController.addProduct);

  // GET route to retrieve all products
  router.get('/products', authMiddleware, productController.getAllProducts);

  // GET route to retrieve a product by ID
  router.get('/products/:id', authMiddleware, productController.getProductById);

  // PUT route to edit an existing product (with optional image upload)
  router.put('/products/:id', authMiddleware, upload.single('image'), productController.editProduct);

  // DELETE route to remove a product
  router.delete('/products/:id', authMiddleware, productController.removeProduct);

  return router;
};
