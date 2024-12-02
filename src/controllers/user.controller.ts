// src/controllers/user.controller.ts




import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { Pool } from 'mysql2/promise';

abstract class BaseController {
  protected handleSuccess(res: Response, data: unknown, statusCode = 200): void {
    res.status(statusCode).json(data);
  }

  protected handleError(error: unknown, res: Response, message: string, statusCode = 500): void {
    console.error(message, error);
    res.status(statusCode).json({
      message: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

export class UserController extends BaseController {
  private userService: UserService;

  constructor(dbPool: Pool) {
    super();
    const userModel = new UserModel(dbPool);
    this.userService = new UserService(userModel);
  }

  public async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = req.body;
      // Validate newUser data (you can refactor validation into a helper method or middleware).
      const createdUser = await this.userService.createUser(newUser);
      this.handleSuccess(res, createdUser, 201);
    } catch (error) {
      this.handleError(error, res, 'Error registering user');
    }
  }

  public async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);
      this.handleSuccess(res, { token });
    } catch (error) {
      this.handleError(error, res, 'Error creating session', 401);
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(error, res, 'Error retrieving all users');
    }
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return this.handleError(new Error('User not found'), res, 'Error getting user', 404);
      }
      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(error, res, 'Error getting user');
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      const userUpdates = req.body;
      // Validate userUpdates data (can also refactor into helpers or middleware).
      const updatedUser = await this.userService.updateUser(email, userUpdates);
      if (!updatedUser) {
        return this.handleError(new Error('User not found'), res, 'Error updating user', 404);
      }
      this.handleSuccess(res, updatedUser);
    } catch (error) {
      this.handleError(error, res, 'Error updating user');
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      await this.userService.deleteUser(email);
      res.status(204).send(); // No content
    } catch (error) {
      this.handleError(error, res, 'Error deleting user');
    }
  }
}
