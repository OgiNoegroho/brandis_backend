// src/service/product.service.ts

import { ProductDTO } from "../types/produk.type";
import { ProductModel } from "../models/produk.model";
import { v2 as cloudinary } from "cloudinary";

export class ProductService {
  constructor(private productModel: ProductModel) {}

  // Add a new product and save its image
  async addProduct(productData: ProductDTO, imageFile?: Express.Multer.File) {
    const product = await this.productModel.createProduct(productData);

    if (imageFile) {
      // Use file metadata from Multer's CloudinaryStorage
      await this.productModel.addProductImage(
        product.id,
        imageFile.path, // This already contains the Cloudinary URL
        imageFile.filename, // Cloudinary public_id from Multer
        true // Mark as primary
      );
    }

    return this.getProductById(product.id.toString());
  }

  // Retrieve all products with their images
  async getAllProducts() {
    return await this.productModel.findAllProducts();
  }

  // Retrieve a single product with its images
  async getProductById(id: string) {
    return await this.productModel.findProductById(id);
  }

  // Update a product with a new image
  async updateProduct(
    id: string,
    productData: ProductDTO,
    imageFile?: Express.Multer.File
  ) {
    const updated = await this.productModel.updateProduct(id, productData);

    if (updated && imageFile) {
      // Delete existing images
      const publicIds = await this.productModel.getProductImagePublicIds(id);
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );

      // Use file metadata from Multer's CloudinaryStorage
      await this.productModel.addProductImage(
        parseInt(id),
        imageFile.path, // This already contains the Cloudinary URL
        imageFile.filename, // Cloudinary public_id from Multer
        true // Mark as primary
      );
    }

    return this.getProductById(id);
  }

  // Delete a product and its images
  async deleteProduct(id: string) {
    const publicIds = await this.productModel.getProductImagePublicIds(id);

    // Delete images from Cloudinary
    await Promise.all(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    return await this.productModel.deleteProduct(id);
  }

  // src/services/product.service.ts

  async replaceProductImage(id: string, imageFile: Express.Multer.File) {
    try {
      // Fetch and delete existing image(s)
      const publicIds = await this.productModel.getProductImagePublicIds(id);
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );

      // Delete existing images from the database
      await this.productModel.deleteProductImages(publicIds);

      // Add the new image
      await this.productModel.addProductImage(
        parseInt(id),
        imageFile.path, // Cloudinary URL
        imageFile.filename, // Cloudinary public_id
        true // Mark as primary
      );

      return this.getProductById(id);
    } catch (error) {
      throw new Error("Failed to replace product image: " + error);
    }
  }
}
