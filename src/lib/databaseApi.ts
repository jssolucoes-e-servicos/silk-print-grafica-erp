import { PostgresConfig, DatabaseTableInfo } from '../types';

const DB_CONFIG_STORAGE_KEY = 'smartgraph_postgres_config';

export const DEFAULT_POSTGRES_CONFIG: PostgresConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '',
  database: 'silkprint_db',
  ssl: false,
  connectionString: '',
  status: 'disconnected',
};

export function getStoredPostgresConfig(): PostgresConfig {
  try {
    const saved = localStorage.getItem(DB_CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_POSTGRES_CONFIG, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Error loading stored postgres config:', err);
  }
  return DEFAULT_POSTGRES_CONFIG;
}

export function saveStoredPostgresConfig(config: PostgresConfig): void {
  try {
    localStorage.setItem(DB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving stored postgres config:', err);
  }
}

/**
 * Fetch current database config and status from backend
 */
export async function fetchDatabaseConfig(): Promise<PostgresConfig> {
  try {
    const res = await fetch('/api/database/config');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error('Error fetching database config:', err);
  }
  return getStoredPostgresConfig();
}

/**
 * Test PostgreSQL Connection with provided parameters
 */
export async function testDatabaseConnection(config: PostgresConfig): Promise<{
  success: boolean;
  message: string;
  serverVersion?: string;
  tablesCount?: number;
  tables?: DatabaseTableInfo[];
  latencyMs?: number;
  totalRecords?: Record<string, number>;
}> {
  try {
    const res = await fetch('/api/database/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const result = await res.json();
    if (result.success) {
      saveStoredPostgresConfig({
        ...config,
        status: 'connected',
        serverVersion: result.serverVersion,
        tablesCount: result.tablesCount,
        totalRecords: result.totalRecords,
      });
    }
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao testar conexão com o banco de dados: ${err.message || 'Falha de rede'}`,
      latencyMs: 0,
    };
  }
}

/**
 * Run Schema Migrations (create tables) on PostgreSQL
 */
export async function runDatabaseMigrations(): Promise<{
  success: boolean;
  createdTables: string[];
  message: string;
}> {
  try {
    const res = await fetch('/api/database/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      createdTables: [],
      message: `Falha ao executar migrações: ${err.message}`,
    };
  }
}

/**
 * Seed initial sample records into PostgreSQL
 */
export async function seedDatabaseFromMemory(): Promise<{
  success: boolean;
  message: string;
  insertedCounts?: Record<string, number>;
}> {
  try {
    const res = await fetch('/api/database/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: `Falha ao sincronizar dados no PostgreSQL: ${err.message}`,
    };
  }
}

/**
 * Execute raw SQL Query tester
 */
export async function executeDatabaseQuery(sql: string): Promise<{
  success: boolean;
  rows?: any[];
  rowCount?: number;
  fields?: string[];
  message?: string;
  executionTimeMs?: number;
}> {
  try {
    const res = await fetch('/api/database/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na execução do SQL: ${err.message}`,
    };
  }
}

// ==========================================
// PRISMA ORM API CLIENT METHODS
// ==========================================

export async function fetchPrismaStatus(): Promise<{
  isInitialized: boolean;
  version: string;
  status: 'connected' | 'disconnected' | 'error';
  message: string;
  latencyMs?: number;
  modelsCount: number;
  models: any[];
  lastChecked?: string;
}> {
  try {
    const res = await fetch('/api/prisma/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching Prisma status:', err);
  }
  return {
    isInitialized: true,
    version: '7.9.1',
    status: 'disconnected',
    message: 'Prisma Client pronto no backend',
    modelsCount: 11,
    models: [],
  };
}

export async function fetchPrismaSchema(): Promise<{
  success: boolean;
  schema?: string;
  models?: any[];
  message?: string;
}> {
  try {
    const res = await fetch('/api/prisma/schema');
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao carregar schema.prisma: ${err.message}`,
    };
  }
}

export async function executePrismaQuery(params: {
  model?: string;
  action?: string;
  queryParams?: any;
  rawSql?: string;
}): Promise<{
  success: boolean;
  type?: 'model' | 'raw';
  result?: any;
  count?: number;
  message?: string;
  latencyMs?: number;
}> {
  try {
    const res = await fetch('/api/prisma/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na consulta Prisma: ${err.message}`,
    };
  }
}

