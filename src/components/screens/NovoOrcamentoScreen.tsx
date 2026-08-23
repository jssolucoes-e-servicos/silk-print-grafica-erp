import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  Send,
  Printer,
  Copy,
  Sparkles,
  User,
  Phone,
} from 'lucide-react';
import { Client, Quote, QuoteItem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface NovoOrcamentoScreenProps {
  clients: Client[];
  onBack: () => void;
  onOpenNovoClienteModal: () => void;
  onOpenAdicionarItemModal: () => void;
  items: QuoteItem[];
  onRemoveItem: (id: string) => void;
  onSaveQuote: (quote: Quote) => void;
  createdClientId?: string;
}

export const NovoOrcamentoScreen: React.FC<NovoOrcamentoScreenProps> = ({
  clients,
  onBack,
  onOpenNovoClienteModal,
  onOpenAdicionarItemModal,
  items,
  onRemoveItem,
  onSaveQuote,
  createdClientId,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    createdClientId || (clients[0]?.id ?? '')
  );
  const [clientSearch, setClientSearch] = useState('');
  const [observations, setObservations] = useState(
    'Orçamento válido por 7 dias. Pagamento 50% de entrada + 50% na retirada/entrega via PIX ou Cartão.'
  );
  const [validityDate, setValidityDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [discount, setDiscount] = useState<number>(0);
  const [savedQuoteSuccess, setSavedQuoteSuccess] = useState<Quote | null>(null);

  // Selected client object
  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  // Filter clients for dropdown
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.whatsapp.includes(clientSearch)
  );

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const total = Math.max(0, subtotal - (discount || 0));

  const handleSave = () => {
    if (!selectedClient) {
      alert('Selecione ou cadastre um cliente para o orçamento.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um item ao orçamento antes de salvar.');
      return;
    }

    const quoteNumber = `ORC-${new Date().getFullYear()}-${String(
      Math.floor(1000 + Math.random() * 9000)
    )}`;

    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      number: quoteNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      clientWhatsapp: selectedClient.whatsapp,
      items: [...items],
      observations: observations.trim(),
      validityDate,
      subtotal,
      discount: discount || 0,
      total,
      status: 'enviado',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onSaveQuote(newQuote);
    setSavedQuoteSuccess(newQuote);
  };

  return (
    <div id="screen-novo-orcamento" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* 1. Header com Botão Voltar (<-) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Novo Orçamento
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Crie um orçamento para enviar ao cliente
          </p>
        </div>
      </div>

      {/* 2. Grid de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda (Col-span 2) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card Cliente */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Cliente</span>
              </label>
              <span className="text-[11px] text-zinc-500">
                Selecione ou cadastre um novo cliente
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.whatsapp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botão + (Abre modal Novo Cliente) */}
              <button
                id="btn-add-novo-cliente"
                onClick={onOpenNovoClienteModal}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-bold shrink-0 shadow-sm"
                title="Cadastrar Novo Cliente"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {selectedClient && (
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">
                      {selectedClient.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      {selectedClient.whatsapp}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {selectedClient.ordersCount} pedidos anteriores
                </span>
              </div>
            )}
          </div>

          {/* Card Itens do Orçamento */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Itens do Orçamento
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Adicione produtos normais, internos, por m² ou personalizados
                </p>
              </div>

              {/* Botão Amarelo + Adicionar Item */}
              <button
                id="btn-adicionar-item-orcamento"
                onClick={onOpenAdicionarItemModal}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Adicionar Item</span>
              </button>
            </div>

            {/* Empty state or Table */}
            {items.length === 0 ? (
              <div className="p-8 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-zinc-950/40">
                <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-xs text-zinc-400 max-w-sm">
                  Nenhum item adicionado. Clique em &quot;Adicionar Item&quot; para começar.
                </div>
                <button
                  onClick={onOpenAdicionarItemModal}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 text-xs font-medium transition-colors"
                >
                  Abrir Catálogo de Itens
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          #{index + 1}
                        </span>
                        <h4 className="font-semibold text-zinc-100 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-1.5 rounded">
                          {item.sourceTab}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      )}

                      <div className="text-[11px] text-zinc-500 mt-1">
                        Qtd: <strong className="text-zinc-300 font-mono">{item.quantity}</strong> × {formatCurrency(item.unitPrice)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-100 font-mono text-xs">
                        {formatCurrency(item.total)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card Observações */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Observações para o cliente
              </label>
              <textarea
                rows={3}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Condições de pagamento, prazos de produção, frete..."
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Validade do orçamento
              </label>
              <div className="relative max-w-xs">
                <input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Card Resumo (Col-span 1) */}
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-md space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-zinc-100 border-b border-zinc-800 pb-3">
              Resumo do Orçamento
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <span>Itens ({items.length}):</span>
                <span className="font-mono text-zinc-200">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Desconto (R$):</span>
                <div className="w-24">
                  <input
                    type="number"
                    min={0}
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="w-full px-2 py-1 text-right text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-baseline justify-between">
                <span className="font-bold text-zinc-100 text-sm">Total:</span>
                <span className="text-xl font-black text-blue-400 font-mono">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Botão Amarelo: Salvar Orçamento */}
            <button
              id="btn-salvar-orcamento"
              onClick={handleSave}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar Orçamento</span>
            </button>

            {items.length > 0 && selectedClient && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Olá ${selectedClient.name}! Aqui está o seu orçamento da Silk Print Gráfica no valor de ${formatCurrency(total)}. Validade até ${formatDate(validityDate)}.`;
                    window.open(
                      `https://wa.me/55${selectedClient.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`,
                      '_blank'
                    );
                  }}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {savedQuoteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Orçamento Criado com Sucesso!
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                {savedQuoteSuccess.number} — Total: {formatCurrency(savedQuoteSuccess.total)}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  const text = `Olá ${savedQuoteSuccess.clientName}! Segue seu orçamento ${savedQuoteSuccess.number} da Silk Print Gráfica no valor de ${formatCurrency(savedQuoteSuccess.total)}.\n\nItens:\n${savedQuoteSuccess.items.map((i) => `• ${i.name} (${i.quantity}x) = ${formatCurrency(i.total)}`).join('\n')}\n\nValidade: ${formatDate(savedQuoteSuccess.validityDate)}`;
                  window.open(
                    `https://wa.me/55${savedQuoteSuccess.clientWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`,
                    '_blank'
                  );
                }}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar pelo WhatsApp Agora</span>
              </button>

              <button
                onClick={() => {
                  setSavedQuoteSuccess(null);
                  onBack();
                }}
                className="py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-lg transition-colors"
              >
                Ir para Lista de Orçamentos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
