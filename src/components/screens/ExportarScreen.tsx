import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Check,
  Calendar,
} from 'lucide-react';
import { Client, Order, CatalogProduct, Transaction } from '../../types';

interface ExportarScreenProps {
  clients: Client[];
  orders: Order[];
  products: CatalogProduct[];
  transactions: Transaction[];
}

export const ExportarScreen: React.FC<ExportarScreenProps> = ({
  clients,
  orders,
  products,
  transactions,
}) => {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const exportCSV = (type: string, data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((obj) =>
      Object.values(obj)
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(type);
    setTimeout(() => setDownloaded(null), 3000);
  };

  return (
    <div id="screen-exportar" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
          Exportar Dados
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
          Baixe relatórios estruturados em formato CSV ou JSON para planilhas e contabilidade
        </p>
      </div>

      {downloaded && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Exportação de {downloaded} concluída com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export Pedidos */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-md">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Pedidos ({orders.length})</h3>
            <p className="text-xs text-zinc-400">
              Códigos, valores, status de entrega, datas e clientes vinculados.
            </p>
          </div>
          <button
            onClick={() => exportCSV('Pedidos', orders, 'pedidos-silkprint')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>

        {/* Export Clientes */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-md">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Clientes ({clients.length})</h3>
            <p className="text-xs text-zinc-400">
              Nomes, telefones WhatsApp, CPFs e endereços cadastrados.
            </p>
          </div>
          <button
            onClick={() => exportCSV('Clientes', clients, 'clientes-silkprint')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>

        {/* Export Financeiro */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-md">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">
              Financeiro ({transactions.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Lançamentos de receitas, despesas, métodos de pagamento e datas.
            </p>
          </div>
          <button
            onClick={() => exportCSV('Financeiro', transactions, 'financeiro-silkprint')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>

        {/* Export Produtos Catálogo */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-md">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">
              Produtos & Kits ({products.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Tabela de itens do catálogo com categorias e preços unitários.
            </p>
          </div>
          <button
            onClick={() => exportCSV('Produtos', products, 'catalogo-produtos')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
