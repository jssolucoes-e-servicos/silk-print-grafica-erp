import React, { useState } from 'react';
import {
  Server,
  Code2,
  Copy,
  Check,
  Globe,
  Zap,
  Layers,
  ChevronRight,
  Shield,
  Send,
  Database,
  Terminal,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderTree,
  FileCode,
  Sliders,
} from 'lucide-react';
import { NESTJS_MODULES_BLUEPRINT, NestModuleDef, NestEndpointDef } from '../../api/nestjs-blueprint';
import { apiClient } from '../../api/client';

export const NestJsApiDocsScreen: React.FC = () => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'endpoints' | 'nestjs-code' | 'test-connection'>('endpoints');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom API URL config state
  const [apiUrlInput, setApiUrlInput] = useState(apiClient.getBaseUrl());
  const [pingStatus, setPingStatus] = useState<{
    tested: boolean;
    loading: boolean;
    ok?: boolean;
    message?: string;
    latencyMs?: number;
  }>({ tested: false, loading: false });

  const currentModule: NestModuleDef = NESTJS_MODULES_BLUEPRINT[selectedModuleIndex] || NESTJS_MODULES_BLUEPRINT[0];
  const currentEndpoint: NestEndpointDef | undefined = currentModule.endpoints[selectedEndpointIndex] || currentModule.endpoints[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveApiUrl = () => {
    apiClient.setBaseUrl(apiUrlInput);
    handleTestPing();
  };

  const handleTestPing = async () => {
    setPingStatus({ tested: true, loading: true });
    const result = await apiClient.ping();
    setPingStatus({
      tested: true,
      loading: false,
      ok: result.ok,
      message: result.message,
      latencyMs: result.latencyMs,
    });
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'POST':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  };

  // Generate NestJS Controller Template for current module
  const generateNestControllerCode = () => {
    const controllerName = currentModule.name.replace('Module', 'Controller');
    const serviceName = currentModule.name.replace('Module', 'Service');
    const routePrefix = currentModule.controller.match(/@Controller\("([^"]+)"\)/)?.[1] || 'api';

    return `import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ${serviceName} } from './${currentModule.name.toLowerCase().replace('module', '')}.service';
// Importe seus DTOs e Guards aqui

@ApiTags('${currentModule.name.replace('Module', '')}')
@ApiBearerAuth()
@Controller('${routePrefix}')
export class ${controllerName} {
  constructor(private readonly ${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}: ${serviceName}) {}

${currentModule.endpoints
  .map((ep) => {
    const methodDecorator = ep.method.charAt(0) + ep.method.slice(1).toLowerCase();
    const cleanPath = ep.path.replace(`/api/${routePrefix}`, '').replace(/^\//, '');
    const pathArg = cleanPath ? `'${cleanPath}'` : '';
    const fnName = ep.summary.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').slice(0, 25);
    const bodyArg = ep.requestDto ? `@Body() dto: ${ep.requestDto}` : '';
    const paramMatch = ep.path.match(/:([a-zA-Z0-9]+)/);
    const paramArg = paramMatch ? `@Param('${paramMatch[1]}') ${paramMatch[1]}: string` : '';
    const allArgs = [paramArg, bodyArg].filter(Boolean).join(', ');

    return `  @${methodDecorator.toUpperCase()}(${pathArg})
  @ApiOperation({ summary: '${ep.summary}' })
  @ApiResponse({ status: 200, description: '${ep.description}' })
  async ${fnName}(${allArgs}) {
    return this.${serviceName.charAt(0).toLowerCase() + serviceName.slice(1)}.${fnName}(${allArgs.includes('id') ? 'id, ' : ''}${ep.requestDto ? 'dto' : ''});
  }`;
  })
  .join('\n\n')}
}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2.5">
                  <span>Guia de Integração & Contratos NestJS</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                    NestJS Ready 🚀
                  </span>
                </h1>
                <p className="text-xs text-zinc-400">
                  Infraestrutura cliente completa com rotas, DTOs, validações e client HTTP prontos para conectar ao seu backend NestJS.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Base URL Switcher */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400 px-1">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-zinc-300">Base API URL:</span>
            </div>
            <input
              type="text"
              value={apiUrlInput}
              onChange={(e) => setApiUrlInput(e.target.value)}
              placeholder="Ex: http://localhost:3333 ou /api"
              className="bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-red-500 min-w-[220px]"
            />
            <button
              onClick={handleSaveApiUrl}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar & Testar</span>
            </button>
          </div>
        </div>

        {/* Live Ping Feedback */}
        {pingStatus.tested && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {pingStatus.loading ? (
                <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin" />
              ) : pingStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={pingStatus.ok ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {pingStatus.loading ? 'Testando conexão...' : pingStatus.message}
              </span>
            </div>
            {pingStatus.latencyMs !== undefined && (
              <span className="text-zinc-500 font-mono text-[11px]">Latência: {pingStatus.latencyMs}ms</span>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'endpoints'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <FolderTree className="w-4 h-4 text-red-400" />
          <span>Módulos & DTOs ({NESTJS_MODULES_BLUEPRINT.length} Módulos)</span>
        </button>

        <button
          onClick={() => setActiveTab('nestjs-code')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'nestjs-code'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Code2 className="w-4 h-4 text-blue-400" />
          <span>Gerador de Código NestJS</span>
        </button>

        <button
          onClick={() => setActiveTab('test-connection')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'test-connection'
              ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Como Integrar no Frontend</span>
        </button>
      </div>

      {/* Tab: Endpoints Explorer */}
      {activeTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Modules List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
              Módulos NestJS
            </h3>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {NESTJS_MODULES_BLUEPRINT.map((mod, idx) => (
                <button
                  key={mod.name}
                  onClick={() => {
                    setSelectedModuleIndex(idx);
                    setSelectedEndpointIndex(0);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedModuleIndex === idx
                      ? 'bg-zinc-800/90 border-red-500/40 text-zinc-100 shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedModuleIndex === idx ? 'bg-red-500 ring-2 ring-red-500/30' : 'bg-zinc-600'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold">{mod.name}</div>
                      <div className="text-[10px] text-zinc-500">{mod.endpoints.length} rotas definidas</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Area: Endpoints and DTOs details */}
          <div className="lg:col-span-8 space-y-5">
            {/* Module Overview Card */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <span>{currentModule.name}</span>
                    <span className="text-xs font-normal text-zinc-400 font-mono">
                      ({currentModule.folder})
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">{currentModule.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-md">
                    {currentModule.controller}
                  </span>
                </div>
              </div>
            </div>

            {/* Endpoints Pill Selector */}
            <div className="flex flex-wrap gap-2">
              {currentModule.endpoints.map((ep, idx) => (
                <button
                  key={`${ep.method}-${ep.path}`}
                  onClick={() => setSelectedEndpointIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    selectedEndpointIndex === idx
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-xs'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded border ${getMethodBadgeClass(ep.method)}`}>
                    {ep.method}
                  </span>
                  <span>{ep.path}</span>
                </button>
              ))}
            </div>

            {/* Active Endpoint Spec */}
            {currentEndpoint && (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border font-mono ${getMethodBadgeClass(currentEndpoint.method)}`}>
                      {currentEndpoint.method}
                    </span>
                    <span className="text-sm font-mono font-bold text-zinc-100">{currentEndpoint.path}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentEndpoint.authRequired && (
                      <span className="flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-semibold">
                        <Shield className="w-3 h-3" />
                        JWT Bearer Auth
                      </span>
                    )}
                    {currentEndpoint.permission && (
                      <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono">
                        {currentEndpoint.permission}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wide mb-1">Descrição do Endpoint</h4>
                  <p className="text-xs text-zinc-400">{currentEndpoint.description}</p>
                </div>

                {/* Contracts / DTOs grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                      Request DTO / Payload
                    </div>
                    <div className="text-xs font-mono text-emerald-400">
                      {currentEndpoint.requestDto || '(Nenhum payload no Body)'}
                    </div>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-1">
                      Response DTO / Retorno
                    </div>
                    <div className="text-xs font-mono text-blue-400">{currentEndpoint.responseDto}</div>
                  </div>
                </div>

                {/* Sample JSON Body */}
                {currentEndpoint.sampleBody && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-300">Exemplo de Payload Enviado (JSON)</span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(currentEndpoint.sampleBody, null, 2), 'body')}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar JSON</span>
                      </button>
                    </div>
                    <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48">
                      {JSON.stringify(currentEndpoint.sampleBody, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: NestJS Controller Code Generator */}
      {activeTab === 'nestjs-code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Código do Controller NestJS: <span className="text-red-400">{currentModule.name.replace('Module', 'Controller')}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Copie e cole diretamente no seu projeto NestJS em <code className="text-zinc-300 font-mono">{currentModule.folder}</code>
              </p>
            </div>
            <button
              onClick={() => handleCopy(generateNestControllerCode(), 'controller-code')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              {copiedKey === 'controller-code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'controller-code' ? 'Código Copiado!' : 'Copiar Controller NestJS'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[500px]">
              <code>{generateNestControllerCode()}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab: How to integrate with Frontend */}
      {activeTab === 'test-connection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Como consumir a API no Frontend</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O frontend já possui um objeto central tipado <code className="text-red-400 font-mono">api</code> pronto para ser importado em qualquer tela ou componente:
            </p>
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
{`import { api } from '../api';

// Exemplos de chamadas:
const clientes = await api.clients.getAll();
const novoPedido = await api.orders.create(dadosPedido);
const resumoFinanceiro = await api.financial.getSummary();
await api.orders.updateStatus(orderId, 'em_producao');`}
            </pre>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Configuração da URL do NestJS</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Você pode definir a URL do seu NestJS criando ou editando a variável de ambiente <code className="text-blue-400 font-mono">.env</code>:
            </p>
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
{`# .env
VITE_API_URL=http://localhost:3333/api

# Ou em produção:
VITE_API_URL=https://api.silkprint.com.br/api`}
            </pre>
            <p className="text-[11px] text-zinc-500">
              O cliente HTTP anexa automaticamente o cabeçalho <code className="text-zinc-400 font-mono">Authorization: Bearer [token]</code> em todas as requisições autenticadas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
