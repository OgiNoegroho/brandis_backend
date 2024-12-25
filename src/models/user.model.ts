// src/models/user.model.ts

import { Pool } from 'pg';
import { User } from '../types/user.type';

export class UserModel {
  constructor(private db: Pool) {}

  async create(user: User): Promise<User> {
    const query = `
        INSERT INTO brandis.pengguna (id, nama, email, password, peran)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nama, email, peran;
    `;
    const values = [user.id, user.nama, user.email, user.password, user.peran];
    const result = await this.db.query(query, values);
    const newUser = result.rows[0];
    return { ...newUser, id: newUser.id.toString() };
  }

  async findAllUsers(): Promise<User[]> {
    const query =
      "SELECT id, nama, email, peran FROM brandis.pengguna WHERE peran != $1";
    const result = await this.db.query(query, ["Pimpinan"]); // Exclude users with 'Pimpinan' role
    return result.rows.map((row) => ({
      id: row.id.toString(),
      nama: row.nama,
      email: row.email,
      password: row.password, // Avoid returning password in real applications
      peran: row.peran,
    }));
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query =
      "SELECT id, nama, email, password, peran FROM brandis.pengguna WHERE email = $1";
    const result = await this.db.query(query, [email]);
    if (result.rows.length) {
      const row = result.rows[0];
      return {
        id: row.id.toString(),
        nama: row.nama,
        email: row.email,
        password: row.password,
        peran: row.peran,
      };
    }
    return null;
  }

  async updateUser(
    email: string,
    userUpdates: Partial<User>
  ): Promise<User | null> {
    const updateFields = [];
    const updateValues = [];

    if (userUpdates.nama) {
      updateFields.push("nama = $1");
      updateValues.push(userUpdates.nama);
    }
    if (userUpdates.password) {
      updateFields.push("password = $2");
      updateValues.push(userUpdates.password);
    }
    if (userUpdates.peran) {
      updateFields.push("peran = $3");
      updateValues.push(userUpdates.peran);
    }

    updateValues.push(email);

    const query = `UPDATE brandis.pengguna SET ${updateFields.join(
      ", "
    )} WHERE email = $${updateValues.length} RETURNING id, nama, email, peran`;
    const result = await this.db.query(query, updateValues);
    if (result.rows.length) {
      const row = result.rows[0];
      return {
        id: row.id.toString(),
        nama: row.nama,
        email: row.email,
        password: row.password,
        peran: row.peran,
      };
    }
    return null;
  }

  async deleteUser(email: string): Promise<void> {
    const query = "DELETE FROM brandis.pengguna WHERE email = $1";
    await this.db.query(query, [email]);
  }
}