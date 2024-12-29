// //src\controllers\dashboard\bendahara.controller.ts
import { Request, Response } from "express";
import { BendaharaService } from "../../services/dashboard/bendahara.service";

export class BendaharaController {
  private bendaharaService: BendaharaService;

  constructor(bendaharaService: BendaharaService) {
    this.bendaharaService = bendaharaService;
  }

  // Total Outstanding Invoices
  async getTotalOutstandingInvoices(req: Request, res: Response) {
    try {
      const totalOutstandingInvoices =
        await this.bendaharaService.getTotalOutstandingInvoices();
      res.json(totalOutstandingInvoices);
    } catch (error) {
      console.error("Error fetching total outstanding invoices:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch total outstanding invoices" });
    }
  }

  // Overdue Invoices
  async getOverdueInvoices(req: Request, res: Response) {
    try {
      const overdueInvoices = await this.bendaharaService.getOverdueInvoices();
      res.json(overdueInvoices);
    } catch (error) {
      console.error("Error fetching overdue invoices:", error);
      res.status(500).json({ error: "Failed to fetch overdue invoices" });
    }
  }

  // Financial Summary by Outlet
  async getFinancialSummaryByOutlet(req: Request, res: Response) {
    try {
      const financialSummary =
        await this.bendaharaService.getFinancialSummaryByOutlet();
      res.json(financialSummary);
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      res.status(500).json({ error: "Failed to fetch financial summary" });
    }
  }

  // Returns Summary
  async getReturnsSummary(req: Request, res: Response) {
    try {
      const returnsSummary = await this.bendaharaService.getReturnsSummary();
      res.json(returnsSummary);
    } catch (error) {
      console.error("Error fetching returns summary:", error);
      res.status(500).json({ error: "Failed to fetch returns summary" });
    }
  }

  // Monthly Financial Trends
  async getMonthlyFinancialTrends(req: Request, res: Response) {
    try {
      const monthlyFinancialTrends =
        await this.bendaharaService.getMonthlyFinancialTrends();
      res.json(monthlyFinancialTrends);
    } catch (error) {
      console.error("Error fetching monthly financial trends:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch monthly financial trends" });
    }
  }
}
