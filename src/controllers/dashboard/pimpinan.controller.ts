import { Request, Response } from "express";
import { PimpinanService } from "../../services/dashboard/pimpinan.service";

export class PimpinanController {
  private pimpinanService: PimpinanService;

  constructor(pimpinanService: PimpinanService) {
    this.pimpinanService = pimpinanService;
  }

  // Total Sales for the current month
  async getTotalPenjualan(req: Request, res: Response) {
    try {
      const totalPenjualan = await this.pimpinanService.getTotalPenjualan();
      res.json(totalPenjualan);
    } catch (error) {
      console.error("Error fetching total penjualan:", error);
      res.status(500).json({ error: "Failed to fetch total penjualan" });
    }
  }

  // Total Distribution for the current month
  async getTotalDistribusi(req: Request, res: Response) {
    try {
      const totalDistribusi = await this.pimpinanService.getTotalDistribusi();
      res.json(totalDistribusi);
    } catch (error) {
      console.error("Error fetching total distribusi:", error);
      res.status(500).json({ error: "Failed to fetch total distribusi" });
    }
  }

  // Top-selling Products for the last month
  async getTopProdukTerlaris(req: Request, res: Response) {
    try {
      const topProdukTerlaris =
        await this.pimpinanService.getTopProdukTerlaris();
      res.json(topProdukTerlaris);
    } catch (error) {
      console.error("Error fetching top produk terlaris:", error);
      res.status(500).json({ error: "Failed to fetch top produk terlaris" });
    }
  }

  // Total Stock in Warehouse
  async getTotalStokGudang(req: Request, res: Response) {
    try {
      const totalStokGudang = await this.pimpinanService.getTotalStokGudang();
      res.json(totalStokGudang);
    } catch (error) {
      console.error("Error fetching total stok gudang:", error);
      res.status(500).json({ error: "Failed to fetch total stok gudang" });
    }
  }

  // Count of Expiring Batches in 30 days
  async getBatchKadaluarsa(req: Request, res: Response) {
    try {
      const batchKadaluarsa = await this.pimpinanService.getBatchKadaluarsa();
      res.json(batchKadaluarsa);
    } catch (error) {
      console.error("Error fetching batch kadaluarsa:", error);
      res.status(500).json({ error: "Failed to fetch batch kadaluarsa" });
    }
  }
}
