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
      const sale = await this.salesService.createSale(
        Number(outlet_id),
        saleDetails
      );
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getOutletStock(req: Request, res: Response): Promise<void> {
    try {
      const { outlet_id } = req.params;
      const stock = await this.salesService.getOutletStock(Number(outlet_id));
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}
