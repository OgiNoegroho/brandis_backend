// src/routes/product.model.ts

import { Router } from "express";
import { Pool } from "pg";
import { ProductModel } from "../models/produk.model";
import { ProductService } from "../services/produk.service";
import { ProductController } from "../controllers/produk.controller";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload.middleware";

export const productRoutes = (dbPool: Pool): Router => {
  const router = Router();

  const productModel = new ProductModel(dbPool);
  const productService = new ProductService(productModel);
  const productController = new ProductController(productService);

  // POST route to add a product with image upload
  router.post(
    "/products",
    authMiddleware,
    upload.single("image"),
    productController.addProduct
  );

  // GET route to retrieve all products
  router.get("/products", authMiddleware, productController.getAllProducts);

  // GET route to retrieve a product by ID
  router.get("/products/:id", authMiddleware, productController.getProductById);

  // PUT route to edit an existing product (with optional image upload)
  router.put(
    "/products/:id",
    authMiddleware,
    upload.single("image"),
    productController.editProduct
  );

  // DELETE route to remove a product
  router.delete(
    "/products/:id",
    authMiddleware,
    productController.removeProduct
  );

  // src/routes/product.routes.ts

  // PUT route to replace a product's image
  router.put(
    "/products/:id/replace-image",
    authMiddleware,
    upload.single("image"),
    productController.replaceProductImage
  );

  return router;
};
