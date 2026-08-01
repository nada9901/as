/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Security & JWT Authentication Middleware
 * Supports Access Tokens, Refresh Tokens, RBAC (Patient, Administrator), Bcrypt password hashing
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db, UserRecord } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'healthgluco_super_secure_jwt_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'healthgluco_refresh_secret_2026';
const ACCESS_TOKEN_EXPIRE = '4h';
const REFRESH_TOKEN_EXPIRE = '7d';

export interface TokenPayload {
  sub: string;
  email: string;
  role: 'Patient' | 'Administrator';
}

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

export function hashPassword(plainText: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainText, salt);
}

export function verifyPassword(plainText: string, hashed: string): boolean {
  return bcrypt.compareSync(plainText, hashed);
}

export function generateTokens(user: UserRecord) {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });

  return { accessToken, refreshToken };
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const allUsers = db.get().users;
    const user = allUsers.find((u) => u.id === decoded.sub && u.is_active);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User account not found or deactivated' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Expired or invalid token' });
  }
}

export function requireRole(role: 'Patient' | 'Administrator') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (req.user.role !== role && req.user.role !== 'Administrator') {
      res.status(403).json({
        error: `Forbidden: Requires ${role} role permissions`,
      });
      return;
    }
    next();
  };
}
