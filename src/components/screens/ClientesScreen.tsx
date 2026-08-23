import React, { useState } from 'react';
import {
  Search,
  Plus,
  MessageCircle,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import { Client } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface ClientesScreenProps {
  clients: Client[];
  onOpenNovoClienteModal: () => void;
  onNavigateToNovoOrcamento: () => void;
}

export const ClientesScreen: React.FC<ClientesScreenProps> = ({
  clients,
  onOpenNovoClienteModal,
  onNavigateToNovoOrcamento,
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

  return (
    <div id="screen-clientes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Clientes
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie sua base de clientes
          </p>
        </div>

        <button
          onClick={onOpenNovoClienteModal}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, WhatsApp ou e-mail..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-900/90 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Content: Empty State or Table */}
      {clients.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-12 text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
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
                  <th className="py-3 px-4 text-right">Ação</th>
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
                    <tr key={client.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-100">{client.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          {client.createdAt ? `Desde ${formatDate(client.createdAt)}` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <a
                          href={`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{client.whatsapp}</span>
                        </a>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-zinc-400">
                        <div>{client.email || '—'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{client.cpfCnpj || ''}</div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-zinc-400 text-[11px] max-w-[200px] truncate">
                        {client.endereco ? `${client.endereco}, ${client.numero || 'S/N'} - ${client.cidade || ''}/${client.estado || ''}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-zinc-200">
                        {client.ordersCount}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-blue-400">
                        {formatCurrency(client.totalSpent)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={onNavigateToNovoOrcamento}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-blue-500 hover:text-white text-zinc-300 text-[11px] font-semibold rounded-md transition-colors"
                        >
                          + Orçamento
                        </button>
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
