export interface ProductDetails {
  product_id: number;  // Product ID
  product_name: string; // Product Name
}

export interface ReturnDTO {
  outlet_id: number;
  batch_id: number;
  kuantitas: number;
  alasan: string;
}

export interface ReturnResult {
  return_id: number;
}
