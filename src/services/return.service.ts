import { ReturnModel } from '../models/return.model';
import { ReturnDTO, ReturnResult, ProductDetails  } from '../types/return.type';

export class ReturnService {
  constructor(private returnModel: ReturnModel) {}

  // Handles creating returns (single or multiple)
  async createReturn(returnData: ReturnDTO | ReturnDTO[]): Promise<ReturnResult[]> {
    // If it's a single return, wrap it in an array
    const returnDataList = Array.isArray(returnData) ? returnData : [returnData];

    try {
      // Pass the return data list to the model's createReturn method
      return await this.returnModel.createReturn(returnDataList);
    } catch (error) {
      throw new Error(`Error processing return: ${error}`);
    }
  }

  async getReturnHistory(outletId: number): Promise<any[]> {
    return this.returnModel.getReturnHistory(outletId);
  }

  // Updated method to get product details by outlet ID
  async getProductDetailsByOutletId(outletId: number): Promise<ProductDetails[]> {
    return this.returnModel.getAllProductDetailsFromStockOutletByOutletId(outletId);
  }

  // New method to get batch details by product ID
  async getBatchDetailsByProductId(productId: number): Promise<any[]> {
    return this.returnModel.getBatchDetailsByProductId(productId);
  }
}
