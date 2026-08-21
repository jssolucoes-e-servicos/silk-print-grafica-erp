import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  SidebarMode,
  Client,
  Order,
  OrderStatus,
  Quote,
  QuoteItem,
  Transaction,
  CatalogProduct,
  FinishingItem,
} from './types';
import {
  INITIAL_CLIENTS,
  INITIAL_ORDERS,
  INITIAL_QUOTES,
  INITIAL_TRANSACTIONS,
  CATALOG_PRODUCTS,
} from './data/mockData';

// Components
import { SidebarAdmin } from './components/SidebarAdmin';
import { SidebarGestao } from './components/SidebarGestao';
import { TopHeader } from './components/TopHeader';

// Modals
import { ModalNovaReceita } from './components/modals/ModalNovaReceita';
import { ModalNovaDespesa } from './components/modals/ModalNovaDespesa';
import { ModalNovoCliente } from './components/modals/ModalNovoCliente';
import { ModalAdicionarItem } from './components/modals/ModalAdicionarItem';
import { ModalNovoPedido } from './components/modals/ModalNovoPedido';
import { ModalUpgrade } from './components/modals/ModalUpgrade';
import { ModalTutoriais } from './components/modals/ModalTutoriais';
import { ModalCatalogoPreview } from './components/modals/ModalCatalogoPreview';

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
import { AcabamentosScreen } from './components/screens/AcabamentosScreen';
import { AgendaScreen } from './components/screens/AgendaScreen';
import { PedidosOnlineScreen } from './components/screens/PedidosOnlineScreen';
import { DeclaracaoConteudoScreen } from './components/screens/DeclaracaoConteudoScreen';
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

  const handleSaveClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    setLastCreatedClientId(newClient.id);
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
          />
        ) : (
          <SidebarGestao
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            ordersCount={orders.length}
            quotesCount={quotes.length}
            clientsCount={clients.length}
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
              />
            ) : (
              <SidebarGestao
                currentRoute={currentRoute}
                onNavigate={handleNavigate}
                ordersCount={orders.length}
                quotesCount={quotes.length}
                clientsCount={clients.length}
              />
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090b]">
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
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              onOpenTutoriaisModal={() => setIsTutoriaisModalOpen(true)}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onNavigateToGestao={() => handleNavigate('visao-geral', 'gestao')}
              onNavigateToProdutos={() => handleNavigate('produtos', 'admin')}
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
            />
          )}

          {currentRoute === 'clientes' && (
            <ClientesScreen
              clients={clients}
              onOpenNovoClienteModal={() => setIsNovoClienteOpen(true)}
              onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
            />
          )}

          {currentRoute === 'orcamentos' && (
            <OrcamentosListScreen
              quotes={quotes}
              onNavigateToNovoOrcamento={() => handleNavigate('novo-orcamento', 'gestao')}
              onConvertToOrder={handleConvertQuoteToOrder}
            />
          )}

          {currentRoute === 'pedidos' && (
            <PedidosListScreen
              orders={orders}
              onOpenNovoPedido={() => setIsNovoPedidoOpen(true)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {currentRoute === 'financeiro' && (
            <FinanceiroScreen
              transactions={transactions}
              onOpenNovaReceita={() => setIsNovaReceitaOpen(true)}
              onOpenNovaDespesa={() => setIsNovaDespesaOpen(true)}
              onOpenRelatorio={() => handleNavigate('relatorios', 'gestao')}
            />
          )}

          {/* Admin: Produtos do Catálogo / E-commerce */}
          {currentRoute === 'produtos' && (
            <CatalogoEcommerceProdutosScreen
              products={products}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* Gestão: Produtos Internos */}
          {currentRoute === 'produtos-internos' && (
            <ProdutosScreen
              products={products}
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onAddProduct={handleAddProduct}
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
          {currentRoute === 'precificacao' && <PrecificacaoScreen />}

          {/* Admin: Métricas */}
          {currentRoute === 'metricas' && (
            <MetricasScreen orders={orders} products={products} />
          )}

          {/* Admin: Exportar */}
          {currentRoute === 'exportar' && (
            <ExportarScreen
              clients={clients}
              orders={orders}
              products={products}
              transactions={transactions}
            />
          )}

          {/* Admin: Aparência */}
          {currentRoute === 'aparencia' && (
            <AparenciaScreen
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          )}

          {/* Admin: Configurações */}
          {currentRoute === 'configuracoes' && (
            <ConfiguracoesScreen
              onOpenCatalogPreview={() => setIsCatalogPreviewOpen(true)}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          )}

          {/* Admin: Pagamentos */}
          {currentRoute === 'pagamentos' && <PagamentosScreen />}

          {/* Admin: Integrações */}
          {currentRoute === 'integracoes' && <IntegracoesScreen />}

          {/* Admin: Funcionários */}
          {currentRoute === 'funcionarios' && <FuncionariosScreen />}

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
            <DeclaracaoConteudoScreen
              clients={clients}
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
    </div>
  );
}
