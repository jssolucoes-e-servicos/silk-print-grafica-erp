/**
 * Server Permissions & NestJS Integration Adapter
 * 
 * Provides runtime validation helpers for:
 * 1. Server Components / Server Actions (Next.js / Remix / Vite Server Actions)
 * 2. API Routes / Express middleware
 * 3. NestJS Decorator / Guard reference architecture (@RequirePermission)
 */

import { UserEmployee, AccessProfile, ActionFlag } from '../types';
import { evaluateUserPermission, can, canAll, canAny } from './permissionsEngine';
import resourcesSchema from '../data/resources.json';

export interface ServerActionContext {
  user: UserEmployee;
  profiles: AccessProfile[];
  ipAddress?: string;
  userAgent?: string;
}

export interface PermissionCheckResult {
  allowed: boolean;
  code: string;
  statusCode: 200 | 401 | 403;
  error?: string;
  details?: {
    resource: string;
    action: string;
    source: string;
    reason: string;
  };
}

/**
 * Validates permission on server-side actions or API handlers.
 * Throws an explicit 403 error or returns validation outcome.
 */
export function checkServerPermission(
  context: ServerActionContext,
  requiredPermission: string
): PermissionCheckResult {
  const { user, profiles } = context;

  if (!user) {
    return {
      allowed: false,
      code: requiredPermission,
      statusCode: 401,
      error: 'Unauthorized: No active user session provided.',
    };
  }

  if (user.status === 'Bloqueado') {
    return {
      allowed: false,
      code: requiredPermission,
      statusCode: 403,
      error: 'Forbidden: User account is blocked.',
    };
  }

  const evaluation = evaluateUserPermission(user, requiredPermission, profiles, 'routine');

  if (!evaluation.hasAccess) {
    const [resource, action] = requiredPermission.split('.');
    return {
      allowed: false,
      code: requiredPermission,
      statusCode: 403,
      error: `Forbidden: User lacks '${requiredPermission}' capability.`,
      details: {
        resource: resource || requiredPermission,
        action: action || 'view',
        source: evaluation.source,
        reason: evaluation.reason,
      },
    };
  }

  const [resource, action] = requiredPermission.split('.');
  return {
    allowed: true,
    code: requiredPermission,
    statusCode: 200,
    details: {
      resource: resource || requiredPermission,
      action: action || 'view',
      source: evaluation.source,
      reason: evaluation.reason,
    },
  };
}

/**
 * Server Action wrapper.
 * Executes action only if user passes required permission check.
 * 
 * Example usage:
 * export const createCustomerAction = withServerPermission(
 *   'customers.create',
 *   async (context, data: NewCustomerInput) => {
 *     return await db.customers.create(data);
 *   }
 * );
 */
export function withServerPermission<TInput, TOutput>(
  requiredPermission: string,
  handler: (context: ServerActionContext, input: TInput) => Promise<TOutput> | TOutput
) {
  return async (context: ServerActionContext, input: TInput): Promise<TOutput> => {
    const check = checkServerPermission(context, requiredPermission);
    if (!check.allowed) {
      throw new Error(`[403 FORBIDDEN] Permission '${requiredPermission}' required. Reason: ${check.error}`);
    }
    return await handler(context, input);
  };
}

/**
 * Express / NestJS Middleware helper
 */
export function requirePermissionMiddleware(requiredPermission: string, profiles: AccessProfile[]) {
  return (req: any, res: any, next: any) => {
    const user = req.user as UserEmployee;
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized: Session missing',
      });
    }

    const check = checkServerPermission({ user, profiles }, requiredPermission);
    if (!check.allowed) {
      return res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: `Missing required permission: ${requiredPermission}`,
        details: check.details,
      });
    }

    next();
  };
}

/**
 * NestJS Guard / Decorator Blueprint Generator
 * Outputs TypeScript decorator boilerplate to copy into your NestJS project!
 */
export function generateNestJsBoilerplate() {
  return `
// =======================================================
// NESTJS RBAC / PERMISSION GUARD IMPLEMENTATION (Copy & Paste)
// =======================================================

import { SetMetadata, Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSION_KEY = 'required_permission';
export const RequirePermission = (permission: string) => SetMetadata(PERMISSION_KEY, permission);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true; // No permission restriction on this handler
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Injected by JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('User authentication context required.');
    }

    // Direct Admin bypass
    if (user.roles?.includes('ADMIN') || user.isSuperAdmin) {
      return true;
    }

    // Check user effective permissions array (calculated at login / token issuance)
    const userPermissions: string[] = user.permissions || [];
    const hasPermission = userPermissions.includes(requiredPermission) || userPermissions.includes(requiredPermission.split('.')[0] + '.*');

    if (!hasPermission) {
      throw new ForbiddenException(\`Access Denied: Missing '\${requiredPermission}' permission.\`);
    }

    return true;
  }
}

// Controller Example:
// @Controller('customers')
// @UseGuards(JwtAuthGuard, PermissionsGuard)
// export class CustomersController {
//   @Get()
//   @RequirePermission('customers.view')
//   findAll() { return this.customersService.findAll(); }
//
//   @Post()
//   @RequirePermission('customers.create')
//   create(@Body() dto: CreateCustomerDto) { return this.customersService.create(dto); }
//
//   @Delete(':id')
//   @RequirePermission('customers.delete')
//   softDelete(@Param('id') id: string) { return this.customersService.softDelete(id); }
// }
`;
}
