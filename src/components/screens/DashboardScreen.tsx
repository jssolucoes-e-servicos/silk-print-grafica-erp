import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Package,
  Tags,
  CreditCard,
  Layers,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Copy,
  Plus,
  Calculator,
  Eye,
  Zap,
  ShoppingBag,
  Sliders,
} from 'lucide-react';
import { CatalogProduct, SidebarMode } from '../../types';

interface DashboardScreenProps {
  onOpenUpgradeModal?: () => void;
  onOpenTutoriaisModal?: () => void;
  onOpenCatalogPreview: () => void;
  onNavigateToGestao: () => void;
  onNavigateToProdutos: () => void;
  onNavigate?: (route: string, mode?: SidebarMode) => void;
  products: CatalogProduct[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenCatalogPreview,
  onNavigateToGestao,
  onNavigateToProdutos,
  onNavigate,
  products,
}) => {
  // Count by categories for the cards
  const kitsCount = products.filter((p) => p.category === 'Kits').length;
  const tagsCount = products.filter((p) => p.category === 'Tags').length;
  const cartoesCount = products.filter((p) => p.category === 'Cartões').length;
  const adesivosCount = products.filter((p) => p.category === 'Adesivos').length;
  const outrosCount = products.filter((p) => p.category === 'Outros').length;

  const counterCards = [
    { label: 'Kits', count: kitsCount, icon: Package, key: 'kits' },
    { label: 'Tags', count: tagsCount, icon: Tags, key: 'tags' },
    { label: 'Cartões', count: cartoesCount, icon: CreditCard, key: 'cartoes' },
    { label: 'Adesivos', count: adesivosCount, icon: Layers, key: 'adesivos' },
    { label: 'Outros', count: outrosCount, icon: Sparkles, key: 'outros' },
  ];

  const quickActions = [
    {
      title: 'Novo Orçamento',
      desc: 'Calcular e enviar proposta ao cliente',
      icon: Plus,
      action: () => onNavigate ? onNavigate('novo-orcamento', 'gestao') : onNavigateToGestao(),
      badge: 'Orçamento',
      highlight: true,
    },
    {
      title: 'Cadastrar Produto',
      desc: 'Adicionar novo item ao catálogo',
      icon: Package,
      action: () => onNavigateToProdutos(),
      badge: 'Catálogo',
    },
    {
      title: 'Regras de Precificação',
      desc: 'Margens, markups e m² de insumos',
      icon: Calculator,
      action: () => onNavigate ? onNavigate('precificacao', 'admin') : null,
      badge: 'Margens',
    },
    {
      title: 'Métricas & Acessos',
      desc: 'Visualizações e conversões WhatsApp',
      icon: TrendingUp,
      action: () => onNavigate ? onNavigate('metricas', 'admin') : null,
      badge: 'Analytics',
    },
  ];

  return (
    <div id="screen-dashboard" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Visão geral do catálogo e atalhos operacionais da Silk Print Gráfica
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToGestao}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <span>Ir para Quadro de Gestão</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>

      {/* Overview Status Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">Total no Catálogo</div>
            <div className="text-xl font-bold text-zinc-100 font-mono mt-0.5">{products.length} itens</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">Categorias Ativas</div>
            <div className="text-xl font-bold text-zinc-100 font-mono mt-0.5">5 grupos</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Tags className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">Status da Loja</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online & Ativo
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">Canal de Pedidos</div>
            <div className="text-xs font-bold text-blue-400 mt-1">WhatsApp Direto</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Grid de Contadores: Kits, Tags, Cartões, Adesivos, Outros */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Produtos por Categoria no Catálogo
          </h3>
          <button
            onClick={onNavigateToProdutos}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
          >
            <span>Gerenciar produtos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {counterCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.key}
                onClick={onNavigateToProdutos}
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {c.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-black text-zinc-100 font-mono tracking-tight">
                  {c.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atalhos Rápidos Operacionais */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Ações Rápidas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quickActions.map((qa, index) => {
            const Icon = qa.icon;
            return (
              <div
                key={index}
                onClick={qa.action}
                className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  qa.highlight
                    ? 'bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/15 hover:border-blue-500/50'
                    : 'bg-zinc-900/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                      {qa.badge}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {qa.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {qa.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Acessar</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
