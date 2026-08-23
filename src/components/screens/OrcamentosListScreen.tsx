import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Quote, Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface OrcamentosListScreenProps {
  quotes: Quote[];
  onNavigateToNovoOrcamento: () => void;
  onConvertToOrder: (quote: Quote) => void;
  onOpenWhatsAppChat?: (params: { clientName: string; clientPhone: string; initialMessage?: string; quoteNumber?: string }) => void;
}

export const OrcamentosListScreen: React.FC<OrcamentosListScreenProps> = ({
  quotes,
  onNavigateToNovoOrcamento,
  onConvertToOrder,
  onOpenWhatsAppChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = quotes.filter((q) => {
    const term = searchTerm.toLowerCase();
    return (
      q.number.toLowerCase().includes(term) ||
      q.clientName.toLowerCase().includes(term) ||
      q.clientWhatsapp.includes(term)
    );
  });

  return (
    <div id="screen-orcamentos-lista" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Orçamentos
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie e envie propostas para clientes ({quotes.length} orçamentos)
          </p>
        </div>

        <button
          onClick={onNavigateToNovoOrcamento}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número ou cliente..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Número</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Validade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    Nenhum orçamento encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      {quote.number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{quote.clientName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{quote.clientWhatsapp}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {quote.items.length} {quote.items.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {formatDate(quote.validityDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-100">
                      {formatCurrency(quote.total)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          const text = `Olá, *${quote.clientName}*! 📋 Segue seu orçamento *${quote.number}* da *Silk Print Gráfica* no valor de *${formatCurrency(quote.total)}* (Validade: ${formatDate(quote.validityDate)}).\n\nQualquer dúvida estamos à disposição!`;
                          if (onOpenWhatsAppChat) {
                            onOpenWhatsAppChat({
                              clientName: quote.clientName,
                              clientPhone: quote.clientWhatsapp,
                              initialMessage: text,
                              quoteNumber: quote.number,
                            });
                          } else {
                            window.open(
                              `https://wa.me/55${quote.clientWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`,
                              '_blank'
                            );
                          }
                        }}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Abrir Conversa WhatsApp (Evolution API)"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onConvertToOrder(quote)}
                        className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-white font-semibold text-[11px] rounded transition-colors"
                        title="Converter em Pedido de Produção"
                      >
                        + Pedido
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
