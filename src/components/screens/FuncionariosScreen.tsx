import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Lock,
  Mail,
  Check,
  Sparkles,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Vendedor' | 'Produção' | 'Designer';
  status: 'Ativo' | 'Pendente';
}

export const FuncionariosScreen: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp-1',
      name: 'Carlos Oliveira (Você)',
      email: 'carlos@silkprint.com.br',
      role: 'Administrador',
      status: 'Ativo',
    },
    {
      id: 'emp-2',
      name: 'Juliana Mendes',
      email: 'juliana.arte@silkprint.com.br',
      role: 'Designer',
      status: 'Ativo',
    },
    {
      id: 'emp-3',
      name: 'Roberto Souza',
      email: 'roberto.impressao@silkprint.com.br',
      role: 'Produção',
      status: 'Ativo',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoCargo, setNovoCargo] = useState<Employee['role']>('Vendedor');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEmail) return;
    setEmployees((prev) => [
      ...prev,
      {
        id: `emp-${Date.now()}`,
        name: novoNome,
        email: novoEmail,
        role: novoCargo,
        status: 'Pendente',
      },
    ]);
    setIsModalOpen(false);
    setNovoNome('');
    setNovoEmail('');
  };

  const handleRemove = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div id="screen-funcionarios" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Equipe & Permissões
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie colaboradores que têm acesso ao painel de gestão e catálogo
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Convidar Membro</span>
        </button>
      </div>

      <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="pb-3 pl-2">Membro</th>
                <th className="pb-3">Função</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-bold text-zinc-200 text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-100">{emp.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 text-[10px] font-semibold bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300">
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        emp.status === 'Ativo' ? 'text-emerald-400' : 'text-blue-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Ativo' ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'
                        }`}
                      />
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    {emp.id !== 'emp-1' && (
                      <button
                        onClick={() => handleRemove(emp.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remover membro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Convidar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100">Convidar Novo Membro</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Marina Silva"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="marina@empresa.com"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Cargo / Função</label>
                <select
                  value={novoCargo}
                  onChange={(e) => setNovoCargo(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Vendedor">Vendedor (Orçamentos e Pedidos)</option>
                  <option value="Designer">Designer (Aprovações e Artes)</option>
                  <option value="Produção">Produção (Fila de Impressão)</option>
                  <option value="Administrador">Administrador Geral</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
