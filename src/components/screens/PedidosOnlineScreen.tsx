import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  RefreshCw,
  Download,
  Package,
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface PedidosOnlineScreenProps {
  orders: Order[];
  onRefresh?: () => void;
}

export const PedidosOnlineScreen: React.FC<PedidosOnlineScreenProps> = ({
  orders,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState('Todos os status');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Online orders can be filtered or simulated
  const onlineOrders = orders.filter((o) => (o as any).isOnlineOrder);

  const totalCount = onlineOrders.length;
  const pendentesCount = onlineOrders.filter((o) => o.status === 'aguardando_aprovacao').length;
  const aprovadosCount = onlineOrders.filter(
    (o) => o.status === 'em_producao' || o.status === 'pronto' || o.status === 'entregue'
  ).length;
  const rejeitadosCount = onlineOrders.filter((o) => o.status === 'cancelado').length;
  const totalReceita = onlineOrders
    .filter((o) => o.paymentStatus === 'pago')
    .reduce((sum, o) => sum + o.total, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onRefresh?.();
    }, 600);
  };

  const handleExportCSV = () => {
    alert('Exportando relatório CSV de pedidos online...');
  };

  return (
    <div id="screen-pedidos-online" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Pedidos Online
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie os pedidos pagos pelo catálogo
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Atualizar</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
            <span>Total</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{totalCount}</div>
        </div>

        {/* Pendentes */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Pendentes</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{pendentesCount}</div>
        </div>

        {/* Aprovados */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aprovados</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{aprovadosCount}</div>
        </div>

        {/* Rejeitados */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Rejeitados</span>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{rejeitadosCount}</div>
        </div>

        {/* Receita */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Receita</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono truncate">
            {formatCurrency(totalReceita)}
          </div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden"
        >
          <option value="Todos os status">Todos os status</option>
          <option value="Aguardando Aprovação">Aguardando Aprovação</option>
          <option value="Em Produção">Em Produção</option>
          <option value="Pronto">Pronto</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Empty State or Table */}
      {onlineOrders.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/80 p-16 text-center flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Package className="w-12 h-12 text-zinc-600 stroke-[1.2]" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-zinc-200">Nenhum pedido encontrado</h3>
            <p className="text-xs text-zinc-500">Os pedidos pagos online aparecerão aqui</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Pedido</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {onlineOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      #{ord.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-100">{ord.clientName}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {ord.createdAt ? formatDate(ord.createdAt) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-100">
                      {formatCurrency(ord.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
