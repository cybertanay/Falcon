import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const isProduction = process.env.NODE_ENV === 'production';
const envSecret = process.env.SESSION_SECRET;

if (isProduction && (!envSecret || envSecret.length < 32)) {
  throw new Error(
    '[FATAL SECURITY CONFIG] In production, SESSION_SECRET environment variable MUST be set with at least 32 characters. Server startup halted.'
  );
}

const SESSION_SECRET = envSecret || 'dev_insecure_fallback_session_secret_for_local_development_only_32_chars';

export interface AdminTokenPayload {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sales';
}

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

/**
 * Hashes a plaintext password securely using bcrypt with 12 salt rounds.
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

  // 1. Check HttpOnly cookie first (recommended secure browser transport)
  if ((req as any).cookies && (req as any).cookies.falcon_admin_token) {
    token = (req as any).cookies.falcon_admin_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // 2. Check Authorization header (for automated scripts or legacy clients)
    token = req.headers.authorization.split(' ')[1];
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

/**
 * Role-Based Access Control (RBAC) middleware.
 * Enforces that the authenticated user possesses one of the allowed roles.
 */
export function requireRole(...allowedRoles: Array<'super_admin' | 'admin' | 'sales'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        error: 'Unauthorized: Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        error: `Forbidden: Insufficient privileges. Role '${req.admin.role}' is not authorized for this operation. Allowed: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
}

/**
 * CSRF Protection middleware for state-changing admin actions (POST, PUT, PATCH, DELETE).
 * Enforces origin validation against trusted hosts and requires trusted custom headers.
 */
export function requireCsrfProtection(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }

  const customHeader = req.headers['x-falcon-admin'] || req.headers['x-requested-with'];
  const origin = (req.headers['origin'] || req.headers['referer']) as string | undefined;

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const allowedHosts = new Set<string>();

  try {
    allowedHosts.add(new URL(appUrl).host);
  } catch (e) {}
  allowedHosts.add('localhost:3000');
  allowedHosts.add('localhost:5173');
  allowedHosts.add('127.0.0.1:3000');
  allowedHosts.add('127.0.0.1:5173');

  // If an Origin or Referer header is present, verify its host is explicitly allowed
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (!allowedHosts.has(originHost)) {
        return res.status(403).json({
          error: `Forbidden: Cross-site request rejected. Origin '${originHost}' is not authorized.`
        });
      }
    } catch (e) {
      return res.status(403).json({
        error: 'Forbidden: Malformed Origin or Referer header.'
      });
    }
  }

  // Require either a trusted custom header or valid same-origin
  if (!customHeader && (!origin || !allowedHosts.has(new URL(origin).host))) {
    return res.status(403).json({
      error: 'Forbidden: CSRF validation failed. Missing expected security verification headers (e.g. X-Falcon-Admin).'
    });
  }

  next();
}

