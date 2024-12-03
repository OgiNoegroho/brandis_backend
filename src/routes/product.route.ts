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

  router.post('/products', authMiddleware, upload.single('image'), productController.addProduct);
  router.get('/products', authMiddleware, productController.getAllProducts);
  router.get('/products/:id', authMiddleware, productController.getProductById);
  router.put('/products/:id', authMiddleware, upload.single('image'), productController.editProduct);
  router.delete('/products/:id', authMiddleware, productController.removeProduct);

  return router;
};
