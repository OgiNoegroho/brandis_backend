// src/models/outlet.model.ts

import { Pool } from 'pg';
import { Outlet } from '../types/outlet.type';

export class OutletModel {
    constructor(private db: Pool) {}

    async getAllOutlets() {
        const query = 'SELECT * FROM brandis.outlet';
        const result = await this.db.query(query);
        return result.rows as Outlet[];
    }

    async getOutletById(id: number) {
        const query = 'SELECT * FROM brandis.outlet WHERE id = $1';
        const result = await this.db.query(query, [id]);
    
        if (result.rows.length === 0) {
            throw new Error(`Outlet with ID ${id} not found`);
        }
    
        return result.rows[0] as Outlet;
    }

    async addOutlet(nama: string, alamat: string, nomor_telepon?: string) {
        const query = 'INSERT INTO brandis.outlet (nama, alamat, nomor_telepon) VALUES ($1, $2, $3) RETURNING *';
        const result = await this.db.query(query, [nama, alamat, nomor_telepon]);
        return result.rows[0] as Outlet;
    }

    async editOutlet(id: number, nama: string, alamat: string, nomor_telepon?: string) {
        const query = 'UPDATE brandis.outlet SET nama = $1, alamat = $2, nomor_telepon = $3 WHERE id = $4 RETURNING *';
        const result = await this.db.query(query, [nama, alamat, nomor_telepon, id]);
        return result.rows[0] as Outlet;
    }

    async deleteOutlet(id: number) {
        const query = 'DELETE FROM brandis.outlet WHERE id = $1';
        await this.db.query(query, [id]);
    }
    
    async getStockOverviewForOutlet(outletId: number) {
        const query = `
            SELECT 
                p.nama AS nama_produk,              -- Product Name
                p.harga,                            -- Product Price
                COALESCE(SUM(so.kuantitas), 0) - COALESCE(SUM(dp.kuantitas), 0) AS kuantitas_stok -- Subtract returned quantities
            FROM
                brandis.stok_outlet so
            JOIN 
                brandis.batch b ON so.batch_id = b.id
            JOIN 
                brandis.produk p ON b.produk_id = p.id
            LEFT JOIN 
                brandis.detail_pengembalian dp ON b.id = dp.batch_id  -- Corrected column reference
            WHERE
                so.outlet_id = $1                  -- Filter by outlet ID
            GROUP BY 
                p.nama, p.harga;                   -- Group by product name and price
        `;
        const result = await this.db.query(query, [outletId]);
        return result.rows;
    }
    
    
}