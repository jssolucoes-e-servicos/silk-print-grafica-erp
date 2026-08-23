export type SidebarMode = 'admin' | 'gestao';

export type AdminRoute =
  | 'dashboard'
  | 'gestao'
  | 'produtos'
  | 'categorias'
  | 'clientes'
  | 'acabamentos'
  | 'financeiro'
  | 'relatorios'
  | 'precificacao'
  | 'metricas'
  | 'exportar'
  | 'aparencia'
  | 'pagamentos'
  | 'integracoes'
  | 'funcionarios'
  | 'configuracoes';

export type GestaoRoute =
  | 'visao-geral'
  | 'clientes'
  | 'produtos'
  | 'produtos-internos'
  | 'orcamentos'
  | 'novo-orcamento'
  | 'pedidos'
  | 'novo-pedido'
  | 'agenda'
  | 'pedidos-online'
  | 'logistica'
  | 'declaracao-conteudo';

export type AppRoute = AdminRoute | GestaoRoute;

export type OrderStatus =
  | 'criando_arte'
  | 'em_aberto'
  | 'em_producao'
  | 'aguardando_retirada'
  | 'em_transporte'
  | 'entregue'
  | 'aguardando_pagamento'
  | 'cancelado';

export interface OrderMessage {
  id: string;
  sender: 'grafica' | 'cliente' | 'sistema';
  text: string;
  timestamp: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  cpfCnpj?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
}

export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  sourceTab: 'catalogo' | 'internos' | 'm2' | 'personalizado';
  pricingType: 'unidade' | 'm2' | 'milheiro' | 'pacote' | 'hora';
  width?: number; // cm
  height?: number; // cm
  finishings?: string[];
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number?: string;
  code?: string;
  clientId: string;
  clientName: string;
  clientWhatsapp: string;
  items: QuoteItem[];
  observations?: string;
  validityDate?: string;
  validUntil?: string;
  subtotal: number;
  discount?: number;
  total: number;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado' | 'convertido';
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientWhatsapp: string;
  clientCpf?: string;
  clientEmail?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  description: string;
  items?: QuoteItem[];
  itemsCount: number;
  total: number;
  paidAmount?: number;
  status: OrderStatus;
  paymentStatus: 'pago' | 'pendente' | 'parcial';
  paymentMethod?: string;
  pixKey?: string;
  trackingCode?: string;
  shippingCarrier?: string;
  deliveryDate: string;
  createdAt: string;
  notes?: string;
  isOnlineOrder?: boolean;
  messages?: OrderMessage[];
}

export interface PriceTier {
  id: string;
  quantity: number;
  price: number;
  cost?: number;
}

export interface InternalProduct {
  id: string;
  name: string;
  category: string;
  size?: string;
  printType?: string;
  paper?: string;
  finishing?: string;
  description?: string;
  productionTime?: string;
  priceType: 'quantidade' | 'escalonado';
  priceTiers: PriceTier[];
  isActive: boolean;
  isM2?: boolean;
  baseM2Price?: number;
}

export interface FinishingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost?: number;
  unit?: string;
  pricingType: 'unidade' | 'm2' | 'fixo';
  extraDays?: number;
  description?: string;
  active?: boolean;
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  type: 'receita' | 'despesa';
  description: string;
  value: number;
  paymentMethod?: 'PIX' | 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'Transferência' | string;
  status: 'pago' | 'pendente';
  dueDate?: string;
  category?: string;
  observations?: string;
  clientName?: string;
  createdAt: string;
}

export interface KitSubItem {
  id: string;
  title: string;
  size?: string;
  printType?: string;
  paper?: string;
  finishing?: string;
  image?: string;
}

export interface EcommerceKit {
  id: string;
  name: string;
  category: string;
  price: number;
  productionTime?: string;
  description?: string;
  items: KitSubItem[];
  image?: string;
  isActive?: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  title?: string;
  category: string;
  price: number;
  basePrice?: number;
  unit: string;
  minQty?: number;
  image?: string;
  description?: string;
  isInternal?: boolean;
  isM2?: boolean;
  baseM2Price?: number;
  productionTime?: string;
  kitItems?: KitSubItem[];
  isActive?: boolean;
}

export type Product = CatalogProduct;
