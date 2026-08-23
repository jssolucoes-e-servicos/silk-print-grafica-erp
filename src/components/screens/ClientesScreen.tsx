import React, { useState } from 'react';
import {
  Search,
  Plus,
  MessageCircle,
  Mail,
  MapPin,
  FileText,
  Eye,
  ChevronRight,
  Package,
  DollarSign,
  User,
} from 'lucide-react';
import { Client } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface ClientesScreenProps {
  clients: Client[];
  onOpenNovoClienteModal: () => void;
  onNavigateToNovoOrcamento: () => void;
  onOpenClientDetails?: (client: Client) => void;
  onOpenWhatsAppChat?: (params: { clientName: string; clientPhone: string; initialMessage?: string }) => void;
}

export const ClientesScreen: React.FC<ClientesScreenProps> = ({
  clients,
  onOpenNovoClienteModal,
  onNavigateToNovoOrcamento,
  onOpenClientDetails,
  onOpenWhatsAppChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.whatsapp.includes(term) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.cpfCnpj && c.cpfCnpj.includes(term))
    );
  });

  const totalGastoGeral = clients.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const totalPedidosGeral = clients.reduce((acc, c) => acc + (c.ordersCount || 0), 0);

  return (
    <div id="screen-clientes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Clientes
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie sua base de clientes, visualize fichas completas, histórico e ações rápidas
          </p>
        </div>

        <button
          onClick={onOpenNovoClienteModal}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Novo Cliente</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Total de Clientes</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{clients.length}</div>
        </div>

        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Pedidos Acumulados</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{totalPedidosGeral}</div>
        </div>

        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Faturamento da Base</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrency(totalGastoGeral)}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, WhatsApp, e-mail ou documento..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Content: Empty State or Table */}
      {clients.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <User className="w-12 h-12 text-zinc-600 stroke-[1.2]" />
          <p className="text-sm text-zinc-400 font-medium">Nenhum cliente cadastrado</p>
          <button
            onClick={onOpenNovoClienteModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Cadastrar Primeiro Cliente</span>
          </button>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 font-semibold border-b border-zinc-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 hidden md:table-cell">E-mail / Doc</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Endereço</th>
                  <th className="py-3 px-4 text-center">Pedidos</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500">
                      Nenhum cliente corresponde à busca.
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => onOpenClientDetails?.(client)}
                      className="hover:bg-zinc-800/50 cursor-pointer transition-all group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              <span>{client.name}</span>
                              {client.ordersCount >= 3 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  VIP
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {client.createdAt ? `Desde ${formatDate(client.createdAt)}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenWhatsAppChat) {
                              onOpenWhatsAppChat({
                                clientName: client.name,
                                clientPhone: client.whatsapp,
                              });
                            } else {
                              window.open(`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}`, '_blank');
                            }
                          }}
                          className="text-emerald-400 hover:text-emerald-300 hover:underline inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{client.whatsapp}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell text-zinc-400">
                        <div>{client.email || '—'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{client.cpfCnpj || ''}</div>
                      </td>
                      <td className="py-3.5 px-4 hidden lg:table-cell text-zinc-400 text-[11px] max-w-[200px] truncate">
                        {client.endereco ? `${client.endereco}, ${client.numero || 'S/N'} - ${client.cidade || ''}/${client.estado || ''}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-zinc-200">
                        {client.ordersCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(client.totalSpent)}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenClientDetails?.(client)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-300 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Visualizar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
