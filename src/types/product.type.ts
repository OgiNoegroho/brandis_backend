// src/types/product.type.ts
export interface Product {
  id: number;             // Align with SERIAL in the DB
  nama: string;           // Matches TEXT in the DB
  kategori?: string;      // Optional since `kategori` can be NULL in the DB
  komposisi?: string;     // Optional since `komposisi` can be NULL in the DB
  deskripsi?: string;     // Optional since `deskripsi` can be NULL in the DB
  harga: number;          // Matches NUMERIC(10, 2)
}

export interface ProductDTO {
  nama: string;           // Required for creation
  kategori?: string;      // Optional
  komposisi?: string;     // Optional
  deskripsi?: string;     // Optional
  harga: number;          // Required for creation
}

