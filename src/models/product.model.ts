// src/models/product.model.ts
import { Pool, RowDataPacket } from 'mysql2/promise';
import { Product, ProductDTO } from '../types/product.type';

export class ProductModel {
  constructor(private db: Pool) {}

  // Add a new product
  async createProduct(productData: ProductDTO): Promise<Product> {
    const [result] = await this.db.execute(
      'INSERT INTO Products (name, category, price, composition, description, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [productData.name, productData.category, productData.price, productData.composition, productData.description]
    );
    const insertId = (result as any).insertId;
    return { id: insertId, ...productData, createdAt: new Date() };
  }

// Get all products with selected fields
async findAllProducts(): Promise<{ productName: string; category: string; price: number }[]> {
  const [rows] = await this.db.execute<RowDataPacket[]>(
    'SELECT name AS "Product Name", category AS "Category", price AS "Price" FROM Products'
  );
  return rows.map(row => ({
    productName: row['Product Name'],
    category: row['Category'],
    price: row['Price'],
  }));
}


  // Get a product by ID
  async findProductById(id: string): Promise<Product | null> {
    const [rows] = await this.db.execute<RowDataPacket[]>('SELECT * FROM Products WHERE productId = ?', [id]);
    return (rows[0] as Product) || null;
  }

  // Edit a product by ID
  async updateProduct(id: string, productData: ProductDTO): Promise<boolean> {
    const [result] = await this.db.execute(
      'UPDATE Products SET name = ?, category = ?, price = ?, composition = ?, description = ? WHERE productId = ?',
      [productData.name, productData.category, productData.price, productData.composition, productData.description, id]
    );
    return (result as any).affectedRows > 0;
  }

  // Delete a product by ID
  async deleteProduct(id: string): Promise<boolean> {
    const [result] = await this.db.execute('DELETE FROM Products WHERE productId = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}
