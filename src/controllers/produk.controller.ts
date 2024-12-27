// src/controllers/product.controller.ts

import { Request, Response } from "express";
import { ProductService } from "../services/produk.service";
import { ProductDTO } from "../types/produk.type";

export class ProductController {
  constructor(private productService: ProductService) {}

  private handleError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ error: message });
  }

  // Add a new product with an image
  addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: ProductDTO = req.body;
      const imageFile = req.file; // Multer middleware handles file upload
      const product = await this.productService.addProduct(
        productData,
        imageFile
      );
      res.status(201).json(product);
    } catch (error) {
      this.handleError(res, error, "Failed to add product");
    }
  };

  // Retrieve all products with images
  getAllProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve products");
    }
  };

  // Retrieve a single product with its images
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const product = await this.productService.getProductById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve product");
    }
  };

  // Update a product with a new image
  editProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const productData: ProductDTO = req.body;
      const imageFile = req.file; // Multer middleware handles file upload
      const updated = await this.productService.updateProduct(
        id,
        productData,
        imageFile
      );
      if (updated) {
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "Failed to update product");
    }
  };

  // Delete a product and its images
  removeProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const deleted = await this.productService.deleteProduct(id);
      if (deleted) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "Failed to delete product");
    }
  };

  // src/controllers/product.controller.ts

  replaceProductImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id); // Product ID
      const imageFile = req.file; // Multer middleware handles file upload

      if (!imageFile) {
        res.status(400).json({ error: "Image file is required" });
        return;
      }

      const updatedProduct = await this.productService.replaceProductImage(
        id,
        imageFile
      );

      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      this.handleError(res, error, "Failed to replace product image");
    }
  };
}
