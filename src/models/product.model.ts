// src/models/product.model.ts
import { Pool, QueryResult } from 'pg';
import { Product, ProductDTO } from '../types/product.type';

export class ProductModel {
  constructor(private db: Pool) {}

  // Add a new product
  async createProduct(productData: ProductDTO): Promise<Product> {
    const query = `
      INSERT INTO brandis.produk (nama, kategori, komposisi, deskripsi, harga)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nama, kategori, komposisi, deskripsi, harga;
    `;
    const values = [productData.nama, productData.kategori, productData.komposisi, productData.deskripsi, productData.harga];
    const result: QueryResult = await this.db.query(query, values);
    return result.rows[0]; // Return the inserted product
  }

  // Get all products with selected fields
  async findAllProducts(): Promise<{ productName: string; category: string; price: number }[]> {
    const query = 'SELECT nama AS "ProductName", kategori AS "Category", harga AS "Price" FROM brandis.produk';
    const result: QueryResult = await this.db.query(query);
    return result.rows.map(row => ({
      productName: row['ProductName'],
      category: row['Category'],
      price: row['Price'],
    }));
  }

  // Get a product by ID
  async findProductById(id: string): Promise<Product | null> {
    const query = 'SELECT * FROM brandis.produk WHERE id = $1';
    const result: QueryResult = await this.db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Update a product by ID
  async updateProduct(id: string, productData: ProductDTO): Promise<boolean> {
    const query = `
      UPDATE brandis.produk
      SET nama = $1, kategori = $2, komposisi = $3, deskripsi = $4, harga = $5
      WHERE id = $6
      RETURNING id;
    `;
    const values = [productData.nama, productData.kategori, productData.komposisi, productData.deskripsi, productData.harga, id];
    const result: QueryResult = await this.db.query(query, values);
    return result.rows.length > 0; // If updated, return true
  }

  // Delete a product by ID
  async deleteProduct(id: string): Promise<boolean> {
    const query = 'DELETE FROM brandis.produk WHERE id = $1 RETURNING id';
    const result: QueryResult = await this.db.query(query, [id]);
    return result.rows.length > 0; // If deleted, return true
  }
}
