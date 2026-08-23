import React from 'react';
import {
  LayoutGrid,
  Users,
  Package,
  FileSpreadsheet,
  Layers,
  CalendarDays,
  ShoppingBag,
  Truck,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { GestaoRoute, SidebarMode } from '../types';

interface SidebarGestaoProps {
  currentRoute: string;
  onNavigate: (route: string, mode?: SidebarMode) => void;
  ordersCount: number;
  quotesCount: number;
  clientsCount: number;
}

export const SidebarGestao: React.FC<SidebarGestaoProps> = ({
  currentRoute,
  onNavigate,
  ordersCount,
  quotesCount,
  clientsCount,
}) => {
  const menuItems = [
    {
      id: 'visao-geral',
      label: 'Visão Geral',
      icon: LayoutGrid,
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: Users,
      count: clientsCount,
    },
    {
      id: 'produtos',
      label: 'Produtos',
      icon: Package,
    },
    {
      id: 'orcamentos',
      label: 'Orçamentos',
      icon: FileSpreadsheet,
      count: quotesCount,
    },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: Layers,
      count: ordersCount,
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: CalendarDays,
    },
    {
      id: 'pedidos-online',
      label: 'Pedidos Online',
      icon: ShoppingBag,
      badge: '0 novos',
    },
    {
      id: 'logistica',
      label: 'Logística & Entregas',
      icon: Truck,
    },
  ];

  return (
    <aside
      id="sidebar-gestao-modulo"
      className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full select-none shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 text-sm tracking-tight">Gestão</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded uppercase">
                Gráfica
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate">Silk Print Gráfica</p>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
          Módulo de Gestão
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentRoute === item.id ||
            (item.id === 'orcamentos' && currentRoute === 'novo-orcamento');

          return (
            <button
              key={item.id}
              id={`nav-gestao-${item.id}`}
              onClick={() => onNavigate(item.id, 'gestao')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {typeof item.count === 'number' && item.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/50'
                  }`}
                >
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-zinc-800 text-zinc-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2 bg-zinc-950/70">
        {/* Back to Admin button */}
        <button
          onClick={() => onNavigate('dashboard', 'admin')}
          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg border border-blue-500/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Admin</span>
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
