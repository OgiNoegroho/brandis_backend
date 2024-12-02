// src/services/user.service.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { User } from '../types/user.type';

export class UserService {
  constructor(private userModel: UserModel) {}

  // Create a new user with hashed password
  async createUser(user: User): Promise<User> {
    const existingUser = await this.userModel.getUserByEmail(user.email);
    if (existingUser) {
      throw new Error('Email is already taken');
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };

    return await this.userModel.create(userWithHashedPassword);
  }

  // User login logic
  async login(email: string, password: string): Promise<string> {
    const user = await this.userModel.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Create and return a JWT token
    const token = jwt.sign(
      { userId: user.id, peran: user.peran },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    return token;
  }

  // Retrieve all users
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.findAllUsers();
  }

  // Retrieve a user by email
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.getUserByEmail(email);
  }

  // Update user data by email
  async updateUser(email: string, userUpdates: Partial<User>): Promise<User | null> {
    return await this.userModel.updateUser(email, userUpdates);
  }

  // Delete a user by email
  async deleteUser(email: string): Promise<void> {
    await this.userModel.deleteUser(email);
  }
}
