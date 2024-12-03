import { ProductDTO } from '../types/product.type';
import { ProductModel } from '../models/product.model';
import { v2 as cloudinary } from 'cloudinary';

export class ProductService {
  private productModel: ProductModel;

  constructor(productModel: ProductModel) {
    this.productModel = productModel;
  }

  // Add a new product with an image
  async addProduct(productData: ProductDTO, imageFile?: Express.Multer.File) {
    const product = await this.productModel.createProduct(productData);

    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'products',
      });

      await this.productModel.addProductImage(
        product.id,
        uploadResult.secure_url,
        uploadResult.public_id,
        true // Mark as primary
      );
    }

    return product;
  }

  // Get all products with images
  async getAllProducts() {
    return await this.productModel.findAllProducts();
  }

  // Get a product by ID with images
  async getProductById(id: string) {
    return await this.productModel.findProductById(id);
  }

  // Update a product and its image
  async updateProduct(id: string, productData: ProductDTO, imageFile?: Express.Multer.File) {
    const updated = await this.productModel.updateProduct(id, productData);

    if (updated && imageFile) {
      const publicIds = await this.productModel.getProductImagePublicIds(id);

      // Delete existing images from Cloudinary
      await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));

      const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
        folder: 'products',
      });

      await this.productModel.addProductImage(
        parseInt(id),
        uploadResult.secure_url,
        uploadResult.public_id,
        true // Mark as primary
      );
    }

    return updated;
  }

  // Delete a product and its images
  async deleteProduct(id: string) {
    const publicIds = await this.productModel.getProductImagePublicIds(id);

    // Delete images from Cloudinary
    await Promise.all(publicIds.map(id => cloudinary.uploader.destroy(id)));

    return await this.productModel.deleteProduct(id);
  }
}
