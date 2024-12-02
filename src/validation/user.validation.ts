// src/validation/user.validation.ts


import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { User } from '../types/user.type';
import { UserModel } from '../models/user.model'; 

// Custom error messages
const errorMessages = {
  email: {
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  },
  password: {
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least {#limit} characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required',
  },
  name: {
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least {#limit} characters long',
    'string.max': 'Name cannot be longer than {#limit} characters',
    'any.required': 'Name is required',
  },
  role: {
    'string.empty': 'Role cannot be empty',
    'any.only': 'Role must be one of: {#valids}',
  },
  user_id: {
    'string.empty': 'User ID cannot be empty',
    'string.pattern.base': 'User ID must be in the format uidXXX (e.g., uid001)',
    'any.required': 'User ID is required',
  },
};

// Validation schema for creating a user
export const createUserValidation = (payload: User) => {
  const schema = Joi.object({
    user_id: Joi.string()
      .pattern(/^uid\d{3}$/) // Ensure the user_id follows the uid001 format
      .required()
      .messages(errorMessages.user_id),

    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages(errorMessages.name),

    email: Joi.string()
      .email()
      .required()
      .messages(errorMessages.email),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages(errorMessages.password),

    role: Joi.string()
      .valid('Admin Produksi', 'Admin Gudang', 'Bendahara', 'Pemasaran', 'Pimpinan') // Match the ENUM values
      .default('Pemasaran') // Default to 'Pemasaran'
      .messages(errorMessages.role),
  });

  return schema.validate(payload, { abortEarly: false });
};

// Validation schema for user session creation (login)
export const createSessionValidation = (payload: Pick<User, 'email' | 'password'>) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages(errorMessages.email),

    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required',
      }),
  });

  return schema.validate(payload, { abortEarly: false });
};

// Validation schema for updating a user
export const updateUserValidation = (payload: Partial<User>) => {
  const schema = Joi.object({
    user_id: Joi.string()
      .pattern(/^uid\d{3}$/) // Ensure the user_id follows the uid001 format
      .messages(errorMessages.user_id),

    name: Joi.string()
      .min(2)
      .max(50)
      .messages(errorMessages.name),

    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages(errorMessages.password),

    role: Joi.string()
      .valid('Admin Produksi', 'Admin Gudang', 'Bendahara', 'Pemasaran', 'Pimpinan') // Match the ENUM values
      .messages(errorMessages.role),
  })
  .min(1) // Require at least one field to be present
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

  return schema.validate(payload, { abortEarly: false });
};

// Generic validation middleware
export const validate = (validationFn: (payload: any) => Joi.ValidationResult) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = validationFn(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      // Send the response and exit the function
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errorMessages,
      });
      return; // Early return to prevent further execution
    }

    // Replace request body with validated value
    req.body = value;
    next(); // Call the next middleware or route handler
  };
};

// Custom validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResponse {
  status: string;
  message: string;
  errors?: ValidationError[];
}

export const validateEmailExists = (userModel: UserModel) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.body.email;
      const existingUser = await userModel.getUserByEmail(email);
      
      if (existingUser) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: [{
            field: 'email',
            message: 'Email is already registered',
          }],
        });
        return; // Exit function to prevent further execution
      }
      
      next(); // Call next() without returning a value
    } catch (error) {
      next(error); // Pass any errors to the error-handling middleware
    }
  };
};

// Validation middleware for query parameters
export const validateQueryParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);

    if (error) {
      // Send the response and exit the function
      res.status(400).json({
        status: 'error',
        message: 'Invalid query parameters',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
      return; // Early return to prevent further execution
    }

    next(); // Call the next middleware or route handler
  };
};

// Common query parameter validation schemas
export const commonQueryValidation = {
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
  
  sorting: Joi.object({
    sortBy: Joi.string().valid('name', 'email', 'role', 'createdAt'),
    order: Joi.string().valid('asc', 'desc').default('asc'),
  }),
};
