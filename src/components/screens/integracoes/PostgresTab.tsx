import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Table,
  Layers,
  Save,
  Server,
  Key,
  Shield,
  Clock,
  Terminal,
  ArrowRight,
  Sparkles,
  Code2,
  Box,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PostgresConfig, DatabaseTableInfo, PrismaModelMeta } from '../../../types';
import {
  fetchDatabaseConfig,
  saveStoredPostgresConfig,
  testDatabaseConnection,
  runDatabaseMigrations,
  seedDatabaseFromMemory,
  executeDatabaseQuery,
  fetchPrismaStatus,
  fetchPrismaSchema,
  executePrismaQuery,
} from '../../../lib/databaseApi';
import confetti from 'canvas-confetti';

export const PostgresTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'prisma' | 'connection' | 'sql' | 'schema'>('prisma');

  // Postgres config state
  const [config, setConfig] = useState<PostgresConfig>({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'silkprint_db',
    ssl: false,
    connectionString: '',
    status: 'disconnected',
  });

  const [useConnectionString, setUseConnectionString] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Prisma state
  const [prismaStatus, setPrismaStatus] = useState<{
    isInitialized: boolean;
    version: string;
    status: 'connected' | 'disconnected' | 'error';
    message: string;
    latencyMs?: number;
    modelsCount: number;
    models: PrismaModelMeta[];
  }>({
    isInitialized: true,
    version: '7.9.1',
    status: 'disconnected',
    message: 'Prisma Client pronto no backend',
    modelsCount: 11,
    models: [],
  });
  const [isLoadingPrisma, setIsLoadingPrisma] = useState(false);
  const [selectedModel, setSelectedModel] = useState<PrismaModelMeta | null>(null);
  const [prismaRawSchema, setPrismaRawSchema] = useState<string>('');
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Prisma Query Playground state
  const [playgroundModel, setPlaygroundModel] = useState('Client');
  const [playgroundAction, setPlaygroundAction] = useState('findMany');
  const [playgroundParams, setPlaygroundParams] = useState('{\n  "take": 5\n}');
  const [isExecutingPrisma, setIsExecutingPrisma] = useState(false);
  const [prismaQueryResult, setPrismaQueryResult] = useState<{
    success: boolean;
    result?: any;
    count?: number;
    message?: string;
    latencyMs?: number;
  } | null>(null);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    serverVersion?: string;
    tablesCount?: number;
    tables?: DatabaseTableInfo[];
    latencyMs?: number;
  } | null>(null);

  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
    createdTables?: string[];
  } | null>(null);

  const [seedResult, setSeedResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState('SELECT id, name, whatsapp, cidade, total_spent FROM clients LIMIT 10;');
  const [queryResult, setQueryResult] = useState<{
    success: boolean;
    rows?: any[];
    rowCount?: number;
    fields?: string[];
    message?: string;
    executionTimeMs?: number;
  } | null>(null);

  const loadData = async () => {
    fetchDatabaseConfig().then((data) => {
      setConfig(data);
      if (data.connectionString) {
        setUseConnectionString(true);
      }
    });

    setIsLoadingPrisma(true);
    const statusData = await fetchPrismaStatus();
    setPrismaStatus(statusData);
    if (statusData.models && statusData.models.length > 0) {
      setSelectedModel(statusData.models[0]);
    }
    setIsLoadingPrisma(false);

    fetchPrismaSchema().then((res) => {
      if (res.success && res.schema) {
        setPrismaRawSchema(res.schema);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredPostgresConfig(config);
    try {
      await fetch('/api/database/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch {
      // ignore
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testDatabaseConnection(config);
    setTestResult(res);
    setIsTesting(false);
    if (res.success) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      // reload Prisma status too
      const pStatus = await fetchPrismaStatus();
      setPrismaStatus(pStatus);
    }
  };

  const handleRunMigrations = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    const res = await runDatabaseMigrations();
    setMigrationResult(res);
    setIsMigrating(false);
    if (res.success) {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      handleTestConnection();
      const pStatus = await fetchPrismaStatus();
      setPrismaStatus(pStatus);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    const res = await seedDatabaseFromMemory();
    setSeedResult(res);
    setIsSeeding(false);
    if (res.success) {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
      handleTestConnection();
      const pStatus = await fetchPrismaStatus();
      setPrismaStatus(pStatus);
    }
  };

  const handleExecuteSql = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlQuery.trim() || isExecutingSql) return;
    setIsExecutingSql(true);
    const res = await executeDatabaseQuery(sqlQuery);
    setQueryResult(res);
    setIsExecutingSql(false);
  };

  const handleExecutePrismaPlayground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExecutingPrisma) return;
    setIsExecutingPrisma(true);
    setPrismaQueryResult(null);

    let parsedParams: any = {};
    try {
      if (playgroundParams.trim()) {
        parsedParams = JSON.parse(playgroundParams);
      }
    } catch (err: any) {
      setPrismaQueryResult({
        success: false,
        message: `JSON de parâmetros inválido: ${err.message}`,
      });
      setIsExecutingPrisma(false);
      return;
    }

    const res = await executePrismaQuery({
      model: playgroundModel,
      action: playgroundAction,
      queryParams: parsedParams,
    });

    setPrismaQueryResult(res);
    setIsExecutingPrisma(false);
  };

  const copySchemaToClipboard = () => {
    if (!prismaRawSchema) return;
    navigator.clipboard.writeText(prismaRawSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Prisma & Postgres badge */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-blue-950/50 via-zinc-900 to-indigo-950/50 border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
            <Code2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-zinc-100">Prisma ORM & Banco PostgreSQL</h2>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Prisma Client v{prismaStatus.version}
              </span>
              <span
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                  config.status === 'connected'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {config.status === 'connected' ? '● Conectado' : '○ Não Conectado'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Camada de dados type-safe com Prisma ORM conectada ao PostgreSQL para modelos de CRM, Vendas, Ordens de Produção e Financeiro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <RotateCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testando...' : 'Testar Conexão Real'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('prisma')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'prisma'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Modelos do Prisma ({prismaStatus.modelsCount || 11})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('connection')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'connection'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Conexão & Migrações</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('schema')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'schema'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>schema.prisma</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sql')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'sql'
              ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Console SQL</span>
        </button>
      </div>

      {/* SUB-TAB 1: PRISMA MODELS & PLAYGROUND */}
      {activeSubTab === 'prisma' && (
        <div className="space-y-6">
          {/* Models Grid & Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Models List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-bold text-zinc-100">Modelos Prisma Mapeados</h3>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {prismaStatus.models.length || 11} models
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {(prismaStatus.models && prismaStatus.models.length > 0
                    ? prismaStatus.models
                    : [
                        { name: 'Client', tableName: 'clients', description: 'Clientes e compradores', fields: [], relations: [] },
                        { name: 'Product', tableName: 'products', description: 'Produtos e catálogo', fields: [], relations: [] },
                        { name: 'Finishing', tableName: 'finishings', description: 'Acabamentos', fields: [], relations: [] },
                        { name: 'Quote', tableName: 'quotes', description: 'Orçamentos', fields: [], relations: [] },
                        { name: 'Order', tableName: 'orders', description: 'Ordens de serviço', fields: [], relations: [] },
                        { name: 'Transaction', tableName: 'transactions', description: 'Fluxo financeiro', fields: [], relations: [] },
                        { name: 'AccessProfile', tableName: 'access_profiles', description: 'Perfis de acesso', fields: [], relations: [] },
                        { name: 'Employee', tableName: 'employees', description: 'Colaboradores', fields: [], relations: [] },
                        { name: 'MinioFile', tableName: 'minio_files', description: 'Arquivos S3', fields: [], relations: [] },
                        { name: 'N8nEventLog', tableName: 'n8n_event_logs', description: 'Logs n8n', fields: [], relations: [] },
                        { name: 'SystemSetting', tableName: 'system_settings', description: 'Configurações', fields: [], relations: [] },
                      ]
                  ).map((m: any) => {
                    const isSelected = selectedModel?.name === m.name;
                    return (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => {
                          setSelectedModel(m);
                          setPlaygroundModel(m.name);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-200'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold font-mono text-zinc-100 flex items-center gap-1.5">
                            <span>model {m.name}</span>
                            <span className="text-[10px] text-zinc-500 font-sans">
                              (@@map("{m.tableName}"))
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                            {m.description}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-zinc-600 ${isSelected ? 'text-blue-400' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Selected Model Details & Fields */}
            <div className="lg:col-span-8 space-y-4">
              {selectedModel ? (
                <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-blue-400">
                          model {selectedModel.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-300">
                          tabela: {selectedModel.tableName}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{selectedModel.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPlaygroundModel(selectedModel.name);
                          setPlaygroundAction('findMany');
                          setPlaygroundParams('{\n  "take": 5\n}');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Testar no Playground</span>
                      </button>
                    </div>
                  </div>

                  {/* Relations if any */}
                  {selectedModel.relations && selectedModel.relations.length > 0 && (
                    <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/30 space-y-1.5">
                      <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                        Relacionamentos Prisma
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedModel.relations.map((rel: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-xs font-mono rounded-md bg-zinc-900 border border-blue-500/30 text-zinc-200"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fields Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-zinc-300">Campos e Tipagens (TypeScript / Prisma)</div>
                    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                            <th className="p-2.5 font-semibold">Campo</th>
                            <th className="p-2.5 font-semibold">Tipo Prisma</th>
                            <th className="p-2.5 font-semibold">Atributos</th>
                            <th className="p-2.5 font-semibold">Coluna Postgres</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                          {selectedModel.fields && selectedModel.fields.length > 0 ? (
                            selectedModel.fields.map((f: any) => (
                              <tr key={f.name} className="hover:bg-zinc-900/40">
                                <td className="p-2.5 font-bold text-zinc-100 flex items-center gap-1.5">
                                  <span>{f.name}</span>
                                  {f.isId && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded">
                                      PK
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5 text-blue-400">{f.type}</td>
                                <td className="p-2.5 text-zinc-400">
                                  {f.isId && '@id '}
                                  {f.isRequired ? '(Obrigatório)' : '(Opcional)'}
                                </td>
                                <td className="p-2.5 text-zinc-500">
                                  {f.mappedName ? `@map("${f.mappedName}")` : f.name}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-zinc-500">
                                Nenhum campo detalhado para este modelo.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-500 bg-zinc-900 rounded-2xl border border-zinc-800">
                  Selecione um modelo à esquerda para inspecionar seus atributos.
                </div>
              )}
            </div>
          </div>

          {/* Interactive Prisma Query Playground */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100">Playground Interativo Prisma Client</h3>
              </div>
              <div className="text-xs text-zinc-400">
                Execute consultas ORM reais com <code className="text-emerald-400 font-mono">prisma.{playgroundModel.toLowerCase()}.{playgroundAction}()</code>
              </div>
            </div>

            <form onSubmit={handleExecutePrismaPlayground} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Modelo Prisma</label>
                  <select
                    value={playgroundModel}
                    onChange={(e) => setPlaygroundModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="Client">prisma.client</option>
                    <option value="Product">prisma.product</option>
                    <option value="Order">prisma.order</option>
                    <option value="Quote">prisma.quote</option>
                    <option value="Transaction">prisma.transaction</option>
                    <option value="Finishing">prisma.finishing</option>
                    <option value="AccessProfile">prisma.accessProfile</option>
                    <option value="Employee">prisma.employee</option>
                    <option value="MinioFile">prisma.minioFile</option>
                    <option value="N8nEventLog">prisma.n8nEventLog</option>
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Método ORM</label>
                  <select
                    value={playgroundAction}
                    onChange={(e) => setPlaygroundAction(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="findMany">findMany()</option>
                    <option value="findFirst">findFirst()</option>
                    <option value="count">count()</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-end">
                  <button
                    type="submit"
                    disabled={isExecutingPrisma}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className={`w-3.5 h-3.5 ${isExecutingPrisma ? 'animate-pulse' : ''}`} />
                    <span>{isExecutingPrisma ? 'Consultando...' : 'Executar Consulta Prisma'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Parâmetros da Consulta (JSON)</span>
                  <span className="text-[11px] text-zinc-500 font-normal font-mono">
                    ex: {"{\"take\": 5}"} ou {"{\"where\": {\"status\": \"em_aberto\"}}"}
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={playgroundParams}
                  onChange={(e) => setPlaygroundParams(e.target.value)}
                  className="w-full p-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-mono focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </form>

            {/* Playground Response */}
            {prismaQueryResult && (
              <div className="space-y-2 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className={prismaQueryResult.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {prismaQueryResult.success ? 'Consulta realizada com sucesso' : 'Erro no Prisma Client'}
                    </span>
                    {prismaQueryResult.count !== undefined && (
                      <span className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 text-zinc-300">
                        {prismaQueryResult.count} registro(s)
                      </span>
                    )}
                  </div>
                  {prismaQueryResult.latencyMs !== undefined && (
                    <span className="font-mono text-[11px] text-emerald-400">{prismaQueryResult.latencyMs}ms</span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 max-h-64 overflow-y-auto font-mono text-xs text-zinc-200">
                  <pre className="whitespace-pre-wrap">
                    {prismaQueryResult.success
                      ? JSON.stringify(prismaQueryResult.result, null, 2)
                      : prismaQueryResult.message}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: POSTGRESQL CONNECTION & MIGRATIONS */}
      {activeSubTab === 'connection' && (
        <div className="space-y-6">
          {/* Test Result Alert */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{testResult.message}</span>
                  {testResult.latencyMs !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-700 text-emerald-300">
                      {testResult.latencyMs}ms
                    </span>
                  )}
                  {testResult.serverVersion && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                      {testResult.serverVersion.split(',')[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Connection Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-zinc-100">Configuração do PostgreSQL</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseConnectionString(!useConnectionString)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer"
                  >
                    {useConnectionString ? 'Usar Campos Individuais' : 'Usar DATABASE_URL'}
                  </button>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  {useConnectionString ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">DATABASE_URL</label>
                      <input
                        type="text"
                        value={config.connectionString || ''}
                        onChange={(e) => setConfig({ ...config, connectionString: e.target.value })}
                        placeholder="postgresql://usuario:senha@host:5432/silkprint_db?sslmode=disable"
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Host / IP</label>
                          <input
                            type="text"
                            value={config.host}
                            onChange={(e) => setConfig({ ...config, host: e.target.value })}
                            placeholder="localhost ou IP do servidor"
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                          />
                        </div>
                        <div className="sm:col-span-4 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Porta</label>
                          <input
                            type="number"
                            value={config.port}
                            onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value, 10) || 5432 })}
                            placeholder="5432"
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Usuário</label>
                          <input
                            type="text"
                            value={config.user}
                            onChange={(e) => setConfig({ ...config, user: e.target.value })}
                            placeholder="postgres"
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                          />
                        </div>
                        <div className="sm:col-span-6 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Senha</label>
                          <input
                            type="password"
                            value={config.password || ''}
                            onChange={(e) => setConfig({ ...config, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300">Banco de Dados</label>
                          <input
                            type="text"
                            value={config.database}
                            onChange={(e) => setConfig({ ...config, database: e.target.value })}
                            placeholder="silkprint_db"
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 font-mono"
                          />
                        </div>
                        <div className="sm:col-span-4 flex items-center pt-6">
                          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.ssl}
                              onChange={(e) => setConfig({ ...config, ssl: e.target.checked })}
                              className="rounded border-zinc-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Habilitar SSL</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Parâmetros</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Migrations & Sync Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Sincronização & Migrações</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Crie a estrutura de tabelas relacionais do sistema e sincronize os registros diretamente no PostgreSQL.
                </p>

                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleRunMigrations}
                    disabled={isMigrating}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Table className={`w-4 h-4 ${isMigrating ? 'animate-spin' : ''}`} />
                    <span>{isMigrating ? 'Criando Tabelas...' : '1. Executar Migrações de Tabelas'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSeedDatabase}
                    disabled={isSeeding}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-700"
                  >
                    <Sparkles className={`w-4 h-4 text-amber-400 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>{isSeeding ? 'Sincronizando...' : '2. Sincronizar Registros Iniciais'}</span>
                  </button>
                </div>

                {migrationResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                      migrationResult.success
                        ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                        : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{migrationResult.message}</span>
                  </div>
                )}

                {seedResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                      seedResult.success
                        ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                        : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{seedResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SCHEMA.PRISMA VIEWER */}
      {activeSubTab === 'schema' && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-zinc-100">Arquivo de Definição (prisma/schema.prisma)</h3>
            </div>
            <button
              type="button"
              onClick={copySchemaToClipboard}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copiado!' : 'Copiar Schema'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 max-h-[500px] overflow-y-auto leading-relaxed">
            <pre className="whitespace-pre">{prismaRawSchema || '// Carregando schema.prisma...'}</pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DIRECT SQL CONSOLE */}
      {activeSubTab === 'sql' && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100">Console SQL Direto (Diagnóstico & Consulta)</h3>
            </div>
          </div>

          <form onSubmit={handleExecuteSql} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Digite comando SQL (ex: SELECT * FROM orders;)"
                className="w-full p-3.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-mono placeholder-zinc-600 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSqlQuery('SELECT id, name, whatsapp, cidade, total_spent FROM clients LIMIT 5;')}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  SELECT clients
                </button>
                <button
                  type="button"
                  onClick={() => setSqlQuery('SELECT id, code, client_name, total, status FROM orders LIMIT 5;')}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  SELECT orders
                </button>
                <button
                  type="button"
                  onClick={() => setSqlQuery('SELECT id, name, category, price, is_active FROM products LIMIT 5;')}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  SELECT products
                </button>
              </div>

              <button
                type="submit"
                disabled={isExecutingSql || !sqlQuery.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 ${isExecutingSql ? 'animate-pulse' : ''}`} />
                <span>{isExecutingSql ? 'Executando...' : 'Executar SQL'}</span>
              </button>
            </div>
          </form>

          {queryResult && (
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {queryResult.success
                    ? `Resultado: ${queryResult.rowCount ?? queryResult.rows?.length ?? 0} linha(s)`
                    : 'Erro na execução'}
                </span>
                {queryResult.executionTimeMs !== undefined && (
                  <span className="font-mono text-[11px] text-emerald-400">{queryResult.executionTimeMs}ms</span>
                )}
              </div>

              {queryResult.success && queryResult.rows && queryResult.rows.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-300">
                        {queryResult.fields?.map((f) => (
                          <th key={f} className="p-2.5 font-semibold">
                            {f}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {queryResult.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/50">
                          {queryResult.fields?.map((f) => (
                            <td key={f} className="p-2.5 truncate max-w-xs">
                              {typeof row[f] === 'object' ? JSON.stringify(row[f]) : String(row[f] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : queryResult.success ? (
                <div className="p-3 text-xs font-mono text-zinc-400 bg-zinc-950 rounded-xl border border-zinc-800">
                  Comando executado com sucesso. Nenhuma linha retornada.
                </div>
              ) : (
                <div className="p-3 text-xs font-mono text-rose-300 bg-rose-950/40 rounded-xl border border-rose-800/60">
                  {queryResult.message}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
