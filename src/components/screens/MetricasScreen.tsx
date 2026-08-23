import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Calendar,
  Smartphone,
  Monitor,
  Share2,
  Instagram,
  MessageCircle,
  Search,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
} from 'lucide-react';
import { Order, CatalogProduct } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface MetricasScreenProps {
  orders: Order[];
  products: CatalogProduct[];
}

export const MetricasScreen: React.FC<MetricasScreenProps> = ({ orders, products }) => {
  const [period, setPeriod] = useState<'7d' | '30d' | 'mes' | 'ano'>('30d');

  const totalFaturamento = orders.reduce((acc, o) => acc + o.total, 0);
  const totalViews = period === '7d' ? 420 : period === '30d' ? 1840 : period === 'mes' ? 1420 : 12600;
  const uniqueVisitors = Math.round(totalViews * 0.72);
  const whatsappClicks = period === '7d' ? 52 : period === '30d' ? 198 : 160;
  const cartAdds = period === '7d' ? 78 : period === '30d' ? 310 : 250;
  const ordersCount = orders.length > 0 ? orders.length : 14;
  const ticketMedio = totalFaturamento > 0 ? totalFaturamento / (orders.length || 1) : 485.5;
  const conversionRate = ((ordersCount / totalViews) * 100).toFixed(1);

  // Daily views mock data for graph
  const dailyData = [
    { day: '01/08', views: 45, clicks: 5, orders: 1 },
    { day: '05/08', views: 68, clicks: 8, orders: 2 },
    { day: '10/08', views: 92, clicks: 14, orders: 3 },
    { day: '15/08', views: 110, clicks: 16, orders: 2 },
    { day: '20/08', views: 85, clicks: 11, orders: 1 },
    { day: '25/08', views: 130, clicks: 22, orders: 4 },
    { day: '30/08', views: 154, clicks: 28, orders: 5 },
  ];

  const maxDailyViews = Math.max(...dailyData.map((d) => d.views));

  return (
    <div id="screen-metricas" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Métricas do Catálogo Online</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Desempenho de visualizações, funil de conversão, cliques no WhatsApp e vendas do e-commerce
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-xl gap-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              period === '7d' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            7 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              period === '30d' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            30 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('mes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              period === 'mes' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Este Mês
          </button>
          <button
            type="button"
            onClick={() => setPeriod('ano')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              period === 'ano' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ano Atual
          </button>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Visualizações</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{totalViews.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +22.4% vs anterior
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Visitantes Únicos</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{uniqueVisitors.toLocaleString('pt-BR')}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +18.2% vs anterior
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Cliques WhatsApp</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{whatsappClicks}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +14.8% vs anterior
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Pedidos Catálogo</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{ordersCount}</div>
          <div className="text-[10px] text-zinc-400">Taxa conv: {conversionRate}%</div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Faturamento Online</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-400 font-mono">{formatCurrency(totalFaturamento)}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +28.5%
          </div>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Ticket Médio</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-zinc-100 font-mono">{formatCurrency(ticketMedio)}</div>
          <div className="text-[10px] text-zinc-400">por pedido</div>
        </div>
      </div>

      {/* Chart & Funnel Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evolution Chart */}
        <div className="lg:col-span-2 p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-5 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Evolução Diária de Visitas & Conversão</h3>
              <p className="text-xs text-zinc-400">Comparativo entre acessos no catálogo e chamadas no WhatsApp</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                <span className="text-zinc-400">Visualizações</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span className="text-zinc-400">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Custom Bar Graph */}
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-7 gap-3 sm:gap-6 items-end h-44 border-b border-zinc-800 px-2">
              {dailyData.map((d, i) => {
                const heightViews = Math.round((d.views / maxDailyViews) * 100);
                const heightClicks = Math.round((d.clicks / maxDailyViews) * 100);
                return (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Bar 1: Views */}
                      <div
                        style={{ height: `${Math.max(heightViews, 12)}%` }}
                        className="w-1/2 max-w-[20px] bg-blue-500/80 group-hover:bg-blue-400 rounded-t-sm transition-all relative flex justify-center"
                      >
                        <span className="absolute -top-6 text-[10px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 z-10">
                          {d.views}
                        </span>
                      </div>
                      {/* Bar 2: WhatsApp */}
                      <div
                        style={{ height: `${Math.max(heightClicks * 2.5, 8)}%` }}
                        className="w-1/2 max-w-[20px] bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t-sm transition-all relative flex justify-center"
                      >
                        <span className="absolute -top-6 text-[10px] font-mono text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 z-10">
                          {d.clicks}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Funnel de Conversão */}
        <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Funil de Conversão do Catálogo</h3>
            <p className="text-xs text-zinc-400">Jornada do cliente até o fechamento</p>
          </div>

          <div className="space-y-3.5 my-auto">
            {/* Step 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-300">1</span>
                  Acessaram o Catálogo
                </span>
                <span className="font-mono font-bold text-zinc-100">{totalViews} (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-400 rounded-full w-full" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-300">2</span>
                  Visualizaram Produto
                </span>
                <span className="font-mono font-bold text-zinc-100">
                  {Math.round(totalViews * 0.65)} (65%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-[65%]" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-300">3</span>
                  Adicionaram / Clicaram WhatsApp
                </span>
                <span className="font-mono font-bold text-zinc-100">{whatsappClicks} (10.7%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[10.7%]" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Pedido Concluído
                </span>
                <span className="font-mono font-bold text-emerald-400">{ordersCount} ({conversionRate}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(parseFloat(conversionRate) * 5, 8)}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
            💡 <strong className="text-zinc-200">Dica:</strong> Produtos com fotos reais e tabelas de acabamentos aumentam a conversão no WhatsApp em até 35%.
          </div>
        </div>
      </div>

      {/* Dispositivos, Origem de Tráfego e Top Cidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Dispositivos */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-zinc-100">Dispositivos de Acesso</h3>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Smartphone / Mobile</span>
                <span className="font-mono font-bold text-zinc-100">82%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[82%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Computador / Desktop</span>
                <span className="font-mono font-bold text-zinc-100">16%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full w-[16%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Tablet / Outros</span>
                <span className="font-mono font-bold text-zinc-100">2%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-600 rounded-full w-[2%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Origem de Tráfego */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-zinc-100">Canais de Aquisição</h3>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram (Link da Bio)
                </span>
                <span className="font-mono font-bold text-zinc-100">48%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-pink-500 rounded-full w-[48%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Direto
                </span>
                <span className="font-mono font-bold text-zinc-100">32%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[32%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-400" /> Google / Busca Orgânica
                </span>
                <span className="font-mono font-bold text-zinc-100">14%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[14%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-300">Outros / Acesso Direto</span>
                <span className="font-mono font-bold text-zinc-100">6%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-500 rounded-full w-[6%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Cidades com Mais Acessos */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-zinc-100">Principais Cidades</h3>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-200 font-medium">São Paulo, SP</span>
              <span className="font-mono text-blue-400 font-bold">54% dos acessos</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-200 font-medium">Guarulhos, SP</span>
              <span className="font-mono text-zinc-300">18%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-200 font-medium">Campinas, SP</span>
              <span className="font-mono text-zinc-300">12%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-200 font-medium">Outras Regiões</span>
              <span className="font-mono text-zinc-400">16%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Top Produtos Mais Clicados no Catálogo</h3>
            <p className="text-xs text-zinc-400">Produtos com maior atratividade e demanda do público</p>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
            {products.length} produtos monitorados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="pb-3 pl-2">Posição & Produto</th>
                <th className="pb-3">Categoria</th>
                <th className="pb-3">Preço Base</th>
                <th className="pb-3 text-center">Visualizações</th>
                <th className="pb-3 text-center">Cliques WhatsApp</th>
                <th className="pb-3 text-right pr-2">Taxa Conversão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.slice(0, 7).map((p, idx) => {
                const views = 420 - idx * 45;
                const clicks = Math.round(views * 0.14);
                const conv = ((clicks / views) * 100).toFixed(1);
                return (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono text-zinc-500 font-bold text-center">#{idx + 1}</span>
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover bg-zinc-950 border border-zinc-800"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                        <span className="font-semibold text-zinc-200">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-blue-400">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-200">
                      {views}
                    </td>
                    <td className="py-3 text-center font-mono text-emerald-400 font-semibold">
                      {clicks}
                    </td>
                    <td className="py-3 text-right pr-2 font-mono text-zinc-300">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                        {conv}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
