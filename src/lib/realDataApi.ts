import {
  Client,
  Order,
  OrderStatus,
  OrderMessage,
  Quote,
  Transaction,
  CatalogProduct,
  FinishingItem,
  AccessProfile,
  UserEmployee,
} from '../types';

// ==========================================
// CLIENTS API
// ==========================================

export async function fetchClients(): Promise<Client[]> {
  try {
    const res = await fetch('/api/clientes');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching clients:', err);
  }
  return [];
}

export async function createClient(clientData: Partial<Client>): Promise<Client> {
  const res = await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar cliente');
  return await res.json();
}

export async function updateClient(client: Client): Promise<Client> {
  const res = await fetch(`/api/clientes/${client.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client),
  });
  if (!res.ok) throw new Error('Falha ao atualizar cliente');
  return await res.json();
}

export async function deleteClient(id: string): Promise<boolean> {
  const res = await fetch(`/api/clientes/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// ORDERS API
// ==========================================

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch('/api/pedidos');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
  }
  return [];
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const res = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Falha ao criar pedido');
  return await res.json();
}

export async function updateOrder(order: Order): Promise<Order> {
  const res = await fetch(`/api/pedidos/${order.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Falha ao atualizar pedido');
  return await res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> {
  const res = await fetch(`/api/pedidos/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar status do pedido');
  return await res.json();
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: 'pago' | 'pendente' | 'parcial',
  paidAmount?: number
): Promise<Order> {
  const res = await fetch(`/api/pedidos/${orderId}/pagamento`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentStatus, paidAmount }),
  });
  if (!res.ok) throw new Error('Falha ao atualizar pagamento do pedido');
  return await res.json();
}

export async function addOrderMessage(
  orderId: string,
  message: OrderMessage
): Promise<Order> {
  const res = await fetch(`/api/pedidos/${orderId}/mensagens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error('Falha ao adicionar mensagem no pedido');
  return await res.json();
}

export async function deleteOrder(id: string): Promise<boolean> {
  const res = await fetch(`/api/pedidos/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// QUOTES API
// ==========================================

export async function fetchQuotes(): Promise<Quote[]> {
  try {
    const res = await fetch('/api/orcamentos');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching quotes:', err);
  }
  return [];
}

export async function createQuote(quoteData: Partial<Quote>): Promise<Quote> {
  const res = await fetch('/api/orcamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData),
  });
  if (!res.ok) throw new Error('Falha ao gerar orçamento');
  return await res.json();
}

export async function updateQuote(quote: Quote): Promise<Quote> {
  const res = await fetch(`/api/orcamentos/${quote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote),
  });
  if (!res.ok) throw new Error('Falha ao atualizar orçamento');
  return await res.json();
}

export async function deleteQuote(id: string): Promise<boolean> {
  const res = await fetch(`/api/orcamentos/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// PRODUCTS API
// ==========================================

export async function fetchProducts(): Promise<CatalogProduct[]> {
  try {
    const res = await fetch('/api/produtos');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
  return [];
}

export async function createProduct(product: Partial<CatalogProduct>): Promise<CatalogProduct> {
  const res = await fetch('/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Falha ao criar produto');
  return await res.json();
}

export async function updateProduct(product: CatalogProduct): Promise<CatalogProduct> {
  const res = await fetch(`/api/produtos/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Falha ao atualizar produto');
  return await res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`/api/produtos/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// FINISHINGS API
// ==========================================

export async function fetchFinishings(): Promise<FinishingItem[]> {
  try {
    const res = await fetch('/api/acabamentos');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching finishings:', err);
  }
  return [];
}

export async function createFinishing(finishing: Partial<FinishingItem>): Promise<FinishingItem> {
  const res = await fetch('/api/acabamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finishing),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar acabamento');
  return await res.json();
}

export async function updateFinishing(finishing: FinishingItem): Promise<FinishingItem> {
  const res = await fetch(`/api/acabamentos/${finishing.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(finishing),
  });
  if (!res.ok) throw new Error('Falha ao atualizar acabamento');
  return await res.json();
}

export async function deleteFinishing(id: string): Promise<boolean> {
  const res = await fetch(`/api/acabamentos/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// TRANSACTIONS (FINANCEIRO) API
// ==========================================

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch('/api/financeiro/transacoes');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching transactions:', err);
  }
  return [];
}

export async function createTransaction(txData: Partial<Transaction>): Promise<Transaction> {
  const res = await fetch('/api/financeiro/transacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(txData),
  });
  if (!res.ok) throw new Error('Falha ao registrar transação financeira');
  return await res.json();
}

export async function updateTransaction(tx: Transaction): Promise<Transaction> {
  const res = await fetch(`/api/financeiro/transacoes/${tx.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tx),
  });
  if (!res.ok) throw new Error('Falha ao atualizar transação financeira');
  return await res.json();
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const res = await fetch(`/api/financeiro/transacoes/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// EMPLOYEES & ACCESS PROFILES API
// ==========================================

export async function fetchEmployees(): Promise<UserEmployee[]> {
  try {
    const res = await fetch('/api/usuarios');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
  return [];
}

export async function createEmployee(emp: Partial<UserEmployee>): Promise<UserEmployee> {
  const res = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp),
  });
  if (!res.ok) throw new Error('Falha ao cadastrar colaborador');
  return await res.json();
}

export async function updateEmployee(emp: UserEmployee): Promise<UserEmployee> {
  const res = await fetch(`/api/usuarios/${emp.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp),
  });
  if (!res.ok) throw new Error('Falha ao atualizar colaborador');
  return await res.json();
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function fetchAccessProfiles(): Promise<AccessProfile[]> {
  try {
    const res = await fetch('/api/perfis');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching access profiles:', err);
  }
  return [];
}

export async function createAccessProfile(prof: Partial<AccessProfile>): Promise<AccessProfile> {
  const res = await fetch('/api/perfis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof),
  });
  if (!res.ok) throw new Error('Falha ao criar perfil de acesso');
  return await res.json();
}

export async function updateAccessProfile(prof: AccessProfile): Promise<AccessProfile> {
  const res = await fetch(`/api/perfis/${prof.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof),
  });
  if (!res.ok) throw new Error('Falha ao atualizar perfil');
  return await res.json();
}

export async function deleteAccessProfile(id: string): Promise<boolean> {
  const res = await fetch(`/api/perfis/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ==========================================
// AUTHENTICATION & SESSION MANAGEMENT
// ==========================================

const AUTH_TOKEN_KEY = 'silkprint_auth_token';
const AUTH_USER_KEY = 'silkprint_auth_user';

export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuth(token: string, user: any) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function getStoredAuthUser(): any | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginApi(email: string, password: string): Promise<{
  success: boolean;
  token?: string;
  user?: UserEmployee;
  assignedProfiles?: AccessProfile[];
  allowedScreens?: string[];
  isAdmin?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setStoredAuth(data.token, data.user);
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro ao comunicar com o servidor' };
  }
}

export async function fetchCurrentUserProfile(): Promise<{
  user: UserEmployee;
  assignedProfiles: AccessProfile[];
  allowedScreens: string[];
  isAdmin: boolean;
} | null> {
  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching current user profile:', err);
  }
  return null;
}

export async function logoutApi(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // ignore
  } finally {
    clearStoredAuth();
  }
}

export async function cleanProductionDatabaseApi(): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch('/api/auth/clean-production', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return await res.json();
}

// ==========================================
// SYSTEM DATA ENGINE & PRODUCTION UTILS
// ==========================================

export async function fetchRealDataStatus(): Promise<{
  isRealDataOnly: boolean;
  clientsCount: number;
  ordersCount: number;
  quotesCount: number;
  transactionsCount: number;
  productsCount: number;
  finishingsCount: number;
  employeesCount: number;
  profilesCount: number;
  lastUpdated: string;
  postgresConnected: boolean;
}> {
  try {
    const res = await fetch('/api/dados/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching real data status:', err);
  }
  return {
    isRealDataOnly: false,
    clientsCount: 0,
    ordersCount: 0,
    quotesCount: 0,
    transactionsCount: 0,
    productsCount: 0,
    finishingsCount: 0,
    employeesCount: 0,
    profilesCount: 0,
    lastUpdated: new Date().toISOString(),
    postgresConnected: false,
  };
}

export async function clearDemoDataAndStartFresh(): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch('/api/dados/limpar-demonstracao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

export async function syncAllToPostgresDatabase(): Promise<{
  success: boolean;
  message: string;
  counts?: any;
}> {
  const res = await fetch('/api/dados/sincronizar-postgres', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}
