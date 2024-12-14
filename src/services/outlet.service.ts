// src/service/product.service.ts


import { OutletModel } from '../models/outlet.model';
import { Outlet } from '../types/outlet.type';

export class OutletService {
    constructor(private outletModel: OutletModel) {}

    async getAllOutlets(): Promise<Outlet[]> {
        return this.outletModel.getAllOutlets();
    }

    async getOutletById(id: number) {
        return this.outletModel.getOutletById(id);
    }

    async addOutlet(outlet: Outlet): Promise<Outlet> {
        return this.outletModel.addOutlet(outlet.nama, outlet.alamat, outlet.nomor_telepon);
    }

    async editOutlet(id: number, outlet: Partial<Outlet>): Promise<Outlet> {
        return this.outletModel.editOutlet(id, outlet.nama!, outlet.alamat!, outlet.nomor_telepon);
    }

    async deleteOutlet(id: number): Promise<void> {
        return this.outletModel.deleteOutlet(id);
    }
}