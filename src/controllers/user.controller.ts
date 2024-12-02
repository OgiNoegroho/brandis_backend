// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

abstract class BaseController {
  protected handleSuccess(res: Response, data: unknown, statusCode = 200): void {
    res.status(statusCode).json(data);
  }

  protected handleError(res: Response, error: unknown, message: string, statusCode = 500): void {
    console.error(message, error);
    res.status(statusCode).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  // Register a new user
  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = req.body;
      const createdUser = await this.userService.createUser(newUser);
      this.handleSuccess(res, createdUser, 201);
    } catch (error) {
      this.handleError(res, error, 'Error registering user');
    }
  }

  // Create a user session (login)
  public async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      this.handleSuccess(res, { token });
    } catch (error) {
      this.handleError(res, error, 'Error creating session', 401);
    }
  }

  // Get all users
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(res, error, 'Error retrieving all users');
    }
  }

  // Get a user by email
  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return this.handleError(res, new Error('User not found'), 'Error getting user', 404);
      }
      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(res, error, 'Error getting user');
    }
  }

  // Update a user by email
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const userUpdates = req.body;
      const updatedUser = await this.userService.updateUser(email, userUpdates);
      if (!updatedUser) {
        return this.handleError(res, new Error('User not found'), 'Error updating user', 404);
      }
      this.handleSuccess(res, updatedUser);
    } catch (error) {
      this.handleError(res, error, 'Error updating user');
    }
  }

  // Delete a user by email
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      await this.userService.deleteUser(email);
      res.status(204).send(); // No content
    } catch (error) {
      this.handleError(res, error, 'Error deleting user');
    }
  }
}
