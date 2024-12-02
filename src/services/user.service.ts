// src/services/user.service.ts

import { UserModel } from '../models/user.model';
import { User } from '../types/user.type';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class UserService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  
  constructor(private userModel: UserModel) {}

  async createUser(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };
    return this.userModel.create(userWithHashedPassword);
  }

  async login(email: string, password: string) {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role }, // Include user role for authorization checks
      this.JWT_SECRET,
      { expiresIn: '24h' } // Token expiration time
    );

    return token;
  }

  async getAllUsers() {
    return await this.userModel.findAllUsers();
  }

  async getUserByEmail(email: string) {
    return this.userModel.getUserByEmail(email);
  }

  async updateUser(email: string, userUpdates: Partial<User>) {
    if (userUpdates.password) {
      userUpdates.password = await bcrypt.hash(userUpdates.password, 10);
    }
    return this.userModel.updateUser(email, userUpdates);
  }

  async deleteUser(email: string) {
    return this.userModel.deleteUser(email);
  }
}
