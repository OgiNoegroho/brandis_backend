//src\controllers\Manajer.controller.ts
import { Request, Response } from "express";
import { ManajerService } from "../../services/dashboard/manajer.service";

export class ManajerController {
  private ManajerService: ManajerService;

  constructor(ManajerService: ManajerService) {
    this.ManajerService = ManajerService;
  }

  // MANAJER
  async getBatchDiproduksiBulanIni(req: Request, res: Response) {
    try {
      const batchDiproduksiBulanIni =
        await this.ManajerService.getBatchDiproduksiBulanIni();
      res.json(batchDiproduksiBulanIni);
    } catch (error) {
      console.error("Error fetching batch diproduksi bulan ini:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch batch diproduksi bulan ini" });
    }
  }

  async getStokRendahDiGudang(req: Request, res: Response) {
    try {
      const stokRendahDiGudang =
        await this.ManajerService.getStokRendahDiGudang();
      res.json(stokRendahDiGudang);
    } catch (error) {
      console.error("Error fetching stok rendah di gudang:", error);
      res.status(500).json({ error: "Failed to fetch stok rendah di gudang" });
    }
  }

  async getTotalPengembalianProduk(req: Request, res: Response) {
    try {
      const totalPengembalianProduk =
        await this.ManajerService.getTotalPengembalianProduk();
      res.json(totalPengembalianProduk);
    } catch (error) {
      console.error("Error fetching total pengembalian produk:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch total pengembalian produk" });
    }
  }
}
