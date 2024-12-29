// src/routes/pengguna.route.ts

import express, { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/pengguna.controller";
import { Pool } from "pg";
import {
  validate,
  validateEmailExists,
} from "../validation/pengguna.validation";
import {
  createUserValidation,
  createSessionValidation,
  updateUserValidation,
} from "../validation/pengguna.validation";
import { authMiddleware } from "../middleware/auth";
import { UserModel } from "../models/pengguna.model";
import { UserService } from "../services/pengguna.service";

export const userRoutes = (dbPool: Pool) => {
  const router = express.Router();

  const userModel = new UserModel(dbPool);
  const userService = new UserService(userModel);

  const userController = new UserController(userService);

  router.post(
    "/register",
    validate(createUserValidation),
    validateEmailExists(dbPool),
    (req: Request, res: Response, next: NextFunction) => {
      userController.registerUser(req, res).catch(next);
    }
  );

  router.post(
    "/login",
    validate(createSessionValidation),
    (req: Request, res: Response, next: NextFunction) => {
      userController.createSession(req, res).catch(next);
    }
  );

  router.get(
    "/",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.getAllUsers(req, res).catch(next);
    }
  );

  router.get(
    "/:email",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.getUser(req, res).catch(next);
    }
  );

  router.put(
    "/:email",
    authMiddleware,
    validate(updateUserValidation),
    (req: Request, res: Response, next: NextFunction) => {
      userController.updateUser(req, res).catch(next);
    }
  );

  router.delete(
    "/:email",
    authMiddleware,
    (req: Request, res: Response, next: NextFunction) => {
      userController.deleteUser(req, res).catch(next);
    }
  );

  return router;
};
