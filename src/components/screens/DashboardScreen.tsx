import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Package,
  Tags,
  CreditCard,
  Layers,
  Store,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Share2,
  Copy,
} from 'lucide-react';
import { CatalogProduct } from '../../types';

interface DashboardScreenProps {
  onOpenUpgradeModal: () => void;
  onOpenTutoriaisModal: () => void;
  onOpenCatalogPreview: () => void;
  onNavigateToGestao: () => void;
  onNavigateToProdutos: () => void;
  products: CatalogProduct[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenUpgradeModal,
  onOpenTutoriaisModal,
  onOpenCatalogPreview,
  onNavigateToGestao,
  onNavigateToProdutos,
  products,
}) => {
  // Count by categories for the 5 cards
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

  return (
    <div id="screen-dashboard" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Bem-vindo ao painel da Silk Print Gráfica
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToGestao}
            className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <span>Ir para Quadro de Gestão</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: Card Meu Plano & Card Tutoriais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card Meu Plano (Col-span 2) */}
        <div className="lg:col-span-2 p-5 md:p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-bold text-zinc-100">
                    Meu Plano: Teste Grátis
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-md">
                    Período de Teste
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  40 produtos | 0 categorias personalizadas
                </p>
              </div>

              <button
                onClick={onOpenUpgradeModal}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg shadow-sm shadow-amber-500/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
                <span>Fazer Upgrade</span>
              </button>
            </div>

            {/* Inner Expiration Card */}
            <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Teste expira em <strong className="text-zinc-100">26 de agosto de 2026</strong> (5 dias restantes)
                </span>
              </div>
              <button
                onClick={onOpenUpgradeModal}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
              >
                <span>Assinar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
            <span>Domínio ativo: <strong className="text-zinc-400 font-mono">cataloglab.app/@silkprint</strong></span>
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Catálogo Online Funcionando
            </span>
          </div>
        </div>

        {/* Card Aprenda a usar o CatalogLab (Col-span 1) */}
        <div className="p-5 md:p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-zinc-100">
              Aprenda a usar o CatalogLab
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Descubra em poucos minutos como configurar acabamentos, tabelas de preço por metro quadrado e criar orçamentos automáticos.
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={onOpenTutoriaisModal}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Ver tutoriais</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
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
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
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
                className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {c.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
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

      {/* Card Informações da Loja */}
      <div className="p-5 md:p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500 text-zinc-950 font-black text-lg flex items-center justify-center shrink-0 shadow-md">
              S
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-zinc-100">
                Informações da Loja
              </h4>
              <div className="mt-1 space-y-0.5 text-xs text-zinc-400">
                <p>
                  Nome:{' '}
                  <strong className="text-zinc-200">Silk Print Gráfica</strong>
                </p>
                <p>
                  URL do Catálogo:{' '}
                  <span className="text-amber-400 font-mono font-semibold">
                    @silkprint
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                navigator.clipboard?.writeText('https://cataloglab.app/@silkprint');
                alert('Link do catálogo copiado!');
              }}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Link</span>
            </button>

            <button
              onClick={onOpenCatalogPreview}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-sm flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Catálogo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
