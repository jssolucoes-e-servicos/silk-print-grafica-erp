import React, { useState } from 'react';
import {
  Zap,
  MessageCircle,
  Truck,
  FileSpreadsheet,
  Check,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const IntegracoesScreen: React.FC = () => {
  const [whatsappApi, setWhatsappApi] = useState(true);
  const [melhorEnvio, setMelhorEnvio] = useState(false);
  const [tinyErp, setTinyErp] = useState(false);

  return (
    <div id="screen-integracoes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
          Integrações & Webhooks
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
          Conecte ferramentas de logística, ERP e notificações automáticas no WhatsApp
        </p>
      </div>

      <div className="space-y-4">
        {/* WhatsApp Notification API */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">WhatsApp Evolution API</h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Conectado
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Envio automático de status do pedido e aprovação de layout
              </p>
            </div>
          </div>
          <button
            onClick={() => setWhatsappApi(!whatsappApi)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Configurar
          </button>
        </div>

        {/* Melhor Envio */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">Melhor Envio / Frenet</h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  Pronto para ativar
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cálculo de frete em tempo real (Correios, Jadlog, Loggi) no carrinho
              </p>
            </div>
          </div>
          <button
            onClick={() => setMelhorEnvio(!melhorEnvio)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
              melhorEnvio
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {melhorEnvio ? 'Ativo' : 'Ativar Integração'}
          </button>
        </div>

        {/* Tiny ERP / Bling */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">Tiny ERP / Bling</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Emissão automática de Nota Fiscal (NF-e) e controle de estoque centralizado
              </p>
            </div>
          </div>
          <button
            onClick={() => setTinyErp(!tinyErp)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors ${
              tinyErp
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {tinyErp ? 'Ativo' : 'Conectar API'}
          </button>
        </div>
      </div>
    </div>
  );
};
