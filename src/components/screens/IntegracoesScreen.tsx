import React, { useState, useEffect } from 'react';
import {
  Zap,
  MessageCircle,
  Truck,
  FileSpreadsheet,
  Check,
  ExternalLink,
  Shield,
  RefreshCw,
  QrCode,
  Key,
  Globe,
  Server,
  AlertCircle,
  CheckCircle2,
  Copy,
  Terminal,
  HelpCircle,
  Wifi,
  WifiOff,
  Power,
  RotateCcw,
  Smartphone,
  Layers,
  Save,
  Info,
} from 'lucide-react';
import { EvolutionConfig, EvolutionConnectionState } from '../../types';
import {
  getEvolutionConfig,
  saveEvolutionConfig,
  testEvolutionConnection,
  getEvolutionQrCode,
  restartEvolutionInstance,
} from '../../lib/evolutionApi';
import confetti from 'canvas-confetti';

export const IntegracoesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evolution' | 'logistica' | 'erp' | 'webhooks'>('evolution');

  // Evolution API state
  const [config, setConfig] = useState<EvolutionConfig>(getEvolutionConfig());
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [instanceName, setInstanceName] = useState(config.instanceName);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl || 'https://smartgraph-crm.internal/api/webhook/evolution');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; state: EvolutionConnectionState } | null>(null);

  // QR Code state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qrcode?: string; pairingCode?: string } | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState(false);

  // Other integrations toggle
  const [melhorEnvio, setMelhorEnvio] = useState(false);
  const [tinyErp, setTinyErp] = useState(false);

  useEffect(() => {
    const saved = getEvolutionConfig();
    setConfig(saved);
    setApiUrl(saved.apiUrl);
    setInstanceName(saved.instanceName);
    setApiKey(saved.apiKey);
    if (saved.webhookUrl) setWebhookUrl(saved.webhookUrl);
    setAutoSync(saved.autoSync ?? true);
  }, []);

  const handleSaveEvolutionConfig = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
      webhookUrl: webhookUrl.trim(),
      autoSync,
      lastChecked: new Date().toISOString(),
    };
    saveEvolutionConfig(updated);
    setConfig(updated);
    setTestResult({
      success: true,
      state: updated.status,
      message: 'Configurações da Evolution API salvas com sucesso no sistema!',
    });
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempConfig: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };

    const res = await testEvolutionConnection(tempConfig);

    const updatedConfig: EvolutionConfig = {
      ...tempConfig,
      status: res.state,
      lastChecked: new Date().toISOString(),
    };

    saveEvolutionConfig(updatedConfig);
    setConfig(updatedConfig);
    setTestResult({
      success: res.success,
      state: res.state,
      message: res.message,
    });
    setIsTesting(false);
  };

  const handleOpenQrCode = async () => {
    setQrModalOpen(true);
    setIsLoadingQr(true);
    const tempConfig: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };
    const res = await getEvolutionQrCode(tempConfig);
    setQrCodeData({
      qrcode: res.qrcode,
      pairingCode: res.pairingCode,
    });
    setIsLoadingQr(false);
  };

  const handleRestartInstance = async () => {
    if (!confirm(`Deseja reiniciar a instância "${instanceName}" na sua VPS Evolution?`)) return;
    setIsRestarting(true);
    const tempConfig: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };
    const res = await restartEvolutionInstance(tempConfig);
    setIsRestarting(false);
    setTestResult({
      success: true,
      state: 'connecting',
      message: res.message,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="screen-integracoes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <span>Integrações & API WhatsApp</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              VPS Evolution v2
            </span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Conecte sua instância da Evolution API para envio e recebimento de mensagens e histórico nos clientes e pedidos
          </p>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              config.status === 'open'
                ? 'bg-emerald-400 animate-pulse'
                : config.status === 'connecting'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-400'
            }`}
          />
          <span className="text-zinc-300 font-medium">Status da VPS:</span>
          <span
            className={`font-bold uppercase text-[11px] ${
              config.status === 'open'
                ? 'text-emerald-400'
                : config.status === 'connecting'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {config.status === 'open' ? 'Conectado' : config.status === 'connecting' ? 'Conectando' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('evolution')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'evolution'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp (Evolution API)</span>
        </button>

        <button
          onClick={() => setActiveTab('logistica')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'logistica'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Melhor Envio / Logística</span>
        </button>

        <button
          onClick={() => setActiveTab('erp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'erp'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Tiny ERP & Bling (NF-e)</span>
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'webhooks'
              ? 'bg-zinc-800 text-zinc-100 shadow-xs border border-zinc-700'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Webhooks & Eventos</span>
        </button>
      </div>

      {/* TAB 1: EVOLUTION API */}
      {activeTab === 'evolution' && (
        <div className="space-y-6">
          {/* Main Config Card */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-lg">
            <div className="p-5 border-b border-zinc-800/80 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Credenciais da VPS Evolution API</h3>
                  <p className="text-xs text-zinc-400">
                    Insira o endpoint HTTP/HTTPS da sua VPS, nome da instância e a chave de autenticação
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{isTesting ? 'Validando...' : 'Testar Conexão'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenQrCode}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Gerar QR Code</span>
                </button>
              </div>
            </div>

            {/* Test result alert */}
            {testResult && (
              <div
                className={`p-4 border-b text-xs flex items-start gap-3 ${
                  testResult.success
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className="font-bold">{testResult.message}</span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSaveEvolutionConfig} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evolution URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>URL da API Evolution (VPS) *</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://evo.suaempresa.com.br"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Endereço onde a Evolution API está rodando (porta 8080 ou domínio SSL com HTTPS).
                  </p>
                </div>

                {/* Instance Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nome da Instância (Instance Name) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    placeholder="silkprint ou grafica-principal"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Identificador único da instância criada no Evolution Manager.
                  </p>
                </div>
              </div>

              {/* API Token */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Token de Autenticação / Global API Key *</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="B6D711FCDE4D4FD5936544120E713976"
                    className="w-full px-3.5 py-2.5 pr-20 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(apiKey)}
                    className="absolute right-2 top-2 px-2.5 py-1 text-[10px] font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Chave definida na variável de ambiente <code className="text-zinc-300 font-mono">AUTHENTICATION_API_KEY</code> da sua VPS.
                </p>
              </div>

              {/* Webhook URL & Auto Sync */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    URL de Webhook para Mensagens Recebidas
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://sua-empresa.com/api/webhook/evolution"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 self-end">
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Sincronizar Histórico de Mensagens</span>
                    <span className="text-[10px] text-zinc-400">Salva e sincroniza conversas nos clientes e pedidos</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRestartInstance}
                    disabled={isRestarting}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
                    <span>Reiniciar Instância</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações da Evolution API</span>
                </button>
              </div>
            </form>
          </div>

          {/* Detailed Instructions and Diagnostics Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Guide 1: How to validate and reconnect */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Instruções: Como Validar Conexão e Reconectar</span>
              </div>

              <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>1. Validar se a Instância está Conectada</span>
                  </div>
                  <p className="text-zinc-400">
                    Clique no botão <strong className="text-zinc-200">"Testar Conexão"</strong> acima. O sistema faz uma requisição HTTP para <code className="text-zinc-200 font-mono">/instance/connectionState/{'{instanceName}'}</code> com o cabeçalho <code className="text-zinc-200 font-mono">apikey</code>. Quando o retorno for <code className="text-emerald-400 font-mono">state: "open"</code>, a instância está pronta para enviar e receber.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>2. Reconectar se o WhatsApp Desconectar</span>
                  </div>
                  <p className="text-zinc-400">
                    Caso mude de celular ou a sessão expire, clique em <strong className="text-zinc-200">"Gerar QR Code"</strong>. Abra o WhatsApp no celular &gt; <em>Aparelhos Conectados &gt; Conectar Aparelho</em> e escaneie o código diretamente na tela do sistema.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5">
                    <span>3. Conversa Interativa nos Clientes e Pedidos</span>
                  </div>
                  <p className="text-zinc-400">
                    Ao clicar no ícone do WhatsApp na lista de Clientes, Orçamentos ou Pedidos, uma janela de chat em tempo real se abrirá. Você poderá enviar atualizações de status, chave PIX, PDFs e orçamentos automaticamente com 1 clique!
                  </p>
                </div>
              </div>
            </div>

            {/* Guide 2: Webhooks & VPS Nginx Proxy */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center gap-2.5 text-zinc-100 font-bold text-sm">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Configuração de Webhooks na VPS</span>
              </div>

              <p className="text-xs text-zinc-400">
                Para receber mensagens dos clientes instantaneamente no CRM, configure os seguintes eventos de webhook no seu <code className="text-zinc-200 font-mono">.env</code> ou painel da Evolution:
              </p>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-2 overflow-x-auto">
                <div className="text-zinc-500"># Eventos essenciais da Evolution API</div>
                <div><span className="text-blue-400">WEBHOOK_EVENTS</span>=<span className="text-emerald-400">"MESSAGES_UPSERT,MESSAGES_UPDATE,CONNECTION_UPDATE"</span></div>
                <div><span className="text-blue-400">WEBHOOK_URL</span>=<span className="text-emerald-400">"{webhookUrl}"</span></div>
                <div><span className="text-blue-400">WEBHOOK_BY_EVENTS</span>=<span className="text-purple-400">true</span></div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Dica de Segurança:</strong> Nunca exponha a sua chave <code className="text-zinc-300 font-mono">AUTHENTICATION_API_KEY</code> em repositórios públicos. O SmartGraph armazena as chaves no armazenamento criptografado local do seu navegador.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MELHOR ENVIO */}
      {activeTab === 'logistica' && (
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Melhor Envio & Frenet (Cálculo de Frete)</h3>
                <p className="text-xs text-zinc-400">
                  Cotação automática e geração de etiquetas para Correios (Sedex, PAC), Jadlog e Loggi
                </p>
              </div>
            </div>
            <button
              onClick={() => setMelhorEnvio(!melhorEnvio)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                melhorEnvio
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {melhorEnvio ? 'Ativo' : 'Ativar Integração'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Token da API Melhor Envio</label>
              <input
                type="password"
                placeholder="Insira seu Bearer Token do Melhor Envio"
                defaultValue="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">CEP de Origem (Silk Print)</label>
              <input
                type="text"
                defaultValue="01310-100"
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ERP & BLING */}
      {activeTab === 'erp' && (
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Tiny ERP & Bling (Emissão de NF-e)</h3>
                <p className="text-xs text-zinc-400">
                  Emissão automática de Nota Fiscal Eletrônica e sincronização de insumos
                </p>
              </div>
            </div>
            <button
              onClick={() => setTinyErp(!tinyErp)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                tinyErp
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
            >
              {tinyErp ? 'Ativo' : 'Conectar API'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">API Key Tiny ERP / Bling</label>
              <input
                type="password"
                placeholder="Insira a chave de API gerada no ERP"
                defaultValue="tiny_api_key_production_9981240"
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Regime Tributário / Série NF-e</label>
              <input
                type="text"
                defaultValue="Simples Nacional - Série 1"
                className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WEBHOOKS */}
      {activeTab === 'webhooks' && (
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Disparo de Webhooks do Sistema</h3>
              <p className="text-xs text-zinc-400">
                Notifique endpoints externos quando pedidos mudarem de status ou pagamentos forem confirmados
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-200">order.created</div>
                <div className="text-[11px] text-zinc-500">Disparado quando um novo pedido de produção é gerado</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-200">order.status_updated</div>
                <div className="text-[11px] text-zinc-500">Disparado nas transições do Kanban (Arte, Produção, Retirada)</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-200">payment.received</div>
                <div className="text-[11px] text-zinc-500">Disparado quando o pagamento PIX ou cartão é conciliado</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ativo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-zinc-100">QR Code de Conexão WhatsApp</h3>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-4 py-2">
              <p className="text-xs text-zinc-400">
                Abra o WhatsApp no seu smartphone, vá em <strong className="text-zinc-200">Aparelhos Conectados</strong> e aponte a câmera para parear a instância <strong className="text-emerald-400 font-mono">{instanceName}</strong>:
              </p>

              <div className="flex justify-center p-4 bg-white rounded-2xl max-w-[220px] mx-auto shadow-inner">
                {isLoadingQr ? (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-zinc-800">
                    <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                  </div>
                ) : qrCodeData?.qrcode ? (
                  qrCodeData.qrcode.startsWith('data:') ? (
                    <img src={qrCodeData.qrcode} alt="QR Code" className="w-[180px] h-[180px] object-contain" />
                  ) : (
                    <div className="w-[180px] h-[180px] flex items-center justify-center font-mono text-zinc-800 font-bold">
                      {qrCodeData.qrcode}
                    </div>
                  )
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-zinc-500 text-xs">
                    QR Code não disponível
                  </div>
                )}
              </div>

              {qrCodeData?.pairingCode && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                  <span>Código de Pareamento Numérico: </span>
                  <strong className="text-emerald-400 font-mono text-sm ml-1">{qrCodeData.pairingCode}</strong>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
              <button
                type="button"
                onClick={handleOpenQrCode}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setQrModalOpen(false);
                  handleTestConnection();
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
