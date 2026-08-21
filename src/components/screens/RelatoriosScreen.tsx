import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  FileText,
  DollarSign,
  Package,
  ShoppingBag,
  Clock,
  Printer,
} from 'lucide-react';
import { Order, Quote, Product, Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface RelatoriosScreenProps {
  orders: Order[];
  quotes: Quote[];
  products: Product[];
  transactions: Transaction[];
}

export const RelatoriosScreen: React.FC<RelatoriosScreenProps> = ({
  orders,
  quotes,
  products,
  transactions,
}) => {
  const [dataInicial, setDataInicial] = useState('2026-08-01');
  const [dataFinal, setDataFinal] = useState('2026-08-31');
  const [activeTab, setActiveTab] = useState<'pedidos' | 'orcamentos' | 'produtos' | 'faturamento'>('pedidos');

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div id="screen-relatorios" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
          Relatórios
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
          Visualize e exporte relatórios do seu negócio
        </p>
      </div>

      {/* Card: Filtros de Período */}
      <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span>Filtros de Período</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Data Inicial</span>
            <div className="relative">
              <input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Data Final</span>
            <div className="relative">
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                className="pl-3 pr-8 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrar</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl max-w-2xl">
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'pedidos'
              ? 'bg-zinc-950 text-zinc-100 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pedidos</span>
        </button>

        <button
          onClick={() => setActiveTab('orcamentos')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'orcamentos'
              ? 'bg-zinc-950 text-zinc-100 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Orçamentos</span>
        </button>

        <button
          onClick={() => setActiveTab('produtos')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'produtos'
              ? 'bg-zinc-950 text-zinc-100 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Produtos</span>
        </button>

        <button
          onClick={() => setActiveTab('faturamento')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'faturamento'
              ? 'bg-zinc-950 text-zinc-100 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Faturamento</span>
        </button>
      </div>

      {/* Main Tab Content Card */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100">
            {activeTab === 'pedidos' && 'Relatório de Pedidos'}
            {activeTab === 'orcamentos' && 'Relatório de Orçamentos'}
            {activeTab === 'produtos' && 'Relatório de Produtos e Vendas'}
            {activeTab === 'faturamento' && 'Relatório de Faturamento e Fluxo de Caixa'}
          </h2>

          <button
            onClick={handleExportPDF}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>
        </div>

        {/* Tab-specific Content */}
        {activeTab === 'pedidos' && (
          orders.length === 0 ? (
            <div className="p-16 text-center text-xs text-zinc-500">
              Nenhum pedido encontrado para o período selecionado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 text-[11px] text-zinc-400">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">#{o.code}</td>
                      <td className="py-2.5 px-3 text-zinc-200">{o.clientName}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">{formatDate(o.createdAt)}</td>
                      <td className="py-2.5 px-3 capitalize">{o.status.replace('_', ' ')}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{formatCurrency(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'orcamentos' && (
          quotes.length === 0 ? (
            <div className="p-16 text-center text-xs text-zinc-500">
              Nenhum orçamento encontrado para o período selecionado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 text-[11px] text-zinc-400">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Validade</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {quotes.map((q) => (
                    <tr key={q.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-400">#{q.code}</td>
                      <td className="py-2.5 px-3 text-zinc-200">{q.clientName}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400">{formatDate(q.validUntil)}</td>
                      <td className="py-2.5 px-3 capitalize">{q.status}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">{formatCurrency(q.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'produtos' && (
          products.length === 0 ? (
            <div className="p-16 text-center text-xs text-zinc-500">
              Nenhum produto cadastrado para o relatório.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 text-[11px] text-zinc-400">
                  <tr>
                    <th className="py-2.5 px-3">Produto</th>
                    <th className="py-2.5 px-3">Categoria</th>
                    <th className="py-2.5 px-3 text-right">Preço Base</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 text-zinc-200 font-semibold">{p.title}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{p.category}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-400">
                        {formatCurrency(p.basePrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'faturamento' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Entradas / Receitas</div>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.type === 'receita' && t.status === 'pago')
                      .reduce((s, t) => s + t.value, 0)
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Saídas / Despesas</div>
                <div className="text-xl font-mono font-bold text-rose-400 mt-1">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.type === 'despesa' && t.status === 'pago')
                      .reduce((s, t) => s + t.value, 0)
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Lucro / Saldo Período</div>
                <div className="text-xl font-mono font-bold text-amber-400 mt-1">
                  {formatCurrency(
                    transactions
                      .filter((t) => t.type === 'receita' && t.status === 'pago')
                      .reduce((s, t) => s + t.value, 0) -
                      transactions
                        .filter((t) => t.type === 'despesa' && t.status === 'pago')
                        .reduce((s, t) => s + t.value, 0)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
