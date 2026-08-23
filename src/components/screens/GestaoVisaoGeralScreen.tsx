import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  FileSpreadsheet,
  Layers,
  Truck,
  DollarSign,
  Plus,
  ChevronDown,
  Search,
  Settings2,
  ArrowRight,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  FileText,
} from 'lucide-react';
import { Order, OrderStatus, Client, Quote } from '../../types';
import { STATUS_CONFIG } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

interface GestaoVisaoGeralScreenProps {
  orders: Order[];
  clients: Client[];
  quotes: Quote[];
  onOpenNovaReceita: () => void;
  onNavigateToNovoOrcamento: () => void;
  onOpenNovoPedido: () => void;
  onNavigateToClientes: () => void;
  onNavigateToOrcamentos: () => void;
  onNavigateToPedidos: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenOrderDetails?: (order: Order) => void;
}

export const GestaoVisaoGeralScreen: React.FC<GestaoVisaoGeralScreenProps> = ({
  orders,
  clients,
  quotes,
  onOpenNovaReceita,
  onNavigateToNovoOrcamento,
  onOpenNovoPedido,
  onNavigateToClientes,
  onNavigateToOrcamentos,
  onNavigateToPedidos,
  onUpdateOrderStatus,
  onOpenOrderDetails,
}) => {
  const [isNovoDropdownOpen, setIsNovoDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNovoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalClients = clients.length;
  const totalQuotes = quotes.length;
  const totalOrders = orders.length;
  const totalDelivered = orders.filter((o) => o.status === 'entregue').length;

  // Filter orders by search
  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.clientName.toLowerCase().includes(term) ||
      o.code.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term) ||
      o.clientWhatsapp.includes(term)
    );
  });

  const kanbanStatuses: OrderStatus[] = [
    'criando_arte',
    'em_aberto',
    'em_producao',
    'aguardando_retirada',
    'em_transporte',
    'entregue',
    'aguardando_pagamento',
  ];

  // Helper to move status forward
  const moveNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const idx = kanbanStatuses.indexOf(currentStatus);
    if (idx !== -1 && idx < kanbanStatuses.length - 1) {
      return kanbanStatuses[idx + 1];
    }
    return null;
  };

  // Helper to move status back
  const movePrevStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const idx = kanbanStatuses.indexOf(currentStatus);
    if (idx > 0) {
      return kanbanStatuses[idx - 1];
    }
    return null;
  };

  return (
    <div id="screen-gestao-visao-geral" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Gestão
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Action buttons on top right */}
        <div className="flex items-center gap-2.5">
          {/* Botão Venda Rápida */}
          <button
            id="btn-venda-rapida"
            onClick={onOpenNovaReceita}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-400" />
            <span>+$ Venda Rápida</span>
          </button>

          {/* Dropdown Button Amarelo: + Novo ⌄ */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="btn-dropdown-novo"
              onClick={() => setIsNovoDropdownOpen(!isNovoDropdownOpen)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isNovoDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isNovoDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                <button
                  id="opt-novo-orcamento"
                  onClick={() => {
                    setIsNovoDropdownOpen(false);
                    onNavigateToNovoOrcamento();
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-blue-400 transition-colors flex items-center gap-2.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                  <span>Novo Orçamento</span>
                </button>

                <button
                  id="opt-novo-pedido"
                  onClick={() => {
                    setIsNovoDropdownOpen(false);
                    onOpenNovoPedido();
                  }}
                  className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-blue-400 transition-colors flex items-center gap-2.5 border-t border-zinc-800/80"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Novo Pedido</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cards Superiores de Resumo (4 colunas) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Clientes */}
        <div
          onClick={onNavigateToClientes}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Clientes
            </span>
            <div className="text-2xl md:text-3xl font-black text-zinc-100 font-mono mt-1">
              {totalClients}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Orçamentos */}
        <div
          onClick={onNavigateToOrcamentos}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Orçamentos
            </span>
            <div className="text-2xl md:text-3xl font-black text-zinc-100 font-mono mt-1">
              {totalQuotes}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        {/* Pedidos */}
        <div
          onClick={onNavigateToPedidos}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Pedidos
            </span>
            <div className="text-2xl md:text-3xl font-black text-zinc-100 font-mono mt-1">
              {totalOrders}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Entregues */}
        <div
          onClick={onNavigateToPedidos}
          className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Entregues
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono mt-1">
              {totalDelivered}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 transition-colors">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Painel de Pedidos (Quadro Kanban com 7 status) */}
      <div className="rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
        {/* Barra superior do Painel */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-zinc-100 tracking-tight">
              Quadro de Pedidos em Andamento
            </h2>
            <button
              onClick={() => alert('Gerenciamento de status e etapas customizadas.')}
              className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Gerenciar status</span>
            </button>
          </div>

          {/* Search bar & Ver todos */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, e-mail ou CPF"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={onNavigateToPedidos}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 whitespace-nowrap transition-colors"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7 Kanban Columns Container (Horizontal Scrollable) */}
        <div className="p-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-3.5 min-w-[1450px]">
            {kanbanStatuses.map((statusKey) => {
              const config = STATUS_CONFIG[statusKey];
              const columnOrders = filteredOrders.filter(
                (o) => o.status === statusKey
              );

              return (
                <div
                  key={statusKey}
                  className="w-[200px] sm:w-[210px] shrink-0 bg-zinc-950/60 rounded-xl border border-zinc-800/80 flex flex-col max-h-[640px]"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-zinc-800/70 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm">{config.icon}</span>
                      <span className={`text-xs font-bold truncate ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-mono border ${config.badgeBg}`}
                    >
                      {columnOrders.length}
                    </span>
                  </div>

                  {/* Column Cards Body */}
                  <div className="p-2 flex-1 overflow-y-auto space-y-2.5 custom-scrollbar min-h-[160px]">
                    {columnOrders.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-center p-3 border border-dashed border-zinc-800/60 rounded-lg text-zinc-600 text-xs">
                        <span>Nenhum pedido</span>
                      </div>
                    ) : (
                      columnOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-all shadow-xs flex flex-col justify-between group cursor-pointer"
                          onClick={() => {
                            if (onOpenOrderDetails) {
                              onOpenOrderDetails(order);
                            } else {
                              setSelectedOrderDetails(order);
                            }
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-mono font-bold text-blue-400">
                                {order.code}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                                  order.paymentStatus === 'pago'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : order.paymentStatus === 'parcial'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-orange-500/20 text-orange-400'
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-zinc-100 truncate">
                              {order.clientName}
                            </h4>

                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                              {order.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-200 font-mono">
                              {formatCurrency(order.total)}
                            </span>

                            {/* Quick status transition arrows */}
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {movePrevStatus(order.status) && (
                                <button
                                  onClick={() =>
                                    onUpdateOrderStatus(
                                      order.id,
                                      movePrevStatus(order.status)!
                                    )
                                  }
                                  title="Mover para status anterior"
                                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}

                              {moveNextStatus(order.status) && (
                                <button
                                  onClick={() =>
                                    onUpdateOrderStatus(
                                      order.id,
                                      moveNextStatus(order.status)!
                                    )
                                  }
                                  title="Avançar status"
                                  className="p-1 rounded bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-400"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">
                  {selectedOrderDetails.code}
                </span>
                <h3 className="text-base font-bold text-zinc-100">
                  {selectedOrderDetails.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <p>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href={`https://wa.me/55${selectedOrderDetails.clientWhatsapp.replace(
                    /\D/g,
                    ''
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <Phone className="w-3 h-3" /> {selectedOrderDetails.clientWhatsapp}
                </a>
              </p>
              <p>
                <strong>Descrição:</strong> {selectedOrderDetails.description}
              </p>
              <p>
                <strong>Total:</strong>{' '}
                <span className="text-blue-400 font-mono font-bold">
                  {formatCurrency(selectedOrderDetails.total)}
                </span>
              </p>
              <p>
                <strong>Previsão de Entrega:</strong>{' '}
                {formatDate(selectedOrderDetails.deliveryDate)}
              </p>
              {selectedOrderDetails.notes && (
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-[11px] text-zinc-400">
                  <strong>Observações:</strong> {selectedOrderDetails.notes}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Alterar Status do Pedido:
                </label>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    onUpdateOrderStatus(selectedOrderDetails.id, newStatus);
                    setSelectedOrderDetails({
                      ...selectedOrderDetails,
                      status: newStatus,
                    });
                  }}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                >
                  {kanbanStatuses.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg"
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
