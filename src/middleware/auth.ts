// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

interface AuthenticatedRequest extends Request {
    userId?: string;
    email?: string;
    peran?: string; // Add `peran` field
}


export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: "No token provided!" });
        return;
    }

    // src/middleware/auth.ts

jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
        console.error("Error verifying token:", err);
        res.status(401).json({ message: "Unauthorized!" });
        return;
    }

    if (decoded && typeof decoded === 'object') {
        req.userId = (decoded as JwtPayload).userId;
        req.email = (decoded as JwtPayload).email;
        req.peran = (decoded as JwtPayload).peran; // Include the role (`peran`)
    }

    next();
});

};
