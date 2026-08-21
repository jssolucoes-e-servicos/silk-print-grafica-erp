import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Tags,
  Calculator,
  TrendingUp,
  Download,
  Palette,
  CreditCard,
  Zap,
  Users,
  FileText,
  SunMoon,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { AdminRoute, SidebarMode } from '../types';

interface SidebarAdminProps {
  currentRoute: string;
  onNavigate: (route: string, mode?: SidebarMode) => void;
  onOpenUpgradeModal: () => void;
  onOpenCatalogPreview: () => void;
  ordersCount: number;
}

export const SidebarAdmin: React.FC<SidebarAdminProps> = ({
  currentRoute,
  onNavigate,
  onOpenUpgradeModal,
  onOpenCatalogPreview,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'gestao',
      label: 'Gestão',
      icon: ClipboardList,
      mode: 'gestao' as SidebarMode,
      targetRoute: 'visao-geral',
      badge: 'PRO',
    },
    {
      id: 'produtos',
      label: 'Produtos',
      icon: Package,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'categorias',
      label: 'Categorias',
      icon: Tags,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'precificacao',
      label: 'Precificação',
      icon: Calculator,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'metricas',
      label: 'Métricas',
      icon: TrendingUp,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'exportar',
      label: 'Exportar',
      icon: Download,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'aparencia',
      label: 'Aparência',
      icon: Palette,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'pagamentos',
      label: 'Pagamentos',
      icon: CreditCard,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'integracoes',
      label: 'Integrações',
      icon: Zap,
      mode: 'admin' as SidebarMode,
    },
    {
      id: 'funcionarios',
      label: 'Funcionários',
      icon: Users,
      mode: 'admin' as SidebarMode,
    },
  ];

  return (
    <aside
      id="sidebar-admin-cataloglab"
      className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full select-none shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/70">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-base shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 fill-zinc-950" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-100 text-sm tracking-tight">CatalogLab</span>
              </div>
              <p className="text-xs text-zinc-400 truncate">Silk Print Gráfica</p>
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-md tracking-tight whitespace-nowrap">
            Teste 5d
          </span>
        </div>

        {/* Expiration Alert Box */}
        <div
          onClick={onOpenUpgradeModal}
          className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Teste expira em 5 dias</span>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
            <span>Assinar plano</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
          Menu Principal
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'gestao'
              ? currentRoute === 'gestao' || currentRoute === 'visao-geral'
              : currentRoute === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                if (item.id === 'gestao') {
                  onNavigate('visao-geral', 'gestao');
                } else {
                  onNavigate(item.id, 'admin');
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-zinc-950' : 'text-zinc-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-zinc-950/20 text-zinc-950'
                      : 'bg-zinc-800 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/80 space-y-1 bg-zinc-950/70">
        {/* User profile snippet */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 mb-2">
          <div className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
            S
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-zinc-200 truncate">
              Silk Print Gráfica
            </div>
            <div className="text-[11px] text-zinc-500 truncate">@silkprint</div>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </div>

        {/* Secondary links */}
        <button
          onClick={onOpenUpgradeModal}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 rounded-md transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Assinatura</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </button>

        <button
          onClick={() => {}}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 rounded-md transition-colors"
        >
          <div className="flex items-center gap-2">
            <SunMoon className="w-3.5 h-3.5" />
            <span>Tema escuro</span>
          </div>
          <span className="text-[10px] text-zinc-500">Padrão</span>
        </button>

        <button
          onClick={onOpenCatalogPreview}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-md transition-colors font-medium"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver catálogo</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-1 rounded text-amber-300">↗</span>
        </button>

        <button
          onClick={() => {
            alert('Sessão encerrada com segurança.');
          }}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
