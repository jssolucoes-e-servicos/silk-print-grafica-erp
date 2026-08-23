import React from 'react';
import {
  Menu,
  Search,
  Bell,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Store,
  Plus,
} from 'lucide-react';
import { SidebarMode } from '../types';

interface TopHeaderProps {
  sidebarMode: SidebarMode;
  currentRoute: string;
  onToggleSidebarMode: () => void;
  onOpenCatalogPreview: () => void;
  onOpenNovaReceita: () => void;
  onNavigateToNovoOrcamento: () => void;
  onMobileMenuToggle: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  sidebarMode,
  currentRoute,
  onToggleSidebarMode,
  onOpenCatalogPreview,
  onOpenNovaReceita,
  onNavigateToNovoOrcamento,
  onMobileMenuToggle,
}) => {
  const getBreadcrumb = () => {
    const isGestao = sidebarMode === 'gestao';
    const mainSection = isGestao ? 'Gestão Gráfica' : 'smartGraph';

    const routeNames: Record<string, string> = {
      dashboard: 'Dashboard',
      'visao-geral': 'Visão Geral',
      clientes: 'Clientes',
      'novo-orcamento': 'Novo Orçamento',
      orcamentos: 'Orçamentos',
      pedidos: 'Pedidos',
      produtos: 'Produtos',
      'produtos-internos': 'Produtos Internos',
      acabamentos: 'Acabamentos',
      agenda: 'Agenda',
      'pedidos-online': 'Pedidos Online',
      'declaracao-conteudo': 'Declaração de Conteúdo',
      financeiro: 'Financeiro',
      relatorios: 'Relatórios',
      categorias: 'Categorias',
      precificacao: 'Precificação',
      metricas: 'Métricas',
      exportar: 'Exportar',
      aparencia: 'Aparência',
      pagamentos: 'Pagamentos',
      integracoes: 'Integrações',
      funcionarios: 'Colaboradores',
    };

    return {
      main: mainSection,
      sub: routeNames[currentRoute] || currentRoute,
    };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-14 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          aria-label="Abrir Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="font-medium text-zinc-300 flex items-center gap-1.5">
            {sidebarMode === 'gestao' ? (
              <Layers className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            )}
            {breadcrumb.main}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
          <span className="font-semibold text-zinc-100">{breadcrumb.sub}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Toggle Mode Button */}
        <button
          onClick={onToggleSidebarMode}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
        >
          {sidebarMode === 'admin' ? (
            <>
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Ir para Módulo Gestão</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Voltar ao CatalogLab</span>
            </>
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => alert('Nenhuma notificação pendente.')}
          className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Notificações"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-zinc-950" />
        </button>
      </div>
    </header>
  );
};
