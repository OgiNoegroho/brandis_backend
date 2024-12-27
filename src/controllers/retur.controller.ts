import { Request, Response } from "express";
import { ReturnService } from "../services/retur.service";
import { ReturnDTO, ProductDetails } from "../types/retur.type";

export class ReturnController {
  constructor(private returnService: ReturnService) {}

  async createReturn(req: Request, res: Response): Promise<void> {
    const returnData: ReturnDTO | ReturnDTO[] = req.body;
    try {
      const result = await this.returnService.createReturn(returnData);
      res.status(201).json(result); // Return the result as JSON
    } catch (error) {
      res.status(500).json({ message: "Failed to process return", error });
    }
  }

  async getReturnHistory(req: Request, res: Response): Promise<void> {
    const outletId = parseInt(req.params.outletId, 10);

    if (isNaN(outletId)) {
      res.status(400).json({ message: "Invalid outlet ID" });
      return;
    }

    try {
      const returnHistory = await this.returnService.getReturnHistory(outletId);
      res.status(200).json(returnHistory);
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve return history",
        error: String(error),
      });
    }
  }

  async getProductDetails(req: Request, res: Response): Promise<void> {
    const outletId = parseInt(req.params.outletId, 10);
    if (isNaN(outletId)) {
      res.status(400).json({ message: "Invalid outlet ID" });
      return;
    }

    try {
      const productDetails: ProductDetails[] =
        await this.returnService.getProductDetailsByOutletId(outletId);
      res.status(200).json(productDetails);
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve product details",
        error: String(error),
      });
    }
  }

  async getBatchDetailsByProductId(req: Request, res: Response): Promise<void> {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    try {
      const batchDetails = await this.returnService.getBatchDetailsByProductId(
        productId
      );
      res.status(200).json(batchDetails);
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve batch details",
        error: String(error),
      });
    }
  }
}
