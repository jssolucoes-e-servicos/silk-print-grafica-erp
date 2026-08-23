import React, { useState } from 'react';
import {
  MessageCircle,
  Database,
  HardDrive,
  Zap,
  Truck,
  FileSpreadsheet,
  Check,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { EvolutionTab } from './integracoes/EvolutionTab';
import { PostgresTab } from './integracoes/PostgresTab';
import { MinioTab } from './integracoes/MinioTab';
import { N8nTab } from './integracoes/N8nTab';

export const IntegracoesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evolution' | 'postgres' | 'minio' | 'n8n' | 'outras'>('postgres');

  // Additional mock settings for minor ERP/Logistics
  const [melhorEnvio, setMelhorEnvio] = useState(false);
  const [tinyErp, setTinyErp] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-100 flex items-center gap-2.5 tracking-tight">
            <span>Central de Integrações Reais</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Stack de Produção
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Conecte sua infraestrutura real: PostgreSQL para dados, MinIO para arquivos S3, n8n para automações e Evolution API para WhatsApp.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('postgres')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'postgres'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>PostgreSQL & Prisma ORM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('minio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'minio'
              ? 'bg-red-600/20 text-red-400 border border-red-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>MinIO (Storage S3)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('n8n')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'n8n'
              ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>n8n (Automações)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evolution')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'evolution'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Evolution API (WhatsApp)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outras')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'outras'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Logística & ERP</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'postgres' && <PostgresTab />}
      {activeTab === 'minio' && <MinioTab />}
      {activeTab === 'n8n' && <N8nTab />}
      {activeTab === 'evolution' && <EvolutionTab />}

      {activeTab === 'outras' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Melhor Envio */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Melhor Envio / Logística</h3>
                  <p className="text-xs text-zinc-400">Cotação de frete Correios, Jadlog, Loggi em tempo real</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMelhorEnvio(!melhorEnvio)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  melhorEnvio ? 'bg-purple-600 justify-end' : 'bg-zinc-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {melhorEnvio && (
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Token de Acesso (API Bearer)</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
                    className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tiny ERP */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Tiny ERP / Bling</h3>
                  <p className="text-xs text-zinc-400">Emissão de NF-e, controle fiscal e sincronização de estoque</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTinyErp(!tinyErp)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  tinyErp ? 'bg-blue-600 justify-end' : 'bg-zinc-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {tinyErp && (
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Token da API Tiny ERP</label>
                  <input
                    type="password"
                    placeholder="99a8b7c6d5e4f3a2b1..."
                    className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
