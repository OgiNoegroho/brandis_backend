import { ReturnModel } from "../models/retur.model";
import { ReturnDTO, ReturnResult, ProductDetails } from "../types/retur.type";

export class ReturnService {
  constructor(private returnModel: ReturnModel) {}

  async createReturn(
    returnData: ReturnDTO | ReturnDTO[]
  ): Promise<ReturnResult[]> {
    const returnDataList = Array.isArray(returnData)
      ? returnData
      : [returnData];

    try {
      return await this.returnModel.createReturn(returnDataList);
    } catch (error) {
      throw new Error(`Error processing return: ${error}`);
    }
  }

  async getReturnHistory(outletId: number): Promise<any[]> {
    return this.returnModel.getReturnHistory(outletId);
  }

  async getProductDetailsByOutletId(
    outletId: number
  ): Promise<ProductDetails[]> {
    return this.returnModel.getAllProductDetailsFromStockOutletByOutletId(
      outletId
    );
  }

  async getBatchDetailsByProductId(productId: number): Promise<any[]> {
    return this.returnModel.getBatchDetailsByProductId(productId);
  }
}
