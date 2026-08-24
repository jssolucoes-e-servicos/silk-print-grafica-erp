import {
  Client,
  Order,
  OrderStatus,
  Quote,
  CatalogProduct,
  Transaction,
} from '../types';

export const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    icon: string;
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    dotColor: string;
  }
> = {
  criando_arte: {
    label: 'Criando Arte',
    icon: '🎨',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/25',
    text: 'text-pink-400',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    dotColor: 'bg-pink-500',
  },
  em_aberto: {
    label: 'Em Aberto',
    icon: '🕒',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    text: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-500',
  },
  em_producao: {
    label: 'Em Produção',
    icon: '🏭',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    text: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dotColor: 'bg-purple-500',
  },
  aguardando_retirada: {
    label: 'Aguardando Retirada',
    icon: '📦',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    text: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dotColor: 'bg-cyan-500',
  },
  em_transporte: {
    label: 'Em Transporte',
    icon: '🚚',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    text: 'text-blue-400',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    dotColor: 'bg-blue-500',
  },
  entregue: {
    label: 'Entregue',
    icon: '🟢',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-500',
  },
  aguardando_pagamento: {
    label: 'Aguardando Pagamento',
    icon: '💳',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/25',
    text: 'text-orange-400',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    dotColor: 'bg-orange-500',
  },
  cancelado: {
    label: 'Cancelado',
    icon: '❌',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    text: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dotColor: 'bg-rose-500',
  },
};

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_QUOTES: Quote[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const CATALOG_PRODUCTS: CatalogProduct[] = [];

