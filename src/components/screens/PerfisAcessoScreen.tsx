import React, { useState } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Check,
  X,
  Search,
  Users,
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
  Info,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Code,
  FileCode,
  CheckCircle2,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  AccessProfile,
  UserEmployee,
  ResourceDefinition,
  StandardActionFlag,
} from '../../types';
import {
  SYSTEM_RESOURCES,
  STANDARD_FLAGS,
  ALL_PERMISSION_CODES,
} from '../../lib/permissionsEngine';
import { generateNestJsBoilerplate } from '../../lib/serverPermissions';

interface PerfisAcessoScreenProps {
  profiles: AccessProfile[];
  employees: UserEmployee[];
  onCreateProfile: (profile: Omit<AccessProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProfile: (profile: AccessProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  onOpenEmployeesScreen?: () => void;
}

export const PerfisAcessoScreen: React.FC<PerfisAcessoScreenProps> = ({
  profiles,
  employees,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onOpenEmployeesScreen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNestJsModalOpen, setIsNestJsModalOpen] = useState(false);
  const [copiedNestCode, setCopiedNestCode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccessProfile | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [allowedPermissions, setAllowedPermissions] = useState<string[]>([]);
  const [activeFormTab, setActiveFormTab] = useState<'matrix' | 'json'>('matrix');
  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [resourceSearch, setResourceSearch] = useState<string>('');

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingProfile(null);
    setName('');
    setCode('');
    setDescription('');
    setColor('#3b82f6');
    setAllowedPermissions([
      'overview.view',
      'customers.view',
      'customers.create',
      'orders.view',
      'orders.create',
      'quotes.view',
      'quotes.create',
      'products.view',
    ]);
    setActiveFormTab('matrix');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profile: AccessProfile) => {
    setEditingProfile(profile);
    setName(profile.name);
    setCode(profile.code);
    setDescription(profile.description);
    setColor(profile.color || '#3b82f6');
    // Consolidate permissions
    const perms = [
      ...(profile.allowedPermissions || []),
      ...(profile.allowedRoutines || []),
    ];
    setAllowedPermissions(Array.from(new Set(perms)));
    setActiveFormTab('matrix');
    setIsModalOpen(true);
  };

  const handleDuplicate = (profile: AccessProfile) => {
    setEditingProfile(null);
    setName(`${profile.name} (Cópia)`);
    setCode(`${profile.code}_COPIA`);
    setDescription(`Clonado a partir de ${profile.name}. ${profile.description}`);
    setColor(profile.color || '#3b82f6');
    setAllowedPermissions([...(profile.allowedPermissions || [])]);
    setActiveFormTab('matrix');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    if (editingProfile) {
      onUpdateProfile({
        ...editingProfile,
        name,
        code: code.toUpperCase().trim(),
        description,
        color,
        allowedPermissions,
        allowedScreens: SYSTEM_RESOURCES.filter((r) =>
          allowedPermissions.includes(`${r.resource}.view`)
        ).map((r) => `screen_${r.resource}`),
        allowedRoutines: allowedPermissions,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onCreateProfile({
        name,
        code: code.toUpperCase().trim(),
        description,
        color,
        icon: 'Shield',
        allowedPermissions,
        allowedScreens: SYSTEM_RESOURCES.filter((r) =>
          allowedPermissions.includes(`${r.resource}.view`)
        ).map((r) => `screen_${r.resource}`),
        allowedRoutines: allowedPermissions,
      });
    }
    setIsModalOpen(false);
  };

  // Permission toggles
  const togglePermission = (permCode: string) => {
    setAllowedPermissions((prev) =>
      prev.includes(permCode) ? prev.filter((p) => p !== permCode) : [...prev, permCode]
    );
  };

  const toggleAllForResource = (resource: ResourceDefinition) => {
    const resourceCodes = resource.actions.map((a) => a.code);
    const allSelected = resourceCodes.every((c) => allowedPermissions.includes(c));

    if (allSelected) {
      setAllowedPermissions((prev) => prev.filter((p) => !resourceCodes.includes(p)));
    } else {
      setAllowedPermissions((prev) => Array.from(new Set([...prev, ...resourceCodes])));
    }
  };

  const setPresetForResource = (
    resource: ResourceDefinition,
    preset: 'readonly' | 'crud' | 'full'
  ) => {
    const codes = resource.actions.map((a) => a.code);
    let newCodes: string[] = [];

    if (preset === 'readonly') {
      newCodes = [`${resource.resource}.view`, `${resource.resource}.report`].filter((c) =>
        codes.includes(c)
      );
    } else if (preset === 'crud') {
      newCodes = [
        `${resource.resource}.view`,
        `${resource.resource}.create`,
        `${resource.resource}.edit`,
        `${resource.resource}.delete`,
      ].filter((c) => codes.includes(c));
    } else if (preset === 'full') {
      newCodes = codes;
    }

    setAllowedPermissions((prev) => {
      const filtered = prev.filter((p) => !codes.includes(p));
      return Array.from(new Set([...filtered, ...newCodes]));
    });
  };

  const toggleAllPermissions = () => {
    if (allowedPermissions.length >= ALL_PERMISSION_CODES.length) {
      setAllowedPermissions([]);
    } else {
      setAllowedPermissions([...ALL_PERMISSION_CODES]);
    }
  };

  const categories = [
    'todas',
    'CRM & Sales',
    'Production & Operations',
    'Catalog & Pricing',
    'Finance & Accounting',
    'Administration & Security',
  ];

  const filteredResources = SYSTEM_RESOURCES.filter((res) => {
    const matchesCategory = filterCategory === 'todas' || res.category === filterCategory;
    const matchesSearch =
      res.name.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      res.resource.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      res.description.toLowerCase().includes(resourceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] text-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Perfis de Acesso & Matriz RBAC
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                resource.action
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Parametrização granular de módulos com flags (view, create, edit, delete, report, admin) para frontend e API NestJS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNestJsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition shadow-xs cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>Guia de Conexão NestJS & JSON</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Perfil de Acesso</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Search and Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar perfil por nome, código ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-200">{profiles.length}</span> perfis cadastrados •
            <span className="font-semibold text-zinc-200 ml-1">{SYSTEM_RESOURCES.length}</span> módulos mapeados com convenção <code className="text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded text-[11px]">resource.action</code>
          </div>
        </div>

        {/* Profiles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProfiles.map((profile) => {
            const assignedCount = employees.filter((e) => e.profileIds?.includes(profile.id)).length;
            const permsCount = (profile.allowedPermissions || profile.allowedRoutines || []).length;
            const hasFullAdmin = profile.allowedPermissions?.includes('*') || profile.code === 'ADMIN';

            return (
              <div
                key={profile.id}
                className="bg-zinc-900/70 border border-zinc-800/80 rounded-xl p-5 hover:border-zinc-700 transition flex flex-col justify-between shadow-xs relative group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full ring-4 shadow-xs"
                        style={{
                          backgroundColor: profile.color,
                          boxShadow: `0 0 10px ${profile.color}40`,
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-1.5">
                          {profile.name}
                          {profile.isSystemDefault && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-medium">
                              Padrão
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-700/50">
                          {profile.code}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                      <button
                        title="Duplicar perfil"
                        onClick={() => handleDuplicate(profile)}
                        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Editar perfil"
                        onClick={() => handleOpenEdit(profile)}
                        className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!profile.isSystemDefault && (
                        <button
                          title="Excluir perfil"
                          onClick={() => {
                            if (confirm(`Deseja excluir o perfil ${profile.name}?`)) {
                              onDeleteProfile(profile.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2 min-h-[32px]">
                    {profile.description}
                  </p>

                  {/* Badges / Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/70 text-xs">
                    <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/50">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Ações / Permissões</span>
                      <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                        {hasFullAdmin ? (
                          <span className="text-blue-400 font-semibold text-[11px]">Total (Acesso Total)</span>
                        ) : (
                          <>
                            <Shield className="w-3.5 h-3.5 text-emerald-400" />
                            {permsCount} liberadas
                          </>
                        )}
                      </span>
                    </div>

                    <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/50">
                      <span className="text-[10px] text-zinc-400 block mb-0.5">Colaboradores</span>
                      <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        {assignedCount} vinculados
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">
                    Última edição: {new Date(profile.updatedAt || profile.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(profile)}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    Ver Matriz
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Create/Edit Modal with RBAC Matrix */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full ring-4 shadow-xs"
                  style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}50` }}
                />
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {editingProfile ? `Editar Perfil: ${editingProfile.name}` : 'Criar Novo Perfil de Acesso'}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Defina o nome, código identificador e as flags de ação permitidas por módulo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveFormTab('matrix')}
                    className={`px-3 py-1 rounded-md transition ${
                      activeFormTab === 'matrix' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Matriz de Flags
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFormTab('json')}
                    className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                      activeFormTab === 'json' ? 'bg-blue-600 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    Exportar JSON
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                {/* General Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                      Nome do Perfil *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Comercial & Vendas Balcão"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                      Código Interno / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: COMERCIAL_VIP"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                      Cor de Identificação
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-9 h-8 bg-transparent cursor-pointer rounded-md border border-zinc-700"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg font-mono text-zinc-300"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                      Descrição / Finalidade do Perfil
                    </label>
                    <input
                      type="text"
                      placeholder="Breve resumo das atribuições deste perfil na gráfica..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {activeFormTab === 'matrix' ? (
                  <>
                    {/* Matrix Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-zinc-400 font-medium">Filtrar Categoria:</span>
                        <div className="flex flex-wrap gap-1">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFilterCategory(cat)}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition cursor-pointer ${
                                filterCategory === cat
                                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                              }`}
                            >
                              {cat === 'todas' ? 'Todas' : cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                          <input
                            type="text"
                            placeholder="Buscar recurso (ex: customers, pedidos)..."
                            value={resourceSearch}
                            onChange={(e) => setResourceSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 w-52"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={toggleAllPermissions}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition cursor-pointer"
                        >
                          {allowedPermissions.length >= ALL_PERMISSION_CODES.length
                            ? 'Desmarcar Todas'
                            : 'Marcar Todas'}
                        </button>
                      </div>
                    </div>

                    {/* Permissions Matrix Table */}
                    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/80 shadow-inner">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-300">
                              <th className="py-3 px-4 font-bold text-xs">Módulo & Recurso</th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-blue-400">VIEW</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Acesso</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-emerald-400">CREATE</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Criar</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-amber-400">EDIT</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Editar</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-red-400">DELETE</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Excluir</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-cyan-400">REPORT</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Relatório</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-center w-16">
                                <span className="block text-[11px] text-purple-400">ADMIN</span>
                                <span className="text-[9px] text-zinc-400 font-normal">Admin/Rest.</span>
                              </th>
                              <th className="py-3 px-3 font-bold text-left min-w-[150px]">Ações Extras</th>
                              <th className="py-3 px-3 font-bold text-right pr-4">Presets Rápidos</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60">
                            {filteredResources.map((resource) => {
                              const viewCode = `${resource.resource}.view`;
                              const createCode = `${resource.resource}.create`;
                              const editCode = `${resource.resource}.edit`;
                              const deleteCode = `${resource.resource}.delete`;
                              const reportCode = `${resource.resource}.report`;
                              const adminCode = `${resource.resource}.admin`;

                              const hasViewAction = resource.actions.some((a) => a.action === 'view');
                              const hasCreateAction = resource.actions.some((a) => a.action === 'create');
                              const hasEditAction = resource.actions.some((a) => a.action === 'edit');
                              const hasDeleteAction = resource.actions.some((a) => a.action === 'delete');
                              const hasReportAction = resource.actions.some((a) => a.action === 'report');
                              const hasAdminAction = resource.actions.some((a) => a.action === 'admin');

                              const customActions = resource.actions.filter(
                                (a) =>
                                  !['view', 'create', 'edit', 'delete', 'report', 'admin'].includes(
                                    a.action
                                  )
                              );

                              return (
                                <tr
                                  key={resource.resource}
                                  className="hover:bg-zinc-900/60 transition group"
                                >
                                  {/* Resource Info */}
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-zinc-100 text-xs">
                                        {resource.name}
                                      </span>
                                      <code className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-blue-300 border border-zinc-700">
                                        {resource.resource}
                                      </code>
                                    </div>
                                    <span className="text-[11px] text-zinc-400 block line-clamp-1">
                                      {resource.description}
                                    </span>
                                  </td>

                                  {/* VIEW FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasViewAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(viewCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(viewCode)
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* CREATE FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasCreateAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(createCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(createCode)
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* EDIT FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasEditAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(editCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(editCode)
                                            ? 'bg-amber-600 border-amber-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* DELETE FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasDeleteAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(deleteCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(deleteCode)
                                            ? 'bg-red-600 border-red-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* REPORT FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasReportAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(reportCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(reportCode)
                                            ? 'bg-cyan-600 border-cyan-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* ADMIN FLAG */}
                                  <td className="py-3 px-3 text-center">
                                    {hasAdminAction ? (
                                      <button
                                        type="button"
                                        onClick={() => togglePermission(adminCode)}
                                        className={`w-6 h-6 rounded-md inline-flex items-center justify-center transition border cursor-pointer ${
                                          allowedPermissions.includes(adminCode)
                                            ? 'bg-purple-600 border-purple-500 text-white shadow-xs'
                                            : 'bg-zinc-900 border-zinc-700 text-transparent hover:border-zinc-500'
                                        }`}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <span className="text-zinc-600 text-xs">-</span>
                                    )}
                                  </td>

                                  {/* Custom Action Badges */}
                                  <td className="py-3 px-3">
                                    <div className="flex flex-wrap gap-1">
                                      {customActions.map((ca) => {
                                        const isAllowed = allowedPermissions.includes(ca.code);
                                        return (
                                          <button
                                            key={ca.code}
                                            type="button"
                                            onClick={() => togglePermission(ca.code)}
                                            className={`px-1.5 py-0.5 text-[10px] font-mono rounded border transition cursor-pointer ${
                                              isAllowed
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                                            }`}
                                            title={ca.description}
                                          >
                                            {ca.action}
                                          </button>
                                        );
                                      })}
                                      {customActions.length === 0 && (
                                        <span className="text-[10px] text-zinc-400">Padrão CRUD</span>
                                      )}
                                    </div>
                                  </td>

                                  {/* Quick Presets */}
                                  <td className="py-3 px-3 text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                      <button
                                        type="button"
                                        onClick={() => setPresetForResource(resource, 'readonly')}
                                        className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                                      >
                                        Leitura
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setPresetForResource(resource, 'crud')}
                                        className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                                      >
                                        CRUD
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => toggleAllForResource(resource)}
                                        className="px-2 py-0.5 text-[10px] rounded bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/40 transition cursor-pointer"
                                      >
                                        Tudo
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  /* JSON Tab */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Payload de Permissões gerado para salvar no banco ou validar no NestJS:</span>
                      <span className="font-mono text-blue-400">{allowedPermissions.length} permissões ativas</span>
                    </div>

                    <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 select-all">
                      {JSON.stringify(
                        {
                          profile: code || 'NOVO_PERFIL',
                          name: name || 'Sem nome',
                          allowedPermissions: allowedPermissions.sort(),
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-200">{allowedPermissions.length}</span> permissões selecionadas
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm cursor-pointer"
                  >
                    Salvar Perfil
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NestJS Integration Modal */}
      {isNestJsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Code className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold text-white">
                  Integração Backend NestJS (Guards, Decorators & Server Actions)
                </h2>
              </div>
              <button
                onClick={() => setIsNestJsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-zinc-300">
                O arquivo <code className="text-blue-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">/resources.json</code> na raiz do projeto já contém todos os recursos com o padrão <code className="text-blue-400 font-mono font-bold">resource.action</code>. Você pode copiar o código do Guard do NestJS abaixo:
              </p>

              <div className="relative">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateNestJsBoilerplate());
                    setCopiedNestCode(true);
                    setTimeout(() => setCopiedNestCode(false), 2000);
                  }}
                  className="absolute right-3 top-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  {copiedNestCode ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Código
                    </>
                  )}
                </button>

                <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto max-h-96">
                  {generateNestJsBoilerplate()}
                </pre>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/90 flex justify-end">
              <button
                onClick={() => setIsNestJsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
