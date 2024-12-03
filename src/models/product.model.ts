import { Pool, QueryResult } from 'pg';
import { Product, ProductDTO, ProductWithImages } from '../types/product.type';

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
    return result.rows[0];
  }

  // Add an image to the database
  async addProductImage(productId: number, url: string, publicId: string, isPrimary: boolean): Promise<void> {
    const query = `
      INSERT INTO brandis.gambar_produk (produk_id, url_gambar, id_publik_gambar, utama)
      VALUES ($1, $2, $3, $4);
    `;
    await this.db.query(query, [productId, url, publicId, isPrimary]);
  }

  // Get all products with images
  async findAllProducts(): Promise<ProductWithImages[]> {
    const query = `
      SELECT 
        p.id, p.nama, p.kategori, p.komposisi, p.deskripsi, p.harga,
        COALESCE(
          json_agg(json_build_object('url', g.url_gambar, 'publicId', g.id_publik_gambar, 'isPrimary', g.utama)) 
          FILTER (WHERE g.id IS NOT NULL), '[]') AS images
      FROM brandis.produk p
      LEFT JOIN brandis.gambar_produk g ON p.id = g.produk_id
      GROUP BY p.id;
    `;
    const result: QueryResult = await this.db.query(query);
    return result.rows;
  }

  // Get a product by ID with images
  async findProductById(id: string): Promise<ProductWithImages | null> {
    const query = `
      SELECT 
        p.id, p.nama, p.kategori, p.komposisi, p.deskripsi, p.harga,
        COALESCE(
          json_agg(json_build_object('url', g.url_gambar, 'publicId', g.id_publik_gambar, 'isPrimary', g.utama)) 
          FILTER (WHERE g.id IS NOT NULL), '[]') AS images
      FROM brandis.produk p
      LEFT JOIN brandis.gambar_produk g ON p.id = g.produk_id
      WHERE p.id = $1
      GROUP BY p.id;
    `;
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
    return result.rows.length > 0;
  }

  // Delete a product and its associated images by ID
  async deleteProduct(id: string): Promise<boolean> {
    const query = 'DELETE FROM brandis.produk WHERE id = $1 RETURNING id';
    const result: QueryResult = await this.db.query(query, [id]);
    return result.rows.length > 0;
  }

  // Delete images associated with a product
  async deleteProductImages(publicIds: string[]): Promise<void> {
    const query = `
      DELETE FROM brandis.gambar_produk
      WHERE id_publik_gambar = ANY($1::text[]);
    `;
    await this.db.query(query, [publicIds]);
  }

  // Fetch public IDs of product images
  async getProductImagePublicIds(productId: string): Promise<string[]> {
    const query = `
      SELECT id_publik_gambar FROM brandis.gambar_produk WHERE produk_id = $1;
    `;
    const result: QueryResult = await this.db.query(query, [productId]);
    return result.rows.map(row => row.id_publik_gambar);
  }
}
