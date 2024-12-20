export interface SaleDetail {
  product_id: number; // Product ID instead of batch_id
  kuantitas_terjual: number;
  price: number; // Assuming the price is part of the sale details
}
