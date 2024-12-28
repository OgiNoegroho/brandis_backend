// src/types/produk.type.ts

export interface Product {
  id: number;
  nama: string;
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
  komposisi?: string;
  deskripsi?: string;
  harga: number;
}
