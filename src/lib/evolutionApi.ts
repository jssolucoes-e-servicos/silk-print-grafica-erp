import { EvolutionConfig, WhatsAppChatMessage, EvolutionConnectionState } from '../types';

const EVOLUTION_CONFIG_STORAGE_KEY = 'smartgraph_evolution_api_config';
const EVOLUTION_CHAT_STORAGE_KEY = 'smartgraph_evolution_chat_history';

// Default initial config - empty by default so user configures real VPS
export const DEFAULT_EVOLUTION_CONFIG: EvolutionConfig = {
  apiUrl: '',
  instanceName: '',
  apiKey: '',
  status: 'disconnected',
  phoneNumber: '',
  profileName: '',
  lastChecked: undefined,
  autoSync: true,
  webhookUrl: '',
};

// Initial seed chat messages for demo reference
const SEED_MESSAGES: Record<string, WhatsAppChatMessage[]> = {
  '5511987654321': [
    {
      id: 'seed-1',
      remoteJid: '5511987654321',
      clientName: 'Ana Paula Souza',
      fromMe: false,
      text: 'Olá! Gostaria de saber se o meu pedido dos Cartões de Visita já está pronto?',
      timestamp: '10:24',
      status: 'read',
      orderCode: 'PED-1001',
    },
    {
      id: 'seed-2',
      remoteJid: '5511987654321',
      clientName: 'Ana Paula Souza',
      fromMe: true,
      text: 'Olá, Ana Paula! 📦 Seu pedido *PED-1001* (1.000 Cartões de Visita Couché 300g com Verniz Localizado) está pronto para retirada em nosso balcão!',
      timestamp: '10:26',
      status: 'read',
      orderCode: 'PED-1001',
    },
    {
      id: 'seed-3',
      remoteJid: '5511987654321',
      clientName: 'Ana Paula Souza',
      fromMe: false,
      text: 'Perfeito! Vou passar hoje à tarde para retirar. Muito obrigada!',
      timestamp: '10:28',
      status: 'read',
      orderCode: 'PED-1001',
    },
  ],
  '5511976543210': [
    {
      id: 'seed-4',
      remoteJid: '5511976543210',
      clientName: 'Carlos Eduardo Silva',
      fromMe: true,
      text: 'Olá, Carlos! 📋 Segue o orçamento *ORC-2024-002* para 200 Cardápios Plastificados no valor de *R$ 580,00*. Validade: 10 dias.',
      timestamp: 'Ontem 14:15',
      status: 'read',
      quoteNumber: 'ORC-2024-002',
    },
    {
      id: 'seed-5',
      remoteJid: '5511976543210',
      clientName: 'Carlos Eduardo Silva',
      fromMe: false,
      text: 'Show! Orçamento aprovado. Pode rodar a produção!',
      timestamp: 'Ontem 14:40',
      status: 'read',
    },
  ],
};

/**
 * Load Evolution API configuration from localStorage
 */
export function getEvolutionConfig(): EvolutionConfig {
  try {
    const saved = localStorage.getItem(EVOLUTION_CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_EVOLUTION_CONFIG, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Error loading Evolution API config:', err);
  }
  return DEFAULT_EVOLUTION_CONFIG;
}

/**
 * Save Evolution API configuration to localStorage
 */
export function saveEvolutionConfig(config: EvolutionConfig): void {
  try {
    localStorage.setItem(EVOLUTION_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving Evolution API config:', err);
  }
}

/**
 * Format raw phone number into standard international format without symbols
 * Ex: "(11) 98765-4321" -> "5511987654321"
 */
export function formatToWhatsAppJid(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

/**
 * Test Evolution API connection with current credentials via Real Server Proxy
 */
export async function testEvolutionConnection(
  config: EvolutionConfig
): Promise<{
  success: boolean;
  state: EvolutionConnectionState;
  message: string;
  latencyMs?: number;
  httpStatus?: number;
  data?: any;
}> {
  const cleanUrl = config.apiUrl.trim();
  const instance = config.instanceName.trim();
  const token = config.apiKey.trim();

  if (!cleanUrl) {
    return {
      success: false,
      state: 'disconnected',
      message: 'Informe a URL da API Evolution na VPS (ex: https://evo.meudominio.com.br ou http://ip:8080).',
    };
  }

  if (!instance) {
    return {
      success: false,
      state: 'disconnected',
      message: 'Informe o Nome da Instância da Evolution API.',
    };
  }

  if (!token) {
    return {
      success: false,
      state: 'disconnected',
      message: 'Informe a Global API Key ou o Token da instância da Evolution API.',
    };
  }

  try {
    // Real call via Backend Express Proxy to bypass CORS and get raw diagnostic
    const response = await fetch('/api/evolution/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: cleanUrl,
        instanceName: instance,
        apiKey: token,
      }),
    });

    const result = await response.json();

    return {
      success: result.success === true,
      state: result.state || (result.success ? 'open' : 'disconnected'),
      message: result.message || (result.success ? 'Instância conectada!' : 'Falha na conexão.'),
      latencyMs: result.latencyMs,
      httpStatus: result.httpStatus || response.status,
      data: result.data,
    };
  } catch (err: any) {
    console.error('Error contacting Evolution test endpoint:', err);
    return {
      success: false,
      state: 'disconnected',
      message: `Erro interno ao executar teste de conexão: ${err.message || 'Falha de rede'}`,
    };
  }
}

/**
 * Request real QR Code or Pairing Code from Evolution API via Server Proxy
 */
export async function getEvolutionQrCode(
  config: EvolutionConfig
): Promise<{ success: boolean; qrcode?: string; pairingCode?: string; message: string; data?: any }> {
  const cleanUrl = config.apiUrl.trim();
  const instance = config.instanceName.trim();
  const token = config.apiKey.trim();

  if (!cleanUrl || !instance) {
    return {
      success: false,
      message: 'Preencha a URL da VPS e o Nome da Instância para solicitar o QR Code.',
    };
  }

  try {
    const response = await fetch('/api/evolution/get-qrcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: cleanUrl,
        instanceName: instance,
        apiKey: token,
      }),
    });

    const result = await response.json();

    return {
      success: result.success === true,
      qrcode: result.qrcode,
      pairingCode: result.pairingCode,
      message: result.message || (result.success ? 'QR Code gerado!' : 'Não foi possível obter o QR Code.'),
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha na requisição de QR Code: ${err.message || 'Erro de rede'}`,
    };
  }
}

/**
 * Restart Evolution API instance on VPS
 */
export async function restartEvolutionInstance(
  config: EvolutionConfig
): Promise<{ success: boolean; message: string; data?: any }> {
  const cleanUrl = config.apiUrl.trim();
  const instance = config.instanceName.trim();
  const token = config.apiKey.trim();

  if (!cleanUrl || !instance) {
    return {
      success: false,
      message: 'Preencha a URL e Nome da Instância para reiniciar.',
    };
  }

  try {
    const response = await fetch('/api/evolution/restart-instance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: cleanUrl,
        instanceName: instance,
        apiKey: token,
      }),
    });

    const result = await response.json();
    return {
      success: result.success === true,
      message: result.message || 'Comando executado.',
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao enviar comando de reinício para a VPS: ${err.message || 'Erro de rede'}`,
    };
  }
}

/**
 * Send real WhatsApp text message via Evolution API
 */
export async function sendEvolutionTextMessage(
  config: EvolutionConfig,
  recipientPhone: string,
  messageText: string,
  extra?: { clientName?: string; orderCode?: string; quoteNumber?: string }
): Promise<{ success: boolean; message: WhatsAppChatMessage; error?: string }> {
  const cleanPhone = formatToWhatsAppJid(recipientPhone);
  const cleanUrl = config.apiUrl.trim();
  const instance = config.instanceName.trim();
  const token = config.apiKey.trim();

  const localMsg: WhatsAppChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    remoteJid: cleanPhone,
    clientName: extra?.clientName,
    fromMe: true,
    text: messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent',
    orderCode: extra?.orderCode,
    quoteNumber: extra?.quoteNumber,
  };

  // If credentials are not configured, warn immediately
  if (!cleanUrl || !instance || !token) {
    // Save to local storage for reference
    saveChatMessageToStorage(cleanPhone, localMsg);
    return {
      success: false,
      message: localMsg,
      error: 'Evolution API não configurada. Configure a URL, Instância e Token na aba Integrações.',
    };
  }

  try {
    const response = await fetch('/api/evolution/send-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiUrl: cleanUrl,
        instanceName: instance,
        apiKey: token,
        number: cleanPhone,
        text: messageText,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      localMsg.id = result.messageId || localMsg.id;
      localMsg.status = 'delivered';
      saveChatMessageToStorage(cleanPhone, localMsg);
      return {
        success: true,
        message: localMsg,
      };
    } else {
      localMsg.status = 'sent';
      saveChatMessageToStorage(cleanPhone, localMsg);
      return {
        success: false,
        message: localMsg,
        error: result.error || `Erro HTTP ${response.status} ao disparar mensagem na VPS.`,
      };
    }
  } catch (err: any) {
    saveChatMessageToStorage(cleanPhone, localMsg);
    return {
      success: false,
      message: localMsg,
      error: `Falha de rede ao contatar servidor de envio: ${err.message}`,
    };
  }
}

/**
 * Get all chat messages for a specific phone number
 */
export function getChatMessagesForPhone(phone: string): WhatsAppChatMessage[] {
  const cleanPhone = formatToWhatsAppJid(phone);
  try {
    const raw = localStorage.getItem(EVOLUTION_CHAT_STORAGE_KEY);
    const store: Record<string, WhatsAppChatMessage[]> = raw ? JSON.parse(raw) : {};

    if (store[cleanPhone] && store[cleanPhone].length > 0) {
      return store[cleanPhone];
    }

    if (SEED_MESSAGES[cleanPhone]) {
      return SEED_MESSAGES[cleanPhone];
    }
  } catch (err) {
    console.error('Error fetching chat history:', err);
  }

  return [];
}

/**
 * Save chat message to persistent store
 */
export function saveChatMessageToStorage(phone: string, msg: WhatsAppChatMessage): void {
  const cleanPhone = formatToWhatsAppJid(phone);
  try {
    const raw = localStorage.getItem(EVOLUTION_CHAT_STORAGE_KEY);
    const store: Record<string, WhatsAppChatMessage[]> = raw ? JSON.parse(raw) : { ...SEED_MESSAGES };

    if (!store[cleanPhone]) {
      store[cleanPhone] = SEED_MESSAGES[cleanPhone] ? [...SEED_MESSAGES[cleanPhone]] : [];
    }

    store[cleanPhone].push(msg);
    localStorage.setItem(EVOLUTION_CHAT_STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('Error saving chat message to storage:', err);
  }
}

/**
 * Update a specific message in storage (e.g. update status to delivered or read)
 */
export function updateChatMessageInStorage(
  phone: string,
  messageId: string,
  patch: Partial<WhatsAppChatMessage>
): void {
  const cleanPhone = formatToWhatsAppJid(phone);
  try {
    const raw = localStorage.getItem(EVOLUTION_CHAT_STORAGE_KEY);
    const store: Record<string, WhatsAppChatMessage[]> = raw ? JSON.parse(raw) : {};

    if (store[cleanPhone]) {
      store[cleanPhone] = store[cleanPhone].map((m) =>
        m.id === messageId ? { ...m, ...patch } : m
      );
      localStorage.setItem(EVOLUTION_CHAT_STORAGE_KEY, JSON.stringify(store));
    }
  } catch (err) {
    console.error('Error updating chat message:', err);
  }
}
