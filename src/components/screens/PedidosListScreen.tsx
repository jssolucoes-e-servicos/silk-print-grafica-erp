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
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { STATUS_CONFIG } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

interface PedidosListScreenProps {
  orders: Order[];
  onOpenNovoPedido: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const PedidosListScreen: React.FC<PedidosListScreenProps> = ({
  orders,
  onOpenNovoPedido,
  onUpdateOrderStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.code.toLowerCase().includes(term) ||
      o.clientName.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="screen-pedidos-lista" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Pedidos de Produção
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Acompanhamento detalhado de todos os pedidos em produção ({orders.length} pedidos)
          </p>
        </div>

        <button
          onClick={onOpenNovoPedido}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Novo Pedido</span>
        </button>
      </div>

      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, cliente ou descrição..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="criando_arte">🎨 Criando Arte</option>
              <option value="em_aberto">🕒 Em Aberto</option>
              <option value="em_producao">🏭 Em Produção</option>
              <option value="aguardando_retirada">📦 Aguardando Retirada</option>
              <option value="em_transporte">🚚 Em Transporte</option>
              <option value="entregue">🟢 Entregue</option>
              <option value="aguardando_pagamento">💳 Aguardando Pagamento</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Pedido</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Entrega</th>
                <th className="py-3 px-4 text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">
                        {order.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-100">{order.clientName}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{order.clientWhatsapp}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-xs truncate">
                        {order.description}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded-md border bg-zinc-950 cursor-pointer ${statusConf.badgeBg}`}
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
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                            order.paymentStatus === 'pago'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">
                        {formatDate(order.deliveryDate)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-100">
                        {formatCurrency(order.total)}
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
