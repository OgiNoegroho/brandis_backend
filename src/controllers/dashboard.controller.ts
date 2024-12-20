//src\controllers\dashboard.controller.ts
import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor(dashboardService: DashboardService) {
    this.dashboardService = dashboardService;
  }

  // PIMPINAN
  async getTotalPenjualan(req: Request, res: Response) {
    try {
      const totalPenjualan = await this.dashboardService.getTotalPenjualan();
      res.json(totalPenjualan);
    } catch (error) {
      console.error('Error fetching total penjualan:', error);
      res.status(500).json({ error: 'Failed to fetch total penjualan' });
    }
  }

  async getTotalDistribusi(req: Request, res: Response) {
    try {
      const totalDistribusi = await this.dashboardService.getTotalDistribusi();
      res.json(totalDistribusi);
    } catch (error) {
      console.error('Error fetching total distribusi:', error);
      res.status(500).json({ error: 'Failed to fetch total distribusi' });
    }
  }

  async getTopProdukTerlaris(req: Request, res: Response) {
    try {
      const topProdukTerlaris = await this.dashboardService.getTopProdukTerlaris();
      res.json(topProdukTerlaris);
    } catch (error) {
      console.error('Error fetching top produk terlaris:', error);
      res.status(500).json({ error: 'Failed to fetch top produk terlaris' });
    }
  }

  async getTotalStokGudang(req: Request, res: Response) {
    try {
      const totalStokGudang = await this.dashboardService.getTotalStokGudang();
      res.json(totalStokGudang);
    } catch (error) {
      console.error('Error fetching total stok gudang:', error);
      res.status(500).json({ error: 'Failed to fetch total stok gudang' });
    }
  }

  async getBatchKadaluarsa(req: Request, res: Response) {
    try {
      const batchKadaluarsa = await this.dashboardService.getBatchKadaluarsa();
      res.json(batchKadaluarsa);
    } catch (error) {
      console.error('Error fetching batch kadaluarsa:', error);
      res.status(500).json({ error: 'Failed to fetch batch kadaluarsa' });
    }
  }

  // MARKETING
  async getTotalStokOutlet(req: Request, res: Response) {
    try {
      const totalStokOutlet = await this.dashboardService.getTotalStokOutlet();
      res.json(totalStokOutlet);
    } catch (error) {
      console.error('Error fetching total stok outlet:', error);
      res.status(500).json({ error: 'Failed to fetch total stok outlet' });
    }
  }

  async getOutletStokRendah(req: Request, res: Response) {
    try {
      const outletStokRendah = await this.dashboardService.getOutletStokRendah();
      res.json(outletStokRendah);
    } catch (error) {
      console.error('Error fetching outlet stok rendah:', error);
      res.status(500).json({ error: 'Failed to fetch outlet stok rendah' });
    }
  }

  async getOutletTerbaik(req: Request, res: Response) {
    try {
      const outletTerbaik = await this.dashboardService.getOutletTerbaik();
      res.json(outletTerbaik);
    } catch (error) {
      console.error('Error fetching outlet terbaik:', error);
      res.status(500).json({ error: 'Failed to fetch outlet terbaik' });
    }
  }

  async getOutletTerendah(req: Request, res: Response) {
    try {
      const outletTerendah = await this.dashboardService.getOutletTerendah();
      res.json(outletTerendah);
    } catch (error) {
      console.error('Error fetching outlet terendah:', error);
      res.status(500).json({ error: 'Failed to fetch outlet terendah' });
    }
  }

  async getTotalProdukDikembalikan(req: Request, res: Response) {
    try {
      const totalProdukDikembalikan = await this.dashboardService.getTotalProdukDikembalikan();
      res.json(totalProdukDikembalikan);
    } catch (error) {
      console.error('Error fetching total produk dikembalikan:', error);
      res.status(500).json({ error: 'Failed to fetch total produk dikembalikan' });
    }
  }

  // BENDAHARA

  async getRingkasanFakturDistribusi(req: Request, res: Response) {
    try {
      const ringkasanFakturDistribusi = await this.dashboardService.getRingkasanFakturDistribusi();
      res.json(ringkasanFakturDistribusi);
    } catch (error) {
      console.error('Error fetching ringkasan faktur distribusi:', error);
      res.status(500).json({ error: 'Failed to fetch ringkasan faktur distribusi' });
    }
  }

  async getPendapatanBulanIni(req: Request, res: Response) {
    try {
      const pendapatanBulanIni = await this.dashboardService.getPendapatanBulanIni();
      res.json(pendapatanBulanIni);
    } catch (error) {
      console.error('Error fetching pendapatan bulan ini:', error);
      res.status(500).json({ error: 'Failed to fetch pendapatan bulan ini' });
    }
  }

  async getFakturJatuhTempoHariIni(req: Request, res: Response) {
    try {
      const fakturJatuhTempoHariIni = await this.dashboardService.getFakturJatuhTempoHariIni();
      res.json(fakturJatuhTempoHariIni);
    } catch (error) {
      console.error('Error fetching faktur jatuh tempo hari ini:', error);
      res.status(500).json({ error: 'Failed to fetch faktur jatuh tempo hari ini' });
    }
  }

  // MANAJER
  async getBatchDiproduksiBulanIni(req: Request, res: Response) {
    try {
      const batchDiproduksiBulanIni = await this.dashboardService.getBatchDiproduksiBulanIni();
      res.json(batchDiproduksiBulanIni);
    } catch (error) {
      console.error('Error fetching batch diproduksi bulan ini:', error);
      res.status(500).json({ error: 'Failed to fetch batch diproduksi bulan ini' });
    }
  }

  async getStokRendahDiGudang(req: Request, res: Response) {
    try {
      const stokRendahDiGudang = await this.dashboardService.getStokRendahDiGudang();
      res.json(stokRendahDiGudang);
    } catch (error) {
      console.error('Error fetching stok rendah di gudang:', error);
      res.status(500).json({ error: 'Failed to fetch stok rendah di gudang' });
    }
  }

  async getTotalPengembalianProduk(req: Request, res: Response) {
    try {
      const totalPengembalianProduk = await this.dashboardService.getTotalPengembalianProduk();
      res.json(totalPengembalianProduk);
    } catch (error) {
      console.error('Error fetching total pengembalian produk:', error);
      res.status(500).json({ error: 'Failed to fetch total pengembalian produk' });
    }
  }
}
