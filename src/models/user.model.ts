// src/models/user.model.ts

import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { User } from '../types/user.type';

export class UserModel {
  constructor(private db: Pool) {}

  async create(user: User): Promise<User> {
    const [result] = await this.db.execute<ResultSetHeader>(
      'INSERT INTO Users (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user.user_id, user.name, user.email, user.password, user.role]
    );
    return { ...user, user_id: result.insertId.toString() };
  }

  async findAllUsers(): Promise<User[]> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM Users');
    return rows.map(row => ({
      user_id: row.user_id.toString(),
      name: row.name,
      email: row.email,
      password: row.password, // Avoid returning password in real applications; use user without it
      role: row.role,
    })) as User[];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error('Email is undefined in getUserByEmail');
    }
    const [rows] = await this.db.execute<RowDataPacket[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    return rows.length ? (rows[0] as User) : null;
  }
  

  async updateUser(email: string, userUpdates: Partial<User>): Promise<User | null> {
    const updateFields = [];
    const updateValues = [];

    if (userUpdates.name) {
      updateFields.push('name = ?');
      updateValues.push(userUpdates.name);
    }
    if (userUpdates.password) {
      updateFields.push('password = ?');
      updateValues.push(userUpdates.password);
    }
    if (userUpdates.role !== undefined) {
      updateFields.push('role = ?');
      updateValues.push(userUpdates.role);
    }

    updateValues.push(email);

    const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE email = ?`;
    await this.db.execute<ResultSetHeader>(query, updateValues);
    return this.getUserByEmail(email);
  }

  async deleteUser(email: string): Promise<void> {
    await this.db.execute<ResultSetHeader>('DELETE FROM Users WHERE email = ?', [email]);
  }
}
