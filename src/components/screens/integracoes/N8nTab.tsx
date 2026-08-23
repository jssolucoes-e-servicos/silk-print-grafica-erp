import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Server,
  Key,
  Save,
  Activity,
  Send,
  Sliders,
  Sparkles,
  Link,
  Code,
} from 'lucide-react';
import { N8nConfig, N8nEventLog } from '../../../types';
import {
  fetchN8nConfig,
  saveStoredN8nConfig,
  testN8nConnection,
  fetchN8nLogs,
  triggerN8nEvent,
} from '../../../lib/n8nApi';
import confetti from 'canvas-confetti';

export const N8nTab: React.FC = () => {
  const [config, setConfig] = useState<N8nConfig>({
    baseUrl: '',
    apiKey: '',
    webhookOrderCreated: '',
    webhookStatusChanged: '',
    webhookQuoteCreated: '',
    webhookFinancialAlert: '',
    status: 'disconnected',
    enabledTriggers: {
      orderCreated: true,
      statusChanged: true,
      quoteCreated: true,
      financialAlert: true,
    },
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testWebhookUrl, setTestWebhookUrl] = useState('');
  const [logs, setLogs] = useState<N8nEventLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Manual Trigger Test
  const [selectedEventType, setSelectedEventType] = useState<'order.created' | 'order.status_changed' | 'quote.created' | 'financial.alert'>('order.created');
  const [customPayload, setCustomPayload] = useState('{\n  "clientName": "Cliente Teste n8n",\n  "whatsapp": "5511999998888",\n  "orderCode": "PED-7788",\n  "total": 450.00\n}');
  const [isTriggering, setIsTriggering] = useState(false);

  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
    httpStatus?: number;
  } | null>(null);

  const [triggerResult, setTriggerResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchN8nConfig().then((data) => {
      setConfig(data);
      if (data.webhookOrderCreated) {
        setTestWebhookUrl(data.webhookOrderCreated);
      }
    });
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    const data = await fetchN8nLogs();
    setLogs(data);
    setIsLoadingLogs(false);
  };

  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredN8nConfig(config);
    try {
      await fetch('/api/n8n/config', {
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
    const res = await testN8nConnection(config, testWebhookUrl);
    setTestResult(res);
    setIsTesting(false);
    if (res.success) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      loadLogs();
    }
  };

  const handleManualTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriggering(true);
    setTriggerResult(null);

    let parsedPayload: any = {};
    try {
      parsedPayload = JSON.parse(customPayload);
    } catch {
      parsedPayload = { raw: customPayload };
    }

    const res = await triggerN8nEvent(selectedEventType, parsedPayload);
    setTriggerResult(res);
    setIsTriggering(false);

    if (res.success) {
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.7 } });
      loadLogs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-amber-950/40 via-zinc-900 to-orange-950/40 border border-amber-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-zinc-100">n8n - Automações & Webhooks Externos</h2>
              <span
                className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                  config.status === 'connected'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {config.status === 'connected' ? '● Ativo' : '○ Desconectado'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Dispare fluxos automatizados no n8n a cada novo pedido, mudança de status de produção ou alerta financeiro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <RotateCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testando n8n...' : 'Testar Webhook n8n'}</span>
          </button>
        </div>
      </div>

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
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">{testResult.message}</span>
              {testResult.httpStatus && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  HTTP {testResult.httpStatus}
                </span>
              )}
              {testResult.latencyMs !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900 border border-zinc-700 text-emerald-300">
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* n8n Webhooks Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Link className="w-4 h-4 text-amber-400" />
              <span>Endpoints de Webhook do n8n</span>
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">URL Base do n8n ou Webhook de Teste</label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://n8n.meuservidor.com.br/webhook/..."
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Webhook: Novo Pedido Criado (order.created)</label>
                <input
                  type="text"
                  value={config.webhookOrderCreated || ''}
                  onChange={(e) => setConfig({ ...config, webhookOrderCreated: e.target.value })}
                  placeholder="https://n8n.meuservidor.com.br/webhook/novo-pedido"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Webhook: Status do Pedido Alterado (order.status_changed)</label>
                <input
                  type="text"
                  value={config.webhookStatusChanged || ''}
                  onChange={(e) => setConfig({ ...config, webhookStatusChanged: e.target.value })}
                  placeholder="https://n8n.meuservidor.com.br/webhook/status-pedido"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Webhook: Novo Orçamento (quote.created)</label>
                <input
                  type="text"
                  value={config.webhookQuoteCreated || ''}
                  onChange={(e) => setConfig({ ...config, webhookQuoteCreated: e.target.value })}
                  placeholder="https://n8n.meuservidor.com.br/webhook/novo-orcamento"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Webhooks</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Event Trigger Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Simulador de Disparo de Evento em Tempo Real</span>
            </h3>

            <form onSubmit={handleManualTrigger} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Tipo de Evento</label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden"
                >
                  <option value="order.created">order.created (Novo Pedido)</option>
                  <option value="order.status_changed">order.status_changed (Mudança de Status)</option>
                  <option value="quote.created">quote.created (Novo Orçamento)</option>
                  <option value="financial.alert">financial.alert (Alerta Financeiro)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Payload JSON do Evento</label>
                <textarea
                  rows={4}
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="w-full p-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-mono focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isTriggering}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isTriggering ? 'animate-pulse' : ''}`} />
                <span>{isTriggering ? 'Disparando...' : 'Disparar Evento para o n8n'}</span>
              </button>
            </form>

            {triggerResult && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  triggerResult.success
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold">{triggerResult.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs History */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-zinc-100">Histórico de Disparos de Webhook n8n ({logs.length})</h3>
          </div>
          <button
            type="button"
            onClick={loadLogs}
            disabled={isLoadingLogs}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Atualizar Logs</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-500">
            Nenhum evento registrado ainda. Dispare um teste acima para verificar a integração.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
            {logs.map((log) => (
              <div key={log.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span className="font-mono font-bold text-zinc-200">{log.eventType}</span>
                  <span className="text-zinc-500 truncate max-w-xs">{log.targetUrl}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {log.httpStatus && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      HTTP {log.httpStatus}
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-500 font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
