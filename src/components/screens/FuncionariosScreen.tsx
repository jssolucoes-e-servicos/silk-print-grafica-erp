import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Lock,
  Mail,
  Check,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle,
  Key,
  Layers,
  ChevronRight,
  Plus,
  X,
  Search,
  CheckSquare,
  Square,
  History,
  Phone,
  Briefcase,
  HelpCircle,
  Unlock,
  Info,
} from 'lucide-react';
import {
  UserEmployee,
  AccessProfile,
  UserCustomPermission,
  SystemScreenDef,
  SystemRoutineDef,
} from '../../types';
import {
  SYSTEM_SCREENS,
  SYSTEM_ROUTINES,
  evaluateUserPermission,
} from '../../lib/permissionsEngine';

interface FuncionariosScreenProps {
  employees: UserEmployee[];
  profiles: AccessProfile[];
  onAddEmployee: (emp: Omit<UserEmployee, 'id' | 'createdAt'>) => void;
  onUpdateEmployee: (emp: UserEmployee) => void;
  onRemoveEmployee: (id: string) => void;
  onOpenProfilesScreen?: () => void;
}

export const FuncionariosScreen: React.FC<FuncionariosScreenProps> = ({
  employees,
  profiles,
  onAddEmployee,
  onUpdateEmployee,
  onRemoveEmployee,
  onOpenProfilesScreen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<UserEmployee | null>(null);

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoWhatsapp, setNovoWhatsapp] = useState('');
  const [novoCargo, setNovoCargo] = useState('');
  const [novoDepartamento, setNovoDepartamento] = useState<UserEmployee['department']>('Comercial');
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>(['prof_comercial']);

  // Permission Drawer / Modal state
  const [activeDrawerTab, setActiveDrawerTab] = useState<'perfis' | 'avulsas' | 'matriz' | 'simulador'>('perfis');

  // Custom Grant Form in Drawer
  const [isGrantFormOpen, setIsGrantFormOpen] = useState(false);
  const [grantCategoryType, setGrantCategoryType] = useState<'screen' | 'routine'>('routine');
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [grantDurationType, setGrantDurationType] = useState<'permanente' | '24h' | '7dias' | '30dias' | 'custom'>('7dias');
  const [customExpiresAt, setCustomExpiresAt] = useState('');
  const [grantReason, setGrantReason] = useState('');

  // Simulator State
  const [simPermissionId, setSimPermissionId] = useState(SYSTEM_ROUTINES[0].code);
  const [simType, setSimType] = useState<'screen' | 'routine'>('routine');

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Invite New User
  const handleOpenInvite = () => {
    setNovoNome('');
    setNovoEmail('');
    setNovoWhatsapp('');
    setNovoCargo('');
    setNovoDepartamento('Comercial');
    setSelectedProfileIds(['prof_comercial']);
    setIsInviteModalOpen(true);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim() || !novoEmail.trim()) return;

    onAddEmployee({
      name: novoNome,
      email: novoEmail,
      whatsapp: novoWhatsapp,
      jobTitle: novoCargo || 'Colaborador',
      department: novoDepartamento,
      status: 'Ativo',
      profileIds: selectedProfileIds.length > 0 ? selectedProfileIds : ['prof_comercial'],
      customPermissions: [],
    });

    setIsInviteModalOpen(false);
  };

  // Toggle Profile on User
  const handleToggleUserProfile = (profileId: string) => {
    if (!selectedEmployee) return;

    const currentProfiles = selectedEmployee.profileIds || [];
    let updated: string[];

    if (currentProfiles.includes(profileId)) {
      // Don't allow removing all profiles
      if (currentProfiles.length === 1) {
        alert('O usuário deve ter ao menos 1 perfil ativo.');
        return;
      }
      updated = currentProfiles.filter((id) => id !== profileId);
    } else {
      updated = [...currentProfiles, profileId];
    }

    const updatedEmp = {
      ...selectedEmployee,
      profileIds: updated,
    };
    setSelectedEmployee(updatedEmp);
    onUpdateEmployee(updatedEmp);
  };

  // Add Custom / Temporary Permission
  const handleAddCustomGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedPermissionId) return;

    // Calculate expiration ISO
    let expiresIso: string | null = null;
    const now = new Date();

    if (grantDurationType === '24h') {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      expiresIso = tomorrow.toISOString();
    } else if (grantDurationType === '7dias') {
      const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      expiresIso = week.toISOString();
    } else if (grantDurationType === '30dias') {
      const month = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      expiresIso = month.toISOString();
    } else if (grantDurationType === 'custom' && customExpiresAt) {
      expiresIso = new Date(customExpiresAt).toISOString();
    }

    // Get name of permission
    let permName = selectedPermissionId;
    if (grantCategoryType === 'screen') {
      const s = SYSTEM_SCREENS.find((sc) => sc.id === selectedPermissionId);
      if (s) permName = s.name;
    } else {
      const r = SYSTEM_ROUTINES.find((ro) => ro.code === selectedPermissionId);
      if (r) permName = r.name;
    }

    const newGrant: UserCustomPermission = {
      id: `cust-${Date.now()}`,
      permissionId: selectedPermissionId,
      permissionType: grantCategoryType,
      permissionName: permName,
      grantType: 'allow',
      expiresAt: expiresIso,
      grantedAt: new Date().toISOString(),
      grantedBy: 'Carlos Oliveira (Admin Master)',
      reason: grantReason.trim() || 'Acesso avulso autorizado pelo administrador',
    };

    const updatedEmp: UserEmployee = {
      ...selectedEmployee,
      customPermissions: [
        ...selectedEmployee.customPermissions.filter((p) => p.permissionId !== selectedPermissionId),
        newGrant,
      ],
    };

    setSelectedEmployee(updatedEmp);
    onUpdateEmployee(updatedEmp);
    setIsGrantFormOpen(false);
    setSelectedPermissionId('');
    setGrantReason('');
  };

  // Revoke Custom Permission
  const handleRevokeCustomGrant = (grantId: string) => {
    if (!selectedEmployee) return;

    const updatedEmp: UserEmployee = {
      ...selectedEmployee,
      customPermissions: selectedEmployee.customPermissions.filter((p) => p.id !== grantId),
    };

    setSelectedEmployee(updatedEmp);
    onUpdateEmployee(updatedEmp);
  };

  // Format Expiration Date
  const formatExpiration = (expiresAt: string | null) => {
    if (!expiresAt) {
      return <span className="text-emerald-400 font-semibold">🟢 Permanente</span>;
    }
    const expDate = new Date(expiresAt);
    const isPast = new Date().getTime() > expDate.getTime();

    if (isPast) {
      return <span className="text-rose-400 font-semibold">🔴 Expirado ({expDate.toLocaleDateString('pt-BR')})</span>;
    }

    return (
      <span className="text-amber-400 font-semibold flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Válido até {expDate.toLocaleDateString('pt-BR')} às {expDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </span>
    );
  };

  return (
    <div id="screen-funcionarios" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
                Colaboradores & Gestão de Acessos
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
                Atribua múltiplos perfis ativos por colaborador e conceda permissões avulsas (com ou sem prazo de expiração).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenProfilesScreen && (
            <button
              onClick={onOpenProfilesScreen}
              className="px-3.5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Gerenciar Perfis de Acesso</span>
            </button>
          )}

          <button
            onClick={handleOpenInvite}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>Convidar Colaborador</span>
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar colaborador por nome, cargo, departamento..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Employees Table */}
      <div className="p-4 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="pb-3 pl-2">Colaborador</th>
                <th className="pb-3">Departamento / Cargo</th>
                <th className="pb-3">Perfis Ativos (Multi-Perfil)</th>
                <th className="pb-3">Permissões Avulsas</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredEmployees.map((emp) => {
                const userProfiles = profiles.filter((p) => emp.profileIds?.includes(p.id));
                const activeCustomGrants = emp.customPermissions || [];

                return (
                  <tr key={emp.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-500/30 flex items-center justify-center font-bold text-zinc-100 text-xs shadow-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-100 flex items-center gap-1.5">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                            <span>{emp.email}</span>
                            {emp.whatsapp && <span className="text-zinc-600">• {emp.whatsapp}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Job */}
                    <td className="py-3.5">
                      <div className="font-semibold text-zinc-200">{emp.jobTitle}</div>
                      <div className="text-[11px] text-zinc-500">{emp.department}</div>
                    </td>

                    {/* Assigned Profiles (Multi-profile badges) */}
                    <td className="py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
                        {userProfiles.map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 text-[10px] font-bold rounded-lg border text-white shadow-2xs"
                            style={{
                              backgroundColor: `${p.color}25`,
                              borderColor: `${p.color}60`,
                              color: p.color,
                            }}
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Custom Grants Count */}
                    <td className="py-3.5">
                      {activeCustomGrants.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            {activeCustomGrants.length} avulsa(s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-600">Nenhuma avulsa</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-semibold flex items-center gap-1.5 ${
                          emp.status === 'Ativo' ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'Ativo' ? 'bg-emerald-400' : 'bg-zinc-500'
                          }`}
                        />
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setActiveDrawerTab('perfis');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Gerenciar Acessos</span>
                        </button>

                        {emp.id !== 'emp-1' && (
                          <button
                            onClick={() => onRemoveEmployee(emp.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Remover colaborador"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL / PAINEL DE GESTÃO DE ACESSOS E PERMISSÕES DO COLABORADOR */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-400">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                      {selectedEmployee.name}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-semibold">
                      {selectedEmployee.jobTitle}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Controle de Perfis Ativos, Permissões Avulsas Temporárias e Matriz Consolidada
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setIsGrantFormOpen(false);
                }}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-zinc-800 bg-zinc-900/40 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveDrawerTab('perfis')}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeDrawerTab === 'perfis'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Perfis Ativos ({selectedEmployee.profileIds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('avulsas')}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeDrawerTab === 'avulsas'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Permissões Avulsas & Temporárias ({selectedEmployee.customPermissions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('matriz')}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeDrawerTab === 'matriz'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Matriz Consolidada de Acesso</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDrawerTab('simulador')}
                className={`px-3.5 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeDrawerTab === 'simulador'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulador de Acesso</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              {/* TAB 1: PERFIS ATIVOS (MULTI-PERFIL) */}
              {activeDrawerTab === 'perfis' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-zinc-300 leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Múltiplos Perfis Ativos:</strong> Marque todos os perfis que este usuário desempenha. As permissões de todos os perfis marcados são automaticamente somadas em tempo real.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profiles.map((profile) => {
                      const isAssigned = selectedEmployee.profileIds.includes(profile.id);

                      return (
                        <div
                          key={profile.id}
                          onClick={() => handleToggleUserProfile(profile.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isAssigned
                              ? 'bg-blue-600/15 border-blue-500/50 text-zinc-100 shadow-xs'
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-300'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isAssigned ? (
                              <CheckSquare className="w-4 h-4 text-blue-400" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-600" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-bold text-xs text-zinc-200">
                                {profile.name}
                              </span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                                {profile.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                              {profile.description}
                            </p>
                            <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                              {profile.allowedScreens.length} telas • {profile.allowedRoutines.length} rotinas
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: PERMISSÕES AVULSAS & TEMPORÁRIAS */}
              {activeDrawerTab === 'avulsas' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-200">
                        Permissões Exclusivas do Usuário
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        Conceda acesso a telas ou rotinas que não pertencem a nenhum dos perfis dele (ex: cobrir férias, autorização emergencial com prazo).
                      </p>
                    </div>

                    {!isGrantFormOpen && (
                      <button
                        onClick={() => setIsGrantFormOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Conceder Permissão Avulsa</span>
                      </button>
                    )}
                  </div>

                  {/* FORM TO ADD GRANT */}
                  {isGrantFormOpen && (
                    <form
                      onSubmit={handleAddCustomGrant}
                      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700/80 space-y-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5" />
                          Nova Concessão de Permissão Avulsa
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsGrantFormOpen(false)}
                          className="text-zinc-500 hover:text-zinc-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Type: Screen or Routine */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-300">Tipo de Permissão</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setGrantCategoryType('routine');
                                setSelectedPermissionId('');
                              }}
                              className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                grantCategoryType === 'routine'
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                              }`}
                            >
                              Rotina / Ação Específica
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setGrantCategoryType('screen');
                                setSelectedPermissionId('');
                              }}
                              className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                grantCategoryType === 'screen'
                                  ? 'bg-blue-600 text-white border-blue-500'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                              }`}
                            >
                              Tela do Sistema
                            </button>
                          </div>
                        </div>

                        {/* Permission Select */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-300">
                            {grantCategoryType === 'screen' ? 'Selecione a Tela' : 'Selecione a Rotina'} *
                          </label>
                          <select
                            required
                            value={selectedPermissionId}
                            onChange={(e) => setSelectedPermissionId(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                          >
                            <option value="">-- Escolha --</option>
                            {grantCategoryType === 'screen'
                              ? SYSTEM_SCREENS.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.category} • {s.name}
                                  </option>
                                ))
                              : SYSTEM_ROUTINES.map((r) => (
                                  <option key={r.id} value={r.code}>
                                    {r.category} • {r.name} ({r.dangerLevel.toUpperCase()})
                                  </option>
                                ))}
                          </select>
                        </div>

                        {/* Duration Type */}
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-zinc-300">Prazo / Duração</label>
                          <select
                            value={grantDurationType}
                            onChange={(e) => setGrantDurationType(e.target.value as any)}
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                          >
                            <option value="24h">Temporário: 24 horas</option>
                            <option value="7dias">Temporário: 7 dias (Recomendado para plantão)</option>
                            <option value="30dias">Temporário: 30 dias (Férias)</option>
                            <option value="custom">Data & Hora Personalizada</option>
                            <option value="permanente">Permanente (Sem prazo de expiração)</option>
                          </select>
                        </div>

                        {/* Custom Expiry Input */}
                        {grantDurationType === 'custom' && (
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-300">Data e Hora de Expiração</label>
                            <input
                              type="datetime-local"
                              required
                              value={customExpiresAt}
                              onChange={(e) => setCustomExpiresAt(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                            />
                          </div>
                        )}

                        {/* Reason / Justification */}
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-zinc-300">
                            Motivo / Justificativa da Concessão *
                          </label>
                          <input
                            type="text"
                            required
                            value={grantReason}
                            onChange={(e) => setGrantReason(e.target.value)}
                            placeholder="Ex: Cobertura de férias do gerente comercial, liberado para conceder descontos"
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsGrantFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                          Salvar Permissão Avulsa
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Grants List */}
                  {selectedEmployee.customPermissions.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <Key className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-zinc-400 font-semibold">
                        Este colaborador não possui permissões avulsas configuradas.
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Ele herda estritamente as telas e rotinas definidas em seus perfis ativos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedEmployee.customPermissions.map((grant) => (
                        <div
                          key={grant.id}
                          className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-200">
                                {grant.permissionName}
                              </span>
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                                {grant.permissionType === 'screen' ? 'Tela' : 'Rotina'}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-400">
                              <strong>Motivo:</strong> {grant.reason}
                            </p>

                            <div className="text-[10px] text-zinc-500 flex items-center gap-3">
                              <span>Concedido por: {grant.grantedBy}</span>
                              <span>•</span>
                              <span>{formatExpiration(grant.expiresAt)}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeCustomGrant(grant.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/80 border border-rose-500/30 rounded-lg transition-all cursor-pointer shrink-0"
                          >
                            Revogar Acesso
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MATRIZ CONSOLIDADA DE ACESSO */}
              {activeDrawerTab === 'matriz' && (
                <div className="space-y-4">
                  <div className="text-xs text-zinc-400">
                    Visão auditável de todos os acessos calculados para <strong>{selectedEmployee.name}</strong>, combinando perfis e concessões avulsas.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Telas Consolidadas */}
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        Telas Liberadas
                      </h4>
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                        {SYSTEM_SCREENS.map((s) => {
                          const evalRes = evaluateUserPermission(
                            selectedEmployee,
                            s.id,
                            profiles,
                            'screen'
                          );

                          return (
                            <div
                              key={s.id}
                              className={`p-2 rounded-lg text-[11px] flex items-center justify-between ${
                                evalRes.hasAccess
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                                  : 'bg-zinc-950/40 text-zinc-600'
                              }`}
                            >
                              <span className="font-semibold">{s.name}</span>
                              <span className="text-[9px] font-mono">
                                {evalRes.hasAccess ? 'Liberado' : 'Bloqueado'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rotinas Consolidadas */}
                    <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-400" />
                        Rotinas & Ações
                      </h4>
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                        {SYSTEM_ROUTINES.map((r) => {
                          const evalRes = evaluateUserPermission(
                            selectedEmployee,
                            r.code,
                            profiles,
                            'routine'
                          );

                          return (
                            <div
                              key={r.id}
                              className={`p-2 rounded-lg text-[11px] flex items-center justify-between ${
                                evalRes.hasAccess
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                                  : 'bg-zinc-950/40 text-zinc-600'
                              }`}
                            >
                              <span className="font-semibold">{r.name}</span>
                              <span className="text-[9px] font-mono">
                                {evalRes.hasAccess ? 'Permitido' : 'Restrito'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SIMULADOR DE ACESSO */}
              {activeDrawerTab === 'simulador' && (
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-bold text-zinc-200">
                      Testador em Tempo Real de Permissão
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Selecione qualquer ação ou tela abaixo para inspecionar se <strong>{selectedEmployee.name}</strong> possui autorização e a justificativa calculada pelo motor de segurança.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-1">Rotina / Ação a Testar</label>
                      <select
                        value={simPermissionId}
                        onChange={(e) => setSimPermissionId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                      >
                        {SYSTEM_ROUTINES.map((r) => (
                          <option key={r.id} value={r.code}>
                            {r.category} • {r.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Result Card */}
                    {(() => {
                      const res = evaluateUserPermission(
                        selectedEmployee,
                        simPermissionId,
                        profiles,
                        'routine'
                      );

                      return (
                        <div
                          className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                            res.hasAccess
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-sm">
                            {res.hasAccess ? (
                              <>
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <span>Acesso AUTORIZADO</span>
                              </>
                            ) : (
                              <>
                                <ShieldAlert className="w-5 h-5 text-rose-400" />
                                <span>Acesso BLOQUEADO</span>
                              </>
                            )}
                          </div>

                          <p className="text-xs leading-relaxed">
                            {res.reason}
                          </p>

                          {res.expiresAt && (
                            <div className="text-[10px] font-mono">
                              Expiração: {new Date(res.expiresAt).toLocaleString('pt-BR')}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONVIDAR NOVO COLABORADOR */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                Convidar Novo Colaborador
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Marina Silva"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">E-mail Profissional *</label>
                  <input
                    type="email"
                    required
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    placeholder="marina@silkprint.com.br"
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={novoWhatsapp}
                    onChange={(e) => setNovoWhatsapp(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Cargo / Função *</label>
                  <input
                    type="text"
                    required
                    value={novoCargo}
                    onChange={(e) => setNovoCargo(e.target.value)}
                    placeholder="Ex: Arte-Finalista & Atendimento"
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Departamento *</label>
                  <select
                    value={novoDepartamento}
                    onChange={(e) => setNovoDepartamento(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Comercial">Comercial</option>
                    <option value="Arte & Pré-Impressão">Arte & Pré-Impressão</option>
                    <option value="Produção">Produção</option>
                    <option value="Acabamento">Acabamento</option>
                    <option value="Logística">Logística</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Diretoria">Diretoria</option>
                  </select>
                </div>
              </div>

              {/* Profiles Selection */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-zinc-300">
                  Perfis de Acesso Iniciais (Multi-Perfil)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                  {profiles.map((p) => {
                    const isChecked = selectedProfileIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProfileIds((prev) =>
                            isChecked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 select-none ${
                          isChecked
                            ? 'bg-blue-600/15 border-blue-500/40 text-zinc-200'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-zinc-600" />
                        )}
                        <span className="font-semibold">{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Criar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
