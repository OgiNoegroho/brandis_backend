// src/types/product.type.ts
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  composition: string;
  description: string;
  createdAt: Date;
}

export interface ProductDTO {
  name: string;
  category: string;
  price: number;
  composition: string;
  description: string;
}
