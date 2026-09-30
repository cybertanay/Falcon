import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SESSION_SECRET = process.env.SESSION_SECRET || 'falcon_secure_session_secret_2026_dev_key';

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sales';
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

/**
 * Hashes a plaintext password securely using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password against bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Issues a signed JWT session token for an authenticated administrator.
 */
export function signAdminToken(payload: AdminTokenPayload, expiresIn: string = '8h'): string {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: expiresIn as any });
}

/**
 * Express middleware to verify admin authentication.
 * Checks both HttpOnly cookie 'falcon_admin_token' and 'Authorization: Bearer <token>' header.
 * Rejects unauthenticated requests with 401 Unauthorized.
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if ((req as any).cookies && (req as any).cookies.falcon_admin_token) {
    // 2. Check HttpOnly cookie
    token = (req as any).cookies.falcon_admin_token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Administrator authentication required to access this endpoint.'
    });
  }

  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as AdminTokenPayload;
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Session token is invalid or has expired. Please re-authenticate.'
    });
  }
}
