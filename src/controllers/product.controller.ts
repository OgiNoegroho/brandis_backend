// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ProductDTO } from '../types/product.type';

export class ProductController {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  // Add a new product
  addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: ProductDTO = req.body;
      const product = await this.productService.addProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to add product' });
    }
  };

  // Get all products
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to retrieve products' });
    }
  };

  // Get a product by ID
  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String (req.params.id);
      const product = await this.productService.getProductById(id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to retrieve product' });
    }
  };

  // Update a product by ID
  editProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String (req.params.id);
      const productData: ProductDTO = req.body;
      const updated = await this.productService.updateProduct(id, productData);
      if (updated) {
        res.status(200).json({ message: 'Product updated successfully' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to update product' });
    }
  };

  // Delete a product by ID
  removeProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String (req.params.id);
      const deleted = await this.productService.deleteProduct(id);
      if (deleted) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message || 'Failed to delete product' });
    }
  };
}
