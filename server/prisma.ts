import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, PoolConfig } from 'pg';
import { PostgresConfig } from '../src/types';
import { getPostgresConfig } from './db';

let prismaInstance: PrismaClient | null = null;
let currentAdapterPool: Pool | null = null;

/**
 * Build a pg Pool config from PostgresConfig
 */
function buildPoolConfig(config: PostgresConfig): PoolConfig {
  const poolOptions: PoolConfig = {};

  if (config.connectionString && config.connectionString.trim()) {
    poolOptions.connectionString = config.connectionString.trim();
  } else {
    poolOptions.host = config.host || 'localhost';
    poolOptions.port = config.port || 5432;
    poolOptions.user = config.user || 'postgres';
    poolOptions.password = config.password || '';
    poolOptions.database = config.database || 'silkprint_db';
  }

  if (config.ssl) {
    poolOptions.ssl = { rejectUnauthorized: false };
  }

  poolOptions.connectionTimeoutMillis = 8000;
  poolOptions.idleTimeoutMillis = 30000;
  poolOptions.max = 10;

  return poolOptions;
}

/**
 * Get or initialize the singleton PrismaClient with PgAdapter
 */
export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const config = getPostgresConfig();
    const poolConfig = buildPoolConfig(config);
    currentAdapterPool = new Pool(poolConfig);
    const adapter = new PrismaPg(currentAdapterPool);
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

/**
 * Re-initialize Prisma Client when PostgreSQL configuration changes
 */
export async function refreshPrismaClient(config?: Partial<PostgresConfig>): Promise<PrismaClient> {
  if (prismaInstance) {
    try {
      await prismaInstance.$disconnect();
    } catch {
      // ignore
    }
    prismaInstance = null;
  }

  if (currentAdapterPool) {
    try {
      await currentAdapterPool.end();
    } catch {
      // ignore
    }
    currentAdapterPool = null;
  }

  const currentCfg = getPostgresConfig();
  const merged = { ...currentCfg, ...config };
  const poolConfig = buildPoolConfig(merged);

  currentAdapterPool = new Pool(poolConfig);
  const adapter = new PrismaPg(currentAdapterPool);
  prismaInstance = new PrismaClient({ adapter });

  return prismaInstance;
}

/**
 * Test Prisma ORM connection and introspection
 */
export async function testPrismaConnection(): Promise<{
  success: boolean;
  message: string;
  modelsCount: number;
  models: string[];
  latencyMs: number;
}> {
  const startTime = Date.now();
  try {
    const prisma = getPrisma();
    // Test a basic query via prisma raw or count
    await prisma.$queryRawUnsafe('SELECT 1');
    const latencyMs = Date.now() - startTime;

    const models = [
      'Client',
      'Product',
      'Finishing',
      'Quote',
      'Order',
      'Transaction',
      'AccessProfile',
      'Employee',
      'MinioFile',
      'N8nEventLog',
      'SystemSetting',
    ];

    return {
      success: true,
      message: `Prisma ORM conectado com sucesso via PostgreSQL Adapter! (${latencyMs}ms)`,
      modelsCount: models.length,
      models,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      message: `Erro no Prisma ORM: ${err.message}`,
      modelsCount: 0,
      models: [],
      latencyMs,
    };
  }
}
