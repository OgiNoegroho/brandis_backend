// src/types/user.type.ts

export interface Product {
  id: number;
  nama: string;
  kategori?: string;
  komposisi?: string;
  deskripsi?: string;
  harga: number;
  
}

export interface ProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductDTO {
  nama: string;
  kategori?: string;
  komposisi?: string;
  deskripsi?: string;
  harga: number;
}
