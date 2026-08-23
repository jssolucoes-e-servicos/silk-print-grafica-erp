import React, { useState, useEffect } from 'react';
import {
  Zap,
  MessageCircle,
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
  Send,
  ExternalLink,
} from 'lucide-react';
import { EvolutionConfig, EvolutionConnectionState } from '../../../types';
import {
  getEvolutionConfig,
  saveEvolutionConfig,
  testEvolutionConnection,
  getEvolutionQrCode,
  restartEvolutionInstance,
  sendEvolutionTextMessage,
} from '../../../lib/evolutionApi';
import confetti from 'canvas-confetti';

export const EvolutionTab: React.FC = () => {
  const [config, setConfig] = useState<EvolutionConfig>(getEvolutionConfig());
  const [apiUrl, setApiUrl] = useState(config.apiUrl);
  const [instanceName, setInstanceName] = useState(config.instanceName);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl || 'https://smartgraph-crm.internal/api/webhook/evolution');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);

  // Connection testing state
  const [isTesting, setIsTesting] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    state: EvolutionConnectionState;
    latencyMs?: number;
    httpStatus?: number;
    data?: any;
  } | null>(null);

  // Test message dispatch state
  const [testPhone, setTestPhone] = useState('');
  const [testMsgText, setTestMsgText] = useState('🧪 Teste de comunicação real via Evolution API da Silk Print!');
  const [isSendingTestMsg, setIsSendingTestMsg] = useState(false);
  const [testMsgResult, setTestMsgResult] = useState<{ success: boolean; message: string } | null>(null);

  // QR Code state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qrcode?: string; pairingCode?: string } | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

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
    };
    saveEvolutionConfig(updated);
    setConfig(updated);
    setTestResult({
      success: true,
      message: 'Configurações da Evolution API salvas com sucesso!',
      state: config.status,
    });
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const currentConf: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };

    const res = await testEvolutionConnection(currentConf);
    setConfig(getEvolutionConfig());
    setTestResult({
      success: res.success,
      state: res.state,
      message: res.message,
      latencyMs: res.latencyMs,
      httpStatus: res.httpStatus,
      data: res.data,
    });
    setIsTesting(false);
    if (res.success) {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    }
  };

  const handleSendRealTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testMsgText.trim() || isSendingTestMsg) return;

    setIsSendingTestMsg(true);
    setTestMsgResult(null);

    const currentConf: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };

    const res = await sendEvolutionTextMessage(currentConf, testPhone, testMsgText, {
      clientName: 'Teste de Integração',
    });

    setIsSendingTestMsg(false);

    if (res.success && !res.error) {
      setTestMsgResult({
        success: true,
        message: `Mensagem enviada com sucesso para ${testPhone} via Evolution API! (ID: ${res.message.id})`,
      });
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } else {
      setTestMsgResult({
        success: false,
        message: res.error || 'Falha ao disparar mensagem pela Evolution API na VPS.',
      });
    }
  };

  const handleOpenQrCode = async () => {
    setQrModalOpen(true);
    setIsLoadingQr(true);
    setQrCodeData(null);

    const currentConf: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };

    const res = await getEvolutionQrCode(currentConf);
    setIsLoadingQr(false);

    if (res.success && (res.qrcode || res.pairingCode)) {
      setQrCodeData({ qrcode: res.qrcode, pairingCode: res.pairingCode });
    } else {
      setTestResult({
        success: false,
        message: res.message || 'Não foi possível gerar o QR Code.',
        state: 'error',
      });
    }
  };

  const handleRestart = async () => {
    if (!confirm('Deseja realmente reiniciar a instância na VPS Evolution API?')) return;
    setIsRestarting(true);

    const currentConf: EvolutionConfig = {
      ...config,
      apiUrl: apiUrl.trim(),
      instanceName: instanceName.trim(),
      apiKey: apiKey.trim(),
    };

    const res = await restartEvolutionInstance(currentConf);
    setIsRestarting(false);
    setTestResult({
      success: res.success,
      message: res.message,
      state: res.success ? 'open' : 'error',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const getStatusBadge = () => {
    switch (config.status) {
      case 'open':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Conectado (WhatsApp Ativo)
          </span>
        );
      case 'connecting':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Conectando...
          </span>
        );
      case 'qrcode':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            Aguardando QR Code
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <WifiOff className="w-3.5 h-3.5 text-zinc-500" />
            Desconectado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with VPS Overview */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-zinc-100">Evolution API (WhatsApp VPS)</h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Envio real de mensagens automáticas com PDF de orçamentos, comprovantes e status de produção via WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-zinc-700"
          >
            <Wifi className={`w-4 h-4 ${isTesting ? 'animate-pulse text-emerald-400' : 'text-zinc-400'}`} />
            <span>{isTesting ? 'Testando VPS...' : 'Testar Conexão Real'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenQrCode}
            disabled={isLoadingQr}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>{isLoadingQr ? 'Gerando...' : 'Ler QR Code'}</span>
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
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900/80 border border-zinc-700 text-zinc-300">
                  HTTP {testResult.httpStatus}
                </span>
              )}
              {testResult.latencyMs !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-900/80 border border-zinc-700 text-emerald-300">
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>
            {!testResult.success && (
              <p className="text-[11px] text-rose-300/80">
                Verifique se a URL da sua VPS está correta, a porta da Evolution API está acessível e se a instância e API Key conferem com o servidor.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Configuration Card */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">Credenciais da Evolution API na VPS</h3>
          </div>
        </div>

        <form onSubmit={handleSaveEvolutionConfig} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>URL do Servidor Evolution API</span>
                <span className="text-[11px] text-zinc-500 font-normal">HTTP / HTTPS</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://evo.meudominio.com.br ou http://ip-da-vps:8080"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nome da Instância</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  placeholder="silkprint ou silkprint_atendimento"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span>API Key / Token de Autenticação da VPS</span>
              <span className="text-[11px] text-emerald-400">Header: apikey ou Authorization</span>
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Insira a chave global ou API key da instância"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações da VPS</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              disabled={isRestarting}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-300 text-zinc-400 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-zinc-700/60"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRestarting ? 'animate-spin' : ''}`} />
              <span>Reiniciar Instância</span>
            </button>
          </div>
        </form>
      </div>

      {/* Test Real WhatsApp Message Dispatch Card */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Disparo de Mensagem Real para Teste</h3>
              <p className="text-xs text-zinc-400">
                Envie uma mensagem de teste real para o seu próprio WhatsApp para validar o recebimento no seu celular
              </p>
            </div>
          </div>
        </div>

        {testMsgResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
              testMsgResult.success
                ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-200'
                : 'bg-rose-950/40 border border-rose-800/60 text-rose-200'
            }`}
          >
            {testMsgResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold">{testMsgResult.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSendRealTestMessage} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Número de Destino (com DDD)</label>
            <input
              type="text"
              required
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Ex: 11999998888 ou 5511999998888"
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-mono"
            />
          </div>

          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Mensagem de Teste</label>
            <input
              type="text"
              required
              value={testMsgText}
              onChange={(e) => setTestMsgText(e.target.value)}
              placeholder="Digite a mensagem de teste..."
              className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSendingTestMsg || !testPhone.trim()}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className={`w-3.5 h-3.5 ${isSendingTestMsg ? 'animate-pulse' : ''}`} />
              <span>{isSendingTestMsg ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-zinc-100 text-sm">Leitura de QR Code WhatsApp</h3>
              </div>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-zinc-800 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800/80">
              {isLoadingQr ? (
                <div className="flex flex-col items-center gap-3 text-zinc-400 text-xs py-8">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Conectando à VPS e gerando QR Code...</span>
                </div>
              ) : qrCodeData?.qrcode ? (
                <div className="space-y-4 flex flex-col items-center">
                  <img
                    src={qrCodeData.qrcode}
                    alt="WhatsApp QR Code"
                    className="w-56 h-56 rounded-xl bg-white p-2 shadow-lg"
                  />
                  <p className="text-xs text-zinc-400 text-center max-w-xs">
                    Abra o WhatsApp no celular &gt; <strong>Aparelhos Conectados</strong> &gt; <strong>Conectar um aparelho</strong> e aponte a câmera.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-zinc-200">Instância já autenticada na VPS!</p>
                  <p className="text-[11px] text-zinc-400">O WhatsApp já está conectado e pronto para enviar mensagens.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 cursor-pointer"
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
