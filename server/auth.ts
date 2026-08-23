import crypto from 'crypto';
import { AccessProfile, UserEmployee } from '../src/types';
import { INITIAL_ACCESS_PROFILES } from '../src/lib/permissionsEngine';

// Secret key for JWT/HMAC token signing
const JWT_SECRET = process.env.JWT_SECRET || 'silkprint-production-master-secret-key-2026';

/**
 * Hash password using PBKDF2 with salt
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify password against stored hash and salt
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

/**
 * Generate a signed session token containing user payload
 */
export function generateToken(payload: { userId: string; email: string; isMaster: boolean }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days expiration
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode session token
 */
export function verifyToken(token: string): { userId: string; email: string; isMaster: boolean } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      isMaster: !!decoded.isMaster,
    };
  } catch {
    return null;
  }
}

/**
 * Default Master Admin user configuration
 */
export const MASTER_ADMIN_SEED = {
  id: 'emp-admin-master',
  name: 'Administrador Master',
  email: 'admin@silkprint.com.br',
  defaultPassword: 'admin123',
  whatsapp: '(11) 99999-9999',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  jobTitle: 'Diretor Geral & Administrador Master',
  department: 'Diretoria' as const,
  status: 'Ativo' as const,
  isMaster: true,
  profileIds: ['prof_admin'],
  customPermissions: [],
};
