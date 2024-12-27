export interface ProductDetails {
  product_id: number;  // Product ID
  product_name: string; // Product Name
}

export interface ReturnDTO {
  outlet_id: number;       // The ID of the outlet returning the batch
  batch_id: number;        // The ID of the batch being returned
  kuantitas: number;       // Quantity of the batch being returned
  alasan: string;          // Reason for the return (e.g., "Expired")
}

export interface ReturnResult {
  return_id: number;       // ID of the newly created return entry
}
