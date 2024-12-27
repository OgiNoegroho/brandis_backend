import { SalesModel } from "../models/penjualan.model";
import { SaleDetail } from "../types/penjualan.type";

export class SalesService {
  constructor(private salesModel: SalesModel) {}

  async getSalesByOutlet(outlet_id: number) {
    return this.salesModel.getSalesByOutlet(outlet_id);
  }

  async createSale(outlet_id: number, saleDetails: SaleDetail[]) {
    return this.salesModel.createSale(outlet_id, saleDetails);
  }
}
