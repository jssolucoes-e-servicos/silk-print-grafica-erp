import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Phone,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  DollarSign,
  ChevronRight,
  ArrowUpDown,
  Eye,
  MessageCircle,
  Printer,
  Sparkles,
  CreditCard,
  CheckCheck,
  Send,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { STATUS_CONFIG } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

interface PedidosListScreenProps {
  orders: Order[];
  onOpenNovoPedido: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenOrderDetails: (order: Order) => void;
  onOpenWhatsAppChat?: (params: { clientName: string; clientPhone: string; initialMessage?: string; orderCode?: string }) => void;
}

type TabFilter = 'andamento' | 'entregues' | 'todos';
type SortOption = 'status' | 'data_desc' | 'data_asc' | 'entrega' | 'valor_desc' | 'valor_asc' | 'cliente';

const STATUS_WEIGHT: Record<OrderStatus, number> = {
  criando_arte: 1,
  em_aberto: 2,
  em_producao: 3,
  aguardando_retirada: 4,
  em_transporte: 5,
  aguardando_pagamento: 6,
  entregue: 7,
  cancelado: 8,
};

export const PedidosListScreen: React.FC<PedidosListScreenProps> = ({
  orders,
  onOpenNovoPedido,
  onUpdateOrderStatus,
  onOpenOrderDetails,
  onOpenWhatsAppChat,
}) => {
  const [activeTab, setActiveTab] = useState<TabFilter>('andamento');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<SortOption>('status');

  // Tab counts
  const andamentoCount = orders.filter((o) => o.status !== 'entregue' && o.status !== 'cancelado').length;
  const entreguesCount = orders.filter((o) => o.status === 'entregue').length;
  const todosCount = orders.length;

  // Filter & Search
  const filtered = orders.filter((o) => {
    // Tab filtering
    if (activeTab === 'andamento' && (o.status === 'entregue' || o.status === 'cancelado')) {
      return false;
    }
    if (activeTab === 'entregues' && o.status !== 'entregue') {
      return false;
    }

    // Text search
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.code.toLowerCase().includes(term) ||
      o.clientName.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term) ||
      (o.clientWhatsapp && o.clientWhatsapp.includes(term));

    // Specific status dropdown filter (if selected inside the tab)
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'status') {
      const weightA = STATUS_WEIGHT[a.status] || 99;
      const weightB = STATUS_WEIGHT[b.status] || 99;
      if (weightA !== weightB) return weightA - weightB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'data_desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'data_asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'entrega') {
      return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
    }
    if (sortBy === 'valor_desc') {
      return b.total - a.total;
    }
    if (sortBy === 'valor_asc') {
      return a.total - b.total;
    }
    if (sortBy === 'cliente') {
      return a.clientName.localeCompare(b.clientName);
    }
    return 0;
  });

  const totalValorFiltrado = sorted.reduce((sum, o) => sum + o.total, 0);

  return (
    <div id="screen-pedidos-lista" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Pedidos de Produção</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerenciamento completo do fluxo de arte, produção, pagamentos e entrega
          </p>
        </div>

        <button
          onClick={onOpenNovoPedido}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Pedido</span>
        </button>
      </div>

      {/* Main Tabs (Separating Entregues from Em Andamento to keep the list clean) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('andamento');
              setStatusFilter('todos');
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'andamento'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span>⚡ Em Andamento</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'andamento' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {andamentoCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('entregues');
              setStatusFilter('todos');
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'entregues'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span>🟢 Entregues & Finalizados</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'entregues' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-emerald-400'
              }`}
            >
              {entreguesCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('todos');
              setStatusFilter('todos');
            }}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <span>📋 Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'todos' ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {todosCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Total listado: <strong className="text-zinc-200">{formatCurrency(totalValorFiltrado)}</strong> ({sorted.length} pedidos)
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-hidden">
        {/* Filters and Sorting Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, cliente ou descrição..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sorting Selector (including Order by Status) */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[11px] text-zinc-400 font-semibold hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs bg-transparent text-zinc-200 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="status">⚡ Por Status / Etapa</option>
                <option value="data_desc">📅 Mais Recentes</option>
                <option value="data_asc">📅 Mais Antigos</option>
                <option value="entrega">🚚 Entrega Próxima</option>
                <option value="valor_desc">💰 Maior Valor</option>
                <option value="valor_asc">💰 Menor Valor</option>
                <option value="cliente">👤 Cliente (A - Z)</option>
              </select>
            </div>

            {/* Filter by Status dropdown if on "Todos" or "Em Andamento" */}
            {activeTab !== 'entregues' && (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1">
                <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs bg-transparent text-zinc-200 font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="criando_arte">🎨 Criando Arte</option>
                  <option value="em_aberto">🕒 Em Aberto</option>
                  <option value="em_producao">🏭 Em Produção</option>
                  <option value="aguardando_retirada">📦 Aguardando Retirada</option>
                  <option value="em_transporte">🚚 Em Transporte</option>
                  <option value="aguardando_pagamento">💳 Aguardando Pagamento</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Pedido</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Descrição do Serviço</th>
                <th className="py-3.5 px-4">Status da Produção</th>
                <th className="py-3.5 px-4">Pagamento</th>
                <th className="py-3.5 px-4">Prazo / Entrega</th>
                <th className="py-3.5 px-4 text-right">Valor Total</th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Layers className="w-8 h-8 text-zinc-600" />
                      <span>Nenhum pedido encontrado para os filtros selecionados.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status];
                  const cleanPhone = order.clientWhatsapp.replace(/\D/g, '');

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-800/50 transition-colors group cursor-pointer"
                      onClick={() => onOpenOrderDetails(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        <div className="flex items-center gap-1.5">
                          <span>{order.code}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-100 group-hover:text-blue-300 transition-colors">
                          {order.clientName}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {order.clientWhatsapp}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300 max-w-xs">
                        <div className="truncate font-normal">{order.description}</div>
                        {order.notes && (
                          <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                            Obs: {order.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-zinc-950 cursor-pointer shadow-xs ${statusConf.badgeBg}`}
                        >
                          <option value="criando_arte">🎨 Criando Arte</option>
                          <option value="em_aberto">🕒 Em Aberto</option>
                          <option value="em_producao">🏭 Em Produção</option>
                          <option value="aguardando_retirada">📦 Aguardando Retirada</option>
                          <option value="em_transporte">🚚 Em Transporte</option>
                          <option value="entregue">🟢 Entregue</option>
                          <option value="aguardando_pagamento">💳 Aguardando Pagamento</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'pago'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{formatDate(order.deliveryDate)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-100 text-sm">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenOrderDetails(order)}
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-blue-400 border border-zinc-800 transition-colors cursor-pointer"
                            title="Ver e Analisar Detalhes do Pedido"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const msg = `Olá, *${order.clientName}*! 👋 Aqui é da *Silk Print Gráfica* referente ao seu pedido *${order.code}* (${order.description}). Como podemos te ajudar?`;
                              if (onOpenWhatsAppChat) {
                                onOpenWhatsAppChat({
                                  clientName: order.clientName,
                                  clientPhone: order.clientWhatsapp,
                                  initialMessage: msg,
                                  orderCode: order.code,
                                });
                              } else {
                                window.open(
                                  `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`,
                                  '_blank'
                                );
                              }
                            }}
                            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 border border-zinc-800 transition-colors cursor-pointer"
                            title="Conversar no WhatsApp (Evolution API)"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
