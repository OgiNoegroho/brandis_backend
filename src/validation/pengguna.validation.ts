// src\validation\pengguna.validation.ts

import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { UserModel } from "../models/pengguna.model";

// Validation schema for creating a user
export const createUserValidation = Joi.object({
  id: Joi.string()
    .pattern(/^\d{10}$/) // Must be exactly 10 digits
    .required()
    .messages({
      "string.pattern.base": "ID must be a 10-digit number.",
      "any.required": "ID is required.",
    }),
  nama: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required(),
  peran: Joi.string()
    .valid("Manajer", "Bendahara", "Pemasaran", "Pimpinan")
    .required(),
});

// Validation schema for user login
export const createSessionValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Validation schema for updating a user
export const updateUserValidation = Joi.object({
  nama: Joi.string().min(3).max(100),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  peran: Joi.string()
    .valid("Manajer", "Bendahara", "Pemasaran", "Pimpinan")
    .optional(),
}).min(1);

export const validate = (validationFn: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = validationFn.validate(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      // Send the response and exit the function
      res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errorMessages,
      });
      return; // Early return to prevent further execution
    }

    // Replace request body with validated value
    req.body = value;
    next(); // Call the next middleware or route handler
  };
};

// Custom validation middleware to check if email exists in the database
export const validateEmailExists = (dbPool: Pool) => {
  const userModel = new UserModel(dbPool); // Pass dbPool to UserModel
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const email = req.body.email;
      const existingUser = await userModel.getUserByEmail(email);

      if (existingUser) {
        res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: [
            {
              field: "email",
              message: "Email is already registered",
            },
          ],
        });
        return; // Exit function to prevent further execution
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      next(error); // Pass any errors to the error-handling middleware
    }
  };
};
