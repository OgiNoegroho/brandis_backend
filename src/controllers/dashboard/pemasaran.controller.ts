import { Request, Response } from "express";
import { PemasaranService } from "../../services/dashboard/pemasaran.service";

export class PemasaranController {
  private pemasaranService: PemasaranService;

  constructor(pemasaranService: PemasaranService) {
    this.pemasaranService = pemasaranService;
  }

  async getTotalStokOutlet(req: Request, res: Response) {
    try {
      const totalStokOutlet = await this.pemasaranService.getTotalStokOutlet();
      res.json(totalStokOutlet);
    } catch (error) {
      console.error("Error fetching total stok outlet:", error);
      res.status(500).json({ error: "Failed to fetch total stok outlet" });
    }
  }

  async getOutletStokRendah(req: Request, res: Response) {
    try {
      const outletStokRendah = await this.pemasaranService.getOutletStokRendah();
      res.json(outletStokRendah);
    } catch (error) {
      console.error("Error fetching outlet stok rendah:", error);
      res.status(500).json({ error: "Failed to fetch outlet stok rendah" });
    }
  }

  async getOutletTerbaik(req: Request, res: Response) {
    try {
      const outletTerbaik = await this.pemasaranService.getOutletTerbaik();
      res.json(outletTerbaik);
    } catch (error) {
      console.error("Error fetching outlet terbaik:", error);
      res.status(500).json({ error: "Failed to fetch outlet terbaik" });
    }
  }

  async getOutletTerendah(req: Request, res: Response) {
    try {
      const outletTerendah = await this.pemasaranService.getOutletTerendah();
      res.json(outletTerendah);
    } catch (error) {
      console.error("Error fetching outlet terendah:", error);
      res.status(500).json({ error: "Failed to fetch outlet terendah" });
    }
  }

  async getTotalProdukDikembalikan(req: Request, res: Response) {
    try {
      const totalProdukDikembalikan =
        await this.pemasaranService.getTotalProdukDikembalikan();
      res.json(totalProdukDikembalikan);
    } catch (error) {
      console.error("Error fetching total produk dikembalikan:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch total produk dikembalikan" });
    }
  }
}
