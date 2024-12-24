import { Request, Response } from "express";
import { SalesService } from "../services/sales.service";

export class SalesController {
  constructor(private salesService: SalesService) {}

  async getSalesByOutlet(req: Request, res: Response): Promise<void> {
    try {
      const { outlet_id } = req.params;
      const sales = await this.salesService.getSalesByOutlet(Number(outlet_id));
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async createSale(req: Request, res: Response): Promise<void> {
    try {
      const { outlet_id, saleDetails } = req.body; // saleDetails: [{ product_id, kuantitas_terjual, price }]

      if (
        !outlet_id ||
        !Array.isArray(saleDetails) ||
        saleDetails.length === 0
      ) {
        res.status(400).json({ error: "Invalid input data" });
        return;
      }

      const sale = await this.salesService.createSale(
        Number(outlet_id),
        saleDetails
      );

      res.status(201).json(sale);
    } catch (error) {
      console.error(`Error creating sale: ${error}`);
      res.status(500).json({ error: error });
    }
  }
}
