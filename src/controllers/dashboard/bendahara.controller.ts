import { Request, Response } from "express";
import { BendaharaService } from "../../services/dashboard/bendahara.service";

export class BendaharaController {
  private bendaharaService: BendaharaService;

  constructor(bendaharaService: BendaharaService) {
    this.bendaharaService = bendaharaService;
  }

  // BENDAHARA

  async getRingkasanFakturDistribusi(req: Request, res: Response) {
    try {
      const ringkasanFakturDistribusi =
        await this.bendaharaService.getRingkasanFakturDistribusi();
      res.json(ringkasanFakturDistribusi);
    } catch (error) {
      console.error("Error fetching ringkasan faktur distribusi:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch ringkasan faktur distribusi" });
    }
  }

  async getPendapatanBulanIni(req: Request, res: Response) {
    try {
      const pendapatanBulanIni =
        await this.bendaharaService.getPendapatanBulanIni();
      res.json(pendapatanBulanIni);
    } catch (error) {
      console.error("Error fetching pendapatan bulan ini:", error);
      res.status(500).json({ error: "Failed to fetch pendapatan bulan ini" });
    }
  }

  async getFakturJatuhTempoHariIni(req: Request, res: Response) {
    try {
      const fakturJatuhTempoHariIni =
        await this.bendaharaService.getFakturJatuhTempoHariIni();
      res.json(fakturJatuhTempoHariIni);
    } catch (error) {
      console.error("Error fetching faktur jatuh tempo hari ini:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch faktur jatuh tempo hari ini" });
    }
  }
}
