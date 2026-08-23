import { N8nConfig, N8nEventLog } from '../types';

const N8N_CONFIG_STORAGE_KEY = 'smartgraph_n8n_config';

export const DEFAULT_N8N_CONFIG: N8nConfig = {
  baseUrl: '',
  apiKey: '',
  webhookOrderCreated: '',
  webhookStatusChanged: '',
  webhookQuoteCreated: '',
  webhookFinancialAlert: '',
  status: 'disconnected',
  enabledTriggers: {
    orderCreated: true,
    statusChanged: true,
    quoteCreated: true,
    financialAlert: true,
  },
};

export function getStoredN8nConfig(): N8nConfig {
  try {
    const saved = localStorage.getItem(N8N_CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_N8N_CONFIG, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Error loading stored n8n config:', err);
  }
  return DEFAULT_N8N_CONFIG;
}

export function saveStoredN8nConfig(config: N8nConfig): void {
  try {
    localStorage.setItem(N8N_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving stored n8n config:', err);
  }
}

/**
 * Fetch current n8n config from backend
 */
export async function fetchN8nConfig(): Promise<N8nConfig> {
  try {
    const res = await fetch('/api/n8n/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching n8n config:', err);
  }
  return getStoredN8nConfig();
}

/**
 * Test n8n Webhook / Instance Connection
 */
export async function testN8nConnection(config: N8nConfig, testWebhookUrl?: string): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  httpStatus?: number;
}> {
  try {
    const res = await fetch('/api/n8n/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        testUrl: testWebhookUrl || config.webhookOrderCreated || config.baseUrl,
      }),
    });
    const result = await res.json();
    if (result.success) {
      saveStoredN8nConfig({
        ...config,
        status: 'connected',
        lastChecked: new Date().toISOString(),
      });
    }
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao testar n8n: ${err.message || 'Falha de rede'}`,
      latencyMs: 0,
    };
  }
}

/**
 * Fetch logs of recent n8n event dispatches
 */
export async function fetchN8nLogs(): Promise<N8nEventLog[]> {
  try {
    const res = await fetch('/api/n8n/logs');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error fetching n8n logs:', err);
  }
  return [];
}

/**
 * Trigger manual test event to n8n
 */
export async function triggerN8nEvent(
  eventType: 'order.created' | 'order.status_changed' | 'quote.created' | 'financial.alert',
  payload: any
): Promise<{ success: boolean; message: string; httpStatus?: number }> {
  try {
    const res = await fetch('/api/n8n/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, payload }),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao disparar evento: ${err.message}`,
    };
  }
}
