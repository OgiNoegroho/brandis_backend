import { Request, Response } from "express";
import { BendaharaService } from "../../services/dashboard/bendahara.service";

export class BendaharaController {
  private bendaharaService: BendaharaService;

  constructor(bendaharaService: BendaharaService) {
    this.bendaharaService = bendaharaService;
  }

  async getOverdueInvoices(req: Request, res: Response) {
    try {
      const overdueInvoices = await this.bendaharaService.getOverdueInvoices();
      res.json(overdueInvoices);
    } catch (error) {
      console.error("Error fetching overdue invoices:", error);
      res.status(500).json({ error: "Failed to fetch overdue invoices" });
    }
  }

  async getFinancialSummaryByOutlet(req: Request, res: Response) {
    try {
      const financialSummary =
        await this.bendaharaService.getFinancialSummaryByOutlet();
      res.json(financialSummary);
    } catch (error) {
      console.error("Error fetching financial summary by outlet:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch financial summary by outlet" });
    }
  }

  async getPaymentStatusDistribution(req: Request, res: Response) {
    try {
      const paymentStatusDistribution =
        await this.bendaharaService.getPaymentStatusDistribution();
      res.json(paymentStatusDistribution);
    } catch (error) {
      console.error("Error fetching payment status distribution:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch payment status distribution" });
    }
  }
}
