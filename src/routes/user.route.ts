// src/routes/user.route.ts
import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { Pool } from 'mysql2/promise';
import { validate, validateEmailExists } from '../validation/user.validation';
import { createUserValidation, createSessionValidation, updateUserValidation } from '../validation/user.validation';
import { authMiddleware } from '../middleware/auth';
import { UserModel } from '../models/user.model';

export const userRoutes = (dbPool: Pool) => {
  const router = express.Router();
  const userController = new UserController(dbPool);
  const userModel = new UserModel(dbPool);

  // Route to register a new user
  router.post(
    '/register',
    validate(createUserValidation),
    validateEmailExists(userModel), // Middleware to check if email already exists
    (req: Request, res: Response, next: NextFunction) => {
      userController.registerUser(req, res).catch(next);
    }
  );

  // Route for user login session creation
  router.post(
    '/login',
    validate(createSessionValidation),
    (req: Request, res: Response, next: NextFunction) => {
      userController.createSession(req, res).catch(next);
    }
  );

  // Route to get all users (requires authentication)
  router.get(
    '/',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.getAllUsers(req, res).catch(next);
    }
  );

  // Route to get a single user by email (requires authentication)
  router.get(
    '/:email',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.getUser(req, res).catch(next);
    }
  );

  // Route to update a user (requires authentication)
  router.put(
    '/:email',
    authMiddleware,
    validate(updateUserValidation),
    (req: Request, res: Response, next: NextFunction) => {
      userController.updateUser(req, res).catch(next);
    }
  );

  // Route to delete a user (requires authentication)
  router.delete(
    '/:email',
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.deleteUser(req, res).catch(next);
    }
  );

  return router;
};
