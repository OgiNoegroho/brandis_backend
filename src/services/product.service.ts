// src/services/product.service.ts
import { ProductDTO } from '../types/product.type';
import { ProductModel } from '../models/product.model';

export class ProductService {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }

  // Add a new product
  async addProduct(productData: ProductDTO) {
    return await this.productModel.createProduct(productData);
  }

  // Get all products
  async getAllProducts() {
    return await this.productModel.findAllProducts();
  }

  // Get a product by ID
  async getProductById(id: string) {
    return await this.productModel.findProductById(id);
  }

  // Update a product by ID
  async updateProduct(id: string, productData: ProductDTO) {
    return await this.productModel.updateProduct(id, productData);
  }

  // Delete a product by ID
  async deleteProduct(id: string) {
    return await this.productModel.deleteProduct(id);
  }
}
