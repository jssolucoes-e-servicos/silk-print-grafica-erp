import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Wallet,
  Search,
  Plus,
  FileText,
  DollarSign,
  Calendar,
  Filter,
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface FinanceiroScreenProps {
  transactions: Transaction[];
  onOpenNovaReceita: () => void;
  onOpenNovaDespesa: () => void;
  onOpenRelatorio?: () => void;
}

export const FinanceiroScreen: React.FC<FinanceiroScreenProps> = ({
  transactions,
  onOpenNovaReceita,
  onOpenNovaDespesa,
  onOpenRelatorio,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [periodoFilter, setPeriodoFilter] = useState('Mês Atual');

  const recebido = transactions
    .filter((t) => t.type === 'receita' && t.status === 'pago')
    .reduce((acc, t) => acc + t.value, 0);

  const aReceber = transactions
    .filter((t) => t.type === 'receita' && t.status === 'pendente')
    .reduce((acc, t) => acc + t.value, 0);

  const despesasPagas = transactions
    .filter((t) => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + t.value, 0);

  const saldo = recebido - despesasPagas;

  const filtered = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      t.description.toLowerCase().includes(term) ||
      (t.clientName && t.clientName.toLowerCase().includes(term));
    const matchTipo =
      tipoFilter === 'Todos' ||
      (tipoFilter === 'Receitas' && t.type === 'receita') ||
      (tipoFilter === 'Despesas' && t.type === 'despesa');
    const matchStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Pago' && t.status === 'pago') ||
      (statusFilter === 'Pendente' && t.status === 'pendente');

    return matchSearch && matchTipo && matchStatus;
  });

  return (
    <div id="screen-financeiro" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Financeiro
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Controle de receitas e despesas
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onOpenRelatorio}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Relatório</span>
          </button>

          <button
            onClick={onOpenNovaReceita}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Nova Receita</span>
          </button>

          <button
            onClick={onOpenNovaDespesa}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-red-900/40 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recebido */}
        <div className="rounded-2xl bg-zinc-900/90 border-l-4 border-l-emerald-500 border border-zinc-800/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-zinc-100 font-mono">
              {formatCurrency(recebido)}
            </div>
            <div className="text-xs text-zinc-400">Recebido</div>
          </div>
        </div>

        {/* A Receber */}
        <div className="rounded-2xl bg-zinc-900/90 border-l-4 border-l-amber-500 border border-zinc-800/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-zinc-100 font-mono">
              {formatCurrency(aReceber)}
            </div>
            <div className="text-xs text-zinc-400">A Receber</div>
          </div>
        </div>

        {/* Despesas Pagas */}
        <div className="rounded-2xl bg-zinc-900/90 border-l-4 border-l-rose-500 border border-zinc-800/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-zinc-100 font-mono">
              {formatCurrency(despesasPagas)}
            </div>
            <div className="text-xs text-zinc-400">Despesas Pagas</div>
          </div>
        </div>

        {/* Saldo */}
        <div className="rounded-2xl bg-zinc-900/90 border-l-4 border-l-amber-400 border border-zinc-800/80 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {formatCurrency(saldo)}
            </div>
            <div className="text-xs text-zinc-400">Saldo</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF, pedido, status..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Tipo:</span>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden"
            >
              <option value="Todos">Todos</option>
              <option value="Receitas">Receitas</option>
              <option value="Despesas">Despesas</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden"
            >
              <option value="Todos">Todos</option>
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">Período:</span>
            <div className="relative">
              <select
                value={periodoFilter}
                onChange={(e) => setPeriodoFilter(e.target.value)}
                className="pl-7 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden"
              >
                <option value="Mês Atual">Mês Atual</option>
                <option value="Mês Anterior">Mês Anterior</option>
                <option value="Ano Atual">Ano Atual</option>
                <option value="Personalizado">Personalizado</option>
              </select>
              <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Sub-label */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 px-1">
        <Filter className="w-3.5 h-3.5" />
        <span>Exibindo resultados de 01/08/2026 até 21/08/2026</span>
      </div>

      {/* Main Content: Empty State or Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center min-h-[280px] space-y-4">
          <DollarSign className="w-12 h-12 text-zinc-600 stroke-[1.5]" />
          <p className="text-xs text-zinc-400 font-medium">Nenhum registro financeiro</p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onOpenNovaReceita}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Nova Receita</span>
            </button>
            <button
              onClick={onOpenNovaDespesa}
              className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Nova Despesa</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Método</th>
                  <th className="py-3 px-4">Vencimento</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{tx.description}</div>
                      {tx.clientName && (
                        <div className="text-[10px] text-zinc-500">Cliente: {tx.clientName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{tx.paymentMethod || '—'}</td>
                    <td className="py-3 px-4 text-zinc-400 font-mono">
                      {tx.dueDate ? formatDate(tx.dueDate) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'pago'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        tx.type === 'receita' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'receita' ? '+' : '-'} {formatCurrency(tx.value)}
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
