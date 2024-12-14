// src/controllers/outlet.controller.ts

import { Request, Response } from 'express';
import { OutletService } from '../services/outlet.service';
import { Outlet } from '../types/outlet.type';

export class OutletController {
    constructor(private outletService: OutletService) {}

    async getAllOutlets(req: Request, res: Response) {
        try {
            const outlets: Outlet[] = await this.outletService.getAllOutlets();
            res.status(200).json(outlets);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async getOutletById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const outlet: Outlet = await this.outletService.getOutletById(parseInt(id));
            res.status(200).json(outlet);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async addOutlet(req: Request, res: Response) {
        try {
            const outlet: Outlet = await this.outletService.addOutlet(req.body);
            res.status(201).json(outlet);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async editOutlet(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedOutlet: Outlet = await this.outletService.editOutlet(parseInt(id), req.body);
            res.status(200).json(updatedOutlet);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }

    async deleteOutlet(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.outletService.deleteOutlet(parseInt(id));
            res.status(200).json({ message: 'Outlet deleted successfully' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    }
}