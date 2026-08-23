import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  SidebarMode,
  Client,
  Order,
  OrderStatus,
  OrderMessage,
  Quote,
  QuoteItem,
  Transaction,
  CatalogProduct,
  FinishingItem,
  AccessProfile,
  UserEmployee,
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_QUOTES,
  INITIAL_TRANSACTIONS,
  CATALOG_PRODUCTS,
} from './data/mockData';
import {
  INITIAL_ACCESS_PROFILES,
  INITIAL_EMPLOYEES,
  evaluateUserPermission,
} from './lib/permissionsEngine';

// Components
import { SidebarAdmin } from './components/SidebarAdmin';
import { SidebarGestao } from './components/SidebarGestao';
import { TopHeader } from './components/TopHeader';
import { UserSimulatorBar } from './components/UserSimulatorBar';

// Modals
import { ModalNovaReceita } from './components/modals/ModalNovaReceita';
import { ModalNovaDespesa } from './components/modals/ModalNovaDespesa';
import { ModalNovoCliente } from './components/modals/ModalNovoCliente';
import { ModalAdicionarItem } from './components/modals/ModalAdicionarItem';
import { ModalNovoPedido } from './components/modals/ModalNovoPedido';
import { ModalUpgrade } from './components/modals/ModalUpgrade';
import { ModalTutoriais } from './components/modals/ModalTutoriais';
import { ModalCatalogoPreview } from './components/modals/ModalCatalogoPreview';
import { ModalDetalhesPedido } from './components/modals/ModalDetalhesPedido';
import { ModalDetalhesCliente } from './components/modals/ModalDetalhesCliente';
import { ModalDetalhesProduto } from './components/modals/ModalDetalhesProduto';
import { ModalDetalhesTransacao } from './components/modals/ModalDetalhesTransacao';
import { ModalWhatsAppChat } from './components/modals/ModalWhatsAppChat';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { GestaoVisaoGeralScreen } from './components/screens/GestaoVisaoGeralScreen';
import { NovoOrcamentoScreen } from './components/screens/NovoOrcamentoScreen';
import { ClientesScreen } from './components/screens/ClientesScreen';
import { OrcamentosListScreen } from './components/screens/OrcamentosListScreen';
import { PedidosListScreen } from './components/screens/PedidosListScreen';
import { FinanceiroScreen } from './components/screens/FinanceiroScreen';
import { ProdutosScreen } from './components/screens/ProdutosScreen';
import { CatalogoEcommerceProdutosScreen } from './components/screens/CatalogoEcommerceProdutosScreen';
import { CategoriasScreen } from './components/screens/CategoriasScreen';
import { AparenciaScreen } from './components/screens/AparenciaScreen';
import { ConfiguracoesScreen } from './components/screens/ConfiguracoesScreen';
import { PrecificacaoScreen } from './components/screens/PrecificacaoScreen';
import { MetricasScreen } from './components/screens/MetricasScreen';
import { ExportarScreen } from './components/screens/ExportarScreen';
import { PagamentosScreen } from './components/screens/PagamentosScreen';
import { IntegracoesScreen } from './components/screens/IntegracoesScreen';
import { FuncionariosScreen } from './components/screens/FuncionariosScreen';
import { PerfisAcessoScreen } from './components/screens/PerfisAcessoScreen';
import { AcabamentosScreen } from './components/screens/AcabamentosScreen';
import { AgendaScreen } from './components/screens/AgendaScreen';
import { PedidosOnlineScreen } from './components/screens/PedidosOnlineScreen';
import { DeclaracaoConteudoScreen } from './components/screens/DeclaracaoConteudoScreen';
import { LogisticaScreen } from './components/screens/LogisticaScreen';
import { RelatoriosScreen } from './components/screens/RelatoriosScreen';

const INITIAL_FINISHINGS: FinishingItem[] = [
  {
    id: 'acab-1',
    name: 'Laminação Fosca Bopp',
    category: 'Plastificação / Laminação',
    pricingType: 'm2',
    price: 12.0,
    cost: 4.5,
    unit: 'm²',
    active: true,
  },
  {
    id: 'acab-2',
    name: 'Verniz Localizado UV',
    category: 'Verniz',
    pricingType: 'unidade',
    price: 0.25,
    cost: 0.08,
    unit: 'un',
    active: true,
  },
  {
    id: 'acab-3',
    name: 'Corte Especial / Vinco',
    category: 'Acabamento Gráfico',
    pricingType: 'fixo',
    price: 35.0,
    cost: 10.0,
    unit: 'serviço',
    active: true,
  },
  {
    id: 'acab-4',
    name: 'Ilhós com Bainha Reforçada',
    category: 'Comunicação Visual',
    pricingType: 'unidade',
    price: 2.5,
    cost: 0.8,
    unit: 'un',
    active: true,
  },
];

export default function App() {
  // Navigation state
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('admin');
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data state
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [products, setProducts] = useState<CatalogProduct[]>(CATALOG_PRODUCTS);
  const [finishings, setFinishings] = useState<FinishingItem[]>(INITIAL_FINISHINGS);

  // Access Control & Multi-Profile State
  const [accessProfiles, setAccessProfiles] = useState<AccessProfile[]>(INITIAL_ACCESS_PROFILES);
  const [employees, setEmployees] = useState<UserEmployee[]>(INITIAL_EMPLOYEES);
  const [activeUser, setActiveUser] = useState<UserEmployee>(INITIAL_EMPLOYEES[0]);

  // Active drafting state for Novo Orçamento
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [lastCreatedClientId, setLastCreatedClientId] = useState<string | undefined>(undefined);

  // Modal Visibility states
  const [isNovaReceitaOpen, setIsNovaReceitaOpen] = useState(false);
  const [isNovaDespesaOpen, setIsNovaDespesaOpen] = useState(false);
  const [isNovoClienteOpen, setIsNovoClienteOpen] = useState(false);
  const [isAdicionarItemOpen, setIsAdicionarItemOpen] = useState(false);
  const [isNovoPedidoOpen, setIsNovoPedidoOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTutoriaisModalOpen, setIsTutoriaisModalOpen] = useState(false);
  const [isCatalogPreviewOpen, setIsCatalogPreviewOpen] = useState(false);

  // Order Details Modal state
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // Client Details Modal state
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);

  // Product Details Modal state
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<CatalogProduct | null>(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  // Financial Transaction Details Modal state
  const [selectedTransactionForDetails, setSelectedTransactionForDetails] = useState<Transaction | null>(null);
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);

  // WhatsApp Evolution Chat Modal state
  const [isWhatsAppChatOpen, setIsWhatsAppChatOpen] = useState(false);
  const [whatsAppChatParams, setWhatsAppChatParams] = useState<{
    clientName: string;
    clientPhone: string;
    initialMessage?: string;
    orderCode?: string;
    quoteNumber?: string;
  }>({
    clientName: '',
    clientPhone: '',
  });

  const handleOpenWhatsAppChat = (params: {
    clientName: string;
    clientPhone: string;
    initialMessage?: string;
    orderCode?: string;
    quoteNumber?: string;
  }) => {
    setWhatsAppChatParams(params);
    setIsWhatsAppChatOpen(true);
  };

  // Navigation handler
  const handleNavigate = (route: string, mode?: SidebarMode) => {
    if (mode) {
      setSidebarMode(mode);
    }
    setCurrentRoute(route);
    setIsMobileMenuOpen(false);
  };

  const toggleSidebarMode = () => {
    if (sidebarMode === 'admin') {
      setSidebarMode('gestao');
      setCurrentRoute('visao-geral');
    } else {
      setSidebarMode('admin');
      setCurrentRoute('dashboard');
    }
  };

  // Handlers for Data Updates
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>
  ) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [newTx, ...prev]);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleOpenTransactionDetails = (tx: Transaction) => {
    setSelectedTransactionForDetails(tx);
    setIsTransactionDetailsOpen(true);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
    );
    if (selectedTransactionForDetails && selectedTransactionForDetails.id === updatedTx.id) {
      setSelectedTransactionForDetails(updatedTx);
    }
  };

  const handleDeleteTransaction = (txId: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== txId));
    if (selectedTransactionForDetails && selectedTransactionForDetails.id === txId) {
      setIsTransactionDetailsOpen(false);
      setSelectedTransactionForDetails(null);
    }
  };

  const handleToggleTransactionStatus = (txId: string, newStatus: 'pago' | 'pendente') => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              status: newStatus,
              paidAt: newStatus === 'pago' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
    if (selectedTransactionForDetails && selectedTransactionForDetails.id === txId) {
      setSelectedTransactionForDetails((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              paidAt: newStatus === 'pago' ? new Date().toISOString() : undefined,
            }
          : null
      );
    }
  };

  const handleDuplicateTransaction = (tx: Transaction) => {
    const dup: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      description: `${tx.description} (Cópia)`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pendente',
    };
    setTransactions((prev) => [dup, ...prev]);
    setSelectedTransactionForDetails(dup);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleSaveClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    setLastCreatedClientId(newClient.id);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleOpenClientDetails = (client: Client) => {
    setSelectedClientForDetails(client);
    setIsClientDetailsOpen(true);
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
    );
    if (selectedClientForDetails && selectedClientForDetails.id === updatedClient.id) {
      setSelectedClientForDetails(updatedClient);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (selectedClientForDetails && selectedClientForDetails.id === clientId) {
      setIsClientDetailsOpen(false);
      setSelectedClientForDetails(null);
    }
  };

  const handleOpenProductDetails = (product: CatalogProduct) => {
    setSelectedProductForDetails(product);
    setIsProductDetailsOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: CatalogProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProductForDetails && selectedProductForDetails.id === updatedProduct.id) {
      setSelectedProductForDetails(updatedProduct);
    }
  };

  const handleDuplicateProduct = (product: CatalogProduct) => {
    const dup: CatalogProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Cópia)`,
    };
    setProducts((prev) => [dup, ...prev]);
    setSelectedProductForDetails(dup);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleSaveOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
  };

  const handleAddQuoteItems = (newItems: QuoteItem[]) => {
    setQuoteItems((prev) => [...prev, ...newItems]);
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveQuote = (newQuote: Quote) => {
    setQuotes((prev) => [newQuote, ...prev]);
    setQuoteItems([]);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
      setSelectedOrderForDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrderForDetails(order);
    setIsOrderDetailsOpen(true);
  };

  const handleUpdateOrderPaymentStatus = (
    orderId: string,
    newPaymentStatus: 'pago' | 'pendente' | 'parcial'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
    );
    if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
      setSelectedOrderForDetails((prev) =>
        prev ? { ...prev, paymentStatus: newPaymentStatus } : null
      );
    }
  };

  const handleAddOrderMessage = (orderId: string, message: OrderMessage) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, messages: [...(o.messages || []), message] } : o
      )
    );
    if (selectedOrderForDetails && selectedOrderForDetails.id === orderId) {
      setSelectedOrderForDetails((prev) =>
        prev ? { ...prev, messages: [...(prev.messages || []), message] } : null
      );
    }
  };

  const handleConvertQuoteToOrder = (quote: Quote) => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: `#${orderNumber}`,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientWhatsapp: quote.clientWhatsapp,
      description: quote.items.map((i) => `${i.quantity}x ${i.name}`).join(' + '),
      itemsCount: quote.items.length,
      total: quote.total,
      status: 'em_aberto',
      paymentStatus: 'pago',
      deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Convertido a partir do orçamento ${quote.number}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setQuotes((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: 'convertido' } : q))
    );
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    handleNavigate('visao-geral', 'gestao');
  };

  const handleAddProduct = (newProd: CatalogProduct) => {
    setProducts((prev) => [newProd, ...prev]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleProductInternal = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isInternal: !p.isInternal } : p))
    );
  };

  const handleAddFinishing = (newFinishing: FinishingItem) => {
    setFinishings((prev) => [newFinishing, ...prev]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleToggleFinishing = (id: string) => {
    setFinishings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleDeleteFinishing = (id: string) => {
    setFinishings((prev) => prev.filter((f) => f.id !== id));
  };

  // Profile Management Handlers
  const handleCreateProfile = (
    profileData: Omit<AccessProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newProfile: AccessProfile = {
      ...profileData,
      id: `prof_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAccessProfiles((prev) => [...prev, newProfile]);
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
  };

  const handleUpdateProfile = (updatedProfile: AccessProfile) => {
    setAccessProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  const handleDeleteProfile = (profileId: string) => {
    // Remove profile from all users
    setEmployees((prev) =>
      prev.map((e) => ({
        ...e,
        profileIds: e.profileIds.filter((pId) => pId !== profileId),
      }))
    );
    setAccessProfiles((prev) => prev.filter((p) => p.id !== profileId));
  };

  // Employee Management Handlers
  const handleAddEmployee = (
    empData: Omit<UserEmployee, 'id' | 'createdAt'>
  ) => {
    const newEmp: UserEmployee = {
      ...empData,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setEmployees((prev) => [...prev, newEmp]);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleUpdateEmployee = (updatedEmp: UserEmployee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e))
    );
    if (activeUser.id === updatedEmp.id) {
      setActiveUser(updatedEmp);
    }
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (activeUser.id === id && employees.length > 1) {
      const nextUser = employees.find((e) => e.id !== id) || employees[0];
      setActiveUser(nextUser);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans antialiased overflow-hidden select-none">
      {/* Desktop Sidebar: Admin or Gestao */}
      <div className="hidden md:flex shrink-0 h-full">
        {sidebarMode === 'admin' ? (
          <SidebarAdmin
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
            ordersCount={orders.length}
            activeUser={activeUser}
            profiles={accessProfiles}
          />
        ) : (
          <SidebarGestao
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            ordersCount={orders.length}
            quotesCount={quotes.length}
            clientsCount={clients.length}
            activeUser={activeUser}
            profiles={accessProfiles}
          />
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-72 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
            {sidebarMode === 'admin' ? (
              <SidebarAdmin
                currentRoute={currentRoute}
                onNavigate={handleNavigate}
                onOpenUpgradeModal={() => {
                  setIsMobileMenuOpen(false);
                  setIsUpgradeModalOpen(true);
                }}
                onOpenCatalogPreview={() => {
                  setIsMobileMenuOpen(false);
                  setIsCatalogPreviewOpen(true);
                }}
                ordersCount={orders.length}
                activeUser={activeUser}
                profiles={accessProfiles}
              />
            ) : (
              <SidebarGestao
                currentRoute={currentRoute}
                onNavigate={handleNavigate}
                ordersCount={orders.length}
                quotesCount={quotes.length}
                clientsCount={clients.length}
                activeUser={activeUser}
                profiles={accessProfiles}
              />
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
        {/* User Simulation Bar for Access Control Testing */}
        <UserSimulatorBar
          employees={employees}
          profiles={accessProfiles}
          activeUser={activeUser}
          onSelectUser={(u) => setActiveUser(u)}
        />

        {/* Top Header */}
        <TopHeader
          sidebarMode={sidebarMode}
          currentRoute={currentRoute}
          onToggleSidebarMode={toggleSidebarMode}
          onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
          onOpenNovaReceita={() => setIsNovaReceitaOpen(true)}
          onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentRoute === 'dashboard' && (
            <DashboardScreen
              products={products}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onNavigateToGestao={() => handleNavigate('visao-geral', 'gestao')}
              onNavigateToProdutos={() => handleNavigate('produtos', 'admin')}
              onNavigate={handleNavigate}
            />
          )}

          {(currentRoute === 'visao-geral' || currentRoute === 'gestao') && (
            <GestaoVisaoGeralScreen
              orders={orders}
              clients={clients}
              quotes={quotes}
              onOpenNovaReceita={() => setIsNovaReceitaOpen(true)}
              onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
              onNavigateToClientes={() => handleNavigate('clientes', 'gestao')}
              onNavigateToOrcamentos={() => handleNavigate('orcamentos', 'gestao')}
              onNavigateToPedidos={() => handleNavigate('pedidos', 'gestao')}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenOrderDetails={handleOpenOrderDetails}
            />
          )}

          {currentRoute === 'novo-orcamento' && (
            <NovoOrcamentoScreen
              clients={clients}
              items={quoteItems}
              createdClientId={lastCreatedClientId}
              onBack={() => handleNavigate('visao-geral', 'gestao')}
              onOpenNovoClienteModal={() => setIsNovoClienteOpen(true)}
              onOpenAdicionarItemModal={() => setIsAdicionarItemOpen(true)}
              onRemoveItem={handleRemoveQuoteItem}
              onSaveQuote={handleSaveQuote}
              onOpenWhatsAppChat={handleOpenWhatsAppChat}
            />
          )}

          {currentRoute === 'clientes' && (
            <ClientesScreen
              clients={clients}
              onOpenNovoClienteModal={() => setIsNovoClienteOpen(true)}
              onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
              onOpenClientDetails={handleOpenClientDetails}
              onOpenWhatsAppChat={handleOpenWhatsAppChat}
            />
          )}

          {currentRoute === 'orcamentos' && (
            <OrcamentosListScreen
              quotes={quotes}
              onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
              onConvertToOrder={handleConvertQuoteToOrder}
              onOpenWhatsAppChat={handleOpenWhatsAppChat}
            />
          )}

          {currentRoute === 'pedidos' && (
            <PedidosListScreen
              orders={orders}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenOrderDetails={handleOpenOrderDetails}
              onOpenWhatsAppChat={handleOpenWhatsAppChat}
            />
          )}

          {currentRoute === 'logistica' && (
            <LogisticaScreen
              orders={orders}
              clients={clients}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
            />
          )}

          {currentRoute === 'financeiro' && (
            <FinanceiroScreen
              transactions={transactions}
              onOpenNovaReceita={() => setIsNovaReceitaOpen(true)}
              onOpenNovaDespesa={() => setIsNovaDespesaOpen(true)}
              onOpenRelatorio={() => handleNavigate('relatorios', 'gestao')}
              onOpenTransactionDetails={handleOpenTransactionDetails}
            />
          )}

          {/* Produtos (Unificado: Catálogo e Insumos Internos) */}
          {currentRoute === 'produtos' && (
            <CatalogoEcommerceProdutosScreen
              products={products}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleProductInternal={handleToggleProductInternal}
              onOpenProductDetails={handleOpenProductDetails}
              initialTypeFilter="todos"
            />
          )}

          {/* Gestão: Produtos Internos (Redirecionamento / Filtro Direto) */}
          {currentRoute === 'produtos-internos' && (
            <CatalogoEcommerceProdutosScreen
              products={products}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleProductInternal={handleToggleProductInternal}
              onOpenProductDetails={handleOpenProductDetails}
              initialTypeFilter="internos"
            />
          )}

          {/* Admin: Categorias */}
          {currentRoute === 'categorias' && (
            <CategoriasScreen
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
            />
          )}

          {/* Admin: Precificação */}
          {currentRoute === 'precificacao' && (
            <ConfiguracoesScreen
              initialTab="precificacao"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Métricas */}
          {currentRoute === 'metricas' && (
            <MetricasScreen orders={orders} products={products} />
          )}

          {/* Admin: Exportar */}
          {currentRoute === 'exportar' && (
            <ConfiguracoesScreen
              initialTab="exportar"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Aparência */}
          {currentRoute === 'aparencia' && (
            <ConfiguracoesScreen
              initialTab="aparencia"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Configurações */}
          {currentRoute === 'configuracoes' && (
            <ConfiguracoesScreen
              initialTab="geral"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Pagamentos */}
          {currentRoute === 'pagamentos' && (
            <ConfiguracoesScreen
              initialTab="pagamentos"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Integrações */}
          {currentRoute === 'integracoes' && (
            <ConfiguracoesScreen
              initialTab="integracoes"
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Funcionários & Permissões */}
          {currentRoute === 'funcionarios' && (
            <FuncionariosScreen
              employees={employees}
              profiles={accessProfiles}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onRemoveEmployee={handleRemoveEmployee}
              onOpenProfilesScreen={() => handleNavigate('perfis', 'admin')}
            />
          )}

          {/* Admin: Perfis de Acesso & Matriz de Permissões */}
          {currentRoute === 'perfis' && (
            <PerfisAcessoScreen
              profiles={accessProfiles}
              employees={employees}
              onCreateProfile={handleCreateProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteProfile={handleDeleteProfile}
              onOpenEmployeesScreen={() => handleNavigate('funcionarios', 'admin')}
            />
          )}

          {currentRoute === 'acabamentos' && (
            <AcabamentosScreen
              finishings={finishings}
              onAddFinishing={handleAddFinishing}
              onToggleFinishing={handleToggleFinishing}
              onDeleteFinishing={handleDeleteFinishing}
            />
          )}

          {currentRoute === 'agenda' && (
            <AgendaScreen
              orders={orders}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
            />
          )}

          {currentRoute === 'pedidos-online' && (
            <PedidosOnlineScreen
              orders={orders}
            />
          )}

          {currentRoute === 'declaracao-conteudo' && (
            <LogisticaScreen
              orders={orders}
              clients={clients}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
            />
          )}

          {currentRoute === 'relatorios' && (
            <RelatoriosScreen
              orders={orders}
              quotes={quotes}
              products={products}
              transactions={transactions}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ModalNovaReceita
        isOpen={isNovaReceitaOpen}
        onClose={() => setIsNovaReceitaOpen(false)}
        onSave={handleSaveTransaction}
      />

      <ModalNovaDespesa
        isOpen={isNovaDespesaOpen}
        onClose={() => setIsNovaDespesaOpen(false)}
        onSave={handleSaveTransaction}
      />

      <ModalNovoCliente
        isOpen={isNovoClienteOpen}
        onClose={() => setIsNovoClienteOpen(false)}
        onSave={handleSaveClient}
      />

      <ModalAdicionarItem
        isOpen={isAdicionarItemOpen}
        onClose={() => setIsAdicionarItemOpen(false)}
        onAddItems={handleAddQuoteItems}
      />

      <ModalNovoPedido
        isOpen={isNovoPedidoOpen}
        onClose={() => setIsNovoPedidoOpen(false)}
        clients={clients}
        onSave={handleSaveOrder}
      />

      <ModalUpgrade
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <ModalTutoriais
        isOpen={isTutoriaisModalOpen}
        onClose={() => setIsTutoriaisModalOpen(false)}
      />

      <ModalCatalogoPreview
        isOpen={isCatalogPreviewOpen}
        onClose={() => setIsCatalogPreviewOpen(false)}
      />

      <ModalDetalhesPedido
        order={selectedOrderForDetails}
        isOpen={isOrderDetailsOpen}
        onClose={() => {
          setIsOrderDetailsOpen(false);
          setSelectedOrderForDetails(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
        onUpdatePaymentStatus={handleUpdateOrderPaymentStatus}
        onAddMessage={handleAddOrderMessage}
        onOpenWhatsAppChat={handleOpenWhatsAppChat}
      />

      {/* Modal Detalhes do Cliente */}
      <ModalDetalhesCliente
        client={selectedClientForDetails}
        isOpen={isClientDetailsOpen}
        onClose={() => {
          setIsClientDetailsOpen(false);
          setSelectedClientForDetails(null);
        }}
        orders={orders}
        quotes={quotes}
        transactions={transactions}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        onOpenNovoPedidoParaCliente={(client) => {
          setIsClientDetailsOpen(false);
          setIsNovoPedidoOpen(true);
        }}
        onOpenNovoOrcamentoParaCliente={(client) => {
          setIsClientDetailsOpen(false);
          handleNavigate('novo-orcamento', 'gestao');
        }}
        onOpenNovaReceitaParaCliente={(client) => {
          setIsClientDetailsOpen(false);
          setIsNovaReceitaOpen(true);
        }}
        onOpenOrderDetails={handleOpenOrderDetails}
        onOpenTransactionDetails={handleOpenTransactionDetails}
        onOpenWhatsAppChat={handleOpenWhatsAppChat}
      />

      {/* Modal Detalhes do Produto */}
      <ModalDetalhesProduto
        product={selectedProductForDetails}
        isOpen={isProductDetailsOpen}
        onClose={() => {
          setIsProductDetailsOpen(false);
          setSelectedProductForDetails(null);
        }}
        orders={orders}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleInternal={handleToggleProductInternal}
        onDuplicateProduct={handleDuplicateProduct}
        onOpenCatalogPreview={() => {
          setIsProductDetailsOpen(false);
          setIsCatalogPreviewOpen(true);
        }}
        onOpenNovoPedidoComProduto={(product) => {
          setIsProductDetailsOpen(false);
          setIsNovoPedidoOpen(true);
        }}
        onOpenOrderDetails={handleOpenOrderDetails}
      />

      {/* Modal Detalhes da Transação Financeira */}
      <ModalDetalhesTransacao
        transaction={selectedTransactionForDetails}
        isOpen={isTransactionDetailsOpen}
        onClose={() => {
          setIsTransactionDetailsOpen(false);
          setSelectedTransactionForDetails(null);
        }}
        clients={clients}
        orders={orders}
        onUpdateTransaction={handleUpdateTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onToggleStatus={handleToggleTransactionStatus}
        onDuplicateTransaction={handleDuplicateTransaction}
        onOpenClientDetails={(client) => {
          setIsTransactionDetailsOpen(false);
          handleOpenClientDetails(client);
        }}
        onOpenOrderDetails={(order) => {
          setIsTransactionDetailsOpen(false);
          handleOpenOrderDetails(order);
        }}
      />

      {/* Modal WhatsApp Chat (Evolution API Integration) */}
      <ModalWhatsAppChat
        isOpen={isWhatsAppChatOpen}
        onClose={() => setIsWhatsAppChatOpen(false)}
        clientName={whatsAppChatParams.clientName}
        clientPhone={whatsAppChatParams.clientPhone}
        initialMessage={whatsAppChatParams.initialMessage}
        orderCode={whatsAppChatParams.orderCode}
        quoteNumber={whatsAppChatParams.quoteNumber}
      />
    </div>
  );
}
