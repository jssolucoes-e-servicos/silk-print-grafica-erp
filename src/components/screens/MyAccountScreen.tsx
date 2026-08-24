import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Key,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Copy,
  Check,
  RefreshCw,
  Bell,
  Eye,
  EyeOff,
  LogOut,
  QrCode,
  ShieldAlert,
  ShieldCheck,
  Download,
  Calendar,
  Clock,
  Sparkles,
  Save,
} from 'lucide-react';
import { UserEmployee, AccessProfile } from '../../types';
import {
  updateMyProfileApi,
  changePasswordApi,
  setup2FAApi,
  activate2FAApi,
  disable2FAApi,
} from '../../lib/realDataApi';

interface MyAccountScreenProps {
  currentUser: UserEmployee;
  assignedProfiles: AccessProfile[];
  onUserUpdated: (updatedUser: UserEmployee) => void;
  onLogout: () => void;
}

export const MyAccountScreen: React.FC<MyAccountScreenProps> = ({
  currentUser,
  assignedProfiles,
  onUserUpdated,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Form State: Profile Data
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '');
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle || '');
  const [department, setDepartment] = useState(currentUser.department || 'Comercial');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');

  // Form State: Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Form State: 2FA Management
  const [is2FAEnabled, setIs2FAEnabled] = useState(!!currentUser.twoFactorEnabled);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [twoFactorSetupData, setTwoFactorSetupData] = useState<{
    secret: string;
    formattedKey: string;
    otpauthUrl: string;
    backupCodes: string[];
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  // Preferences State
  const [notifEmail, setNotifEmail] = useState(currentUser.notifications?.email ?? true);
  const [notifWhatsapp, setNotifWhatsapp] = useState(currentUser.notifications?.whatsapp ?? true);
  const [notifSystem, setNotifSystem] = useState(currentUser.notifications?.system ?? true);

  // Feedback States
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Sync state when currentUser prop changes
  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setWhatsapp(currentUser.whatsapp || '');
    setJobTitle(currentUser.jobTitle || '');
    setDepartment(currentUser.department || 'Comercial');
    setAvatarUrl(currentUser.avatar || '');
    setIs2FAEnabled(!!currentUser.twoFactorEnabled);
  }, [currentUser]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Nome e E-mail são obrigatórios.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await updateMyProfileApi({
        name,
        email,
        whatsapp,
        jobTitle,
        department: department as any,
        avatar: avatarUrl.trim() || undefined,
        notifications: {
          email: notifEmail,
          whatsapp: notifWhatsapp,
          system: notifSystem,
        },
      });

      if (res.success && res.user) {
        onUserUpdated(res.user);
        setSuccessMessage('Dados cadastrais atualizados com sucesso!');
      } else {
        setErrorMessage(res.error || 'Erro ao atualizar dados.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado na atualização.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setErrorMessage('Preencha a senha atual e a nova senha.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('A confirmação da nova senha não confere.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await changePasswordApi(currentPassword, newPassword);
      if (res.success) {
        setSuccessMessage(res.message || 'Senha alterada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(res.error || 'Erro ao alterar senha.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao alterar senha.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start 2FA Setup
  const handleStart2FASetup = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await setup2FAApi();
      if (data.success && data.secret) {
        setTwoFactorSetupData(data);
        setIsSettingUp2FA(true);
        setVerificationCode('');
      } else {
        setErrorMessage(data.error || 'Não foi possível gerar as chaves do 2FA.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao iniciar configuração do 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  // Activate 2FA
  const handleConfirm2FAActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorSetupData || !verificationCode.trim()) {
      setErrorMessage('Digite o código de 6 dígitos gerado pelo seu app.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await activate2FAApi(
        twoFactorSetupData.secret,
        verificationCode.trim(),
        'totp',
        twoFactorSetupData.backupCodes
      );

      if (res.success) {
        setIs2FAEnabled(true);
        setIsSettingUp2FA(false);
        setTwoFactorSetupData(null);
        setSuccessMessage('Autenticação em 2 Etapas (2FA) ATIVADA com sucesso!');
        onUserUpdated({
          ...currentUser,
          twoFactorEnabled: true,
          twoFactorType: 'totp',
        });
      } else {
        setErrorMessage(res.error || 'Código incorreto. Certifique-se de digitar o código do aplicativo autenticador.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao ativar 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) {
      setErrorMessage('Digite sua senha para confirmar a desativação do 2FA.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await disable2FAApi(disablePassword);
      if (res.success) {
        setIs2FAEnabled(false);
        setIsDisabling2FA(false);
        setDisablePassword('');
        setSuccessMessage('Autenticação em 2 Etapas desativada.');
        onUserUpdated({
          ...currentUser,
          twoFactorEnabled: false,
        });
      } else {
        setErrorMessage(res.error || 'Senha incorreta.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao desativar 2FA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (twoFactorSetupData?.secret) {
      navigator.clipboard.writeText(twoFactorSetupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleCopyBackupCodes = () => {
    if (twoFactorSetupData?.backupCodes) {
      navigator.clipboard.writeText(twoFactorSetupData.backupCodes.join('\n'));
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              {is2FAEnabled && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 p-1 bg-slate-900 rounded-full border border-slate-800"
                  title="2FA Ativado"
                >
                  <div className="p-1 bg-emerald-500 rounded-full text-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentUser.jobTitle || 'Colaborador'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {currentUser.department}
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                {currentUser.email}
                {currentUser.whatsapp && (
                  <>
                    <span className="text-slate-600">•</span>
                    <Phone className="w-4 h-4 text-slate-500" />
                    {currentUser.whatsapp}
                  </>
                )}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Membro desde {new Date(currentUser.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                </span>
                {currentUser.lastLogin && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Último login: {new Date(currentUser.lastLogin).toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>
        </div>

        {/* Profiles / Roles chips */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Perfis de Acesso:</span>
          {assignedProfiles.map((p) => (
            <span
              key={p.id}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono"
            >
              {p.name}
            </span>
          ))}
          {currentUser.customPermissions && currentUser.customPermissions.length > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              +{currentUser.customPermissions.length} permissões avulsas
            </span>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fadeIn shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Dados do Perfil</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Segurança & 2FA</span>
          {is2FAEnabled && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'preferences'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificações & Preferências</span>
        </button>
      </div>

      {/* TAB CONTENT 1: PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white">Informações Pessoais & Corporativas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Atualize seus dados cadastrais e de comunicação</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nome Completo <span className="text-red-400">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-mail Corporativo <span className="text-red-400">*</span>
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                WhatsApp / Celular Corporativo
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Cargo / JobTitle */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cargo / Função
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Ex: Gerente Comercial"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Departamento */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Departamento
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as any)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Diretoria">Diretoria</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Arte & Pré-Impressão">Arte & Pré-Impressão</option>
                  <option value="Produção">Produção</option>
                  <option value="Acabamento">Acabamento</option>
                  <option value="Logística">Logística</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Foto de Perfil (URL da Imagem)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://exemplo.com/minha-foto.jpg"
                className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT 2: SECURITY & 2FA */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* SECTION: TWO-FACTOR AUTHENTICATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${is2FAEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Autenticação em Duas Etapas (2FA)
                    {is2FAEnabled ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Não Configurado
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Proteja sua conta com uma camada extra de segurança usando Google Authenticator, Authy ou 1Password.
                  </p>
                </div>
              </div>

              {!is2FAEnabled && !isSettingUp2FA && (
                <button
                  type="button"
                  onClick={handleStart2FASetup}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Configurar 2FA Agora</span>
                </button>
              )}

              {is2FAEnabled && !isDisabling2FA && (
                <button
                  type="button"
                  onClick={() => setIsDisabling2FA(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Desativar 2FA</span>
                </button>
              )}
            </div>

            {/* 2FA SETUP MODAL / WORKFLOW */}
            {isSettingUp2FA && twoFactorSetupData && (
              <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-6 space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <QrCode className="w-5 h-5" />
                    <span>Configuração do Aplicativo Autenticador (Passo a Passo)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingUp2FA(false);
                      setTwoFactorSetupData(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Step 1: QR Code & Key */}
                  <div className="space-y-4">
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      1. Escaneie o QR Code abaixo com o <strong>Google Authenticator</strong>, <strong>Authy</strong> ou copie a chave manual:
                    </p>

                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-lg inline-block mx-auto">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          twoFactorSetupData.otpauthUrl
                        )}`}
                        alt="2FA QR Code"
                        className="w-44 h-44"
                      />
                      <span className="text-[10px] text-slate-800 font-mono mt-1 font-semibold">SilkPrint ERP 2FA</span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">Chave Manual:</span>
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono text-blue-400 tracking-wider">
                          {twoFactorSetupData.formattedKey || twoFactorSetupData.secret}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopySecret}
                          className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
                        >
                          {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedSecret ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Backup Codes & Verification */}
                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-slate-300 font-medium mb-2">
                        2. Códigos de Recuperação Reserva (Guarde em local seguro):
                      </p>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                          {twoFactorSetupData.backupCodes.map((code, idx) => (
                            <span key={idx} className="bg-slate-950 px-2 py-1 rounded border border-slate-800/80">
                              {code}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={handleCopyBackupCodes}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                          >
                            {copiedBackup ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedBackup ? 'Códigos copiados!' : 'Copiar todos os códigos'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleConfirm2FAActivation} className="space-y-3 pt-2">
                      <label className="block text-xs font-medium text-slate-300">
                        3. Digite o código de 6 dígitos gerado pelo App para ativar:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          placeholder="000000"
                          className="block w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 bg-slate-900 border border-blue-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || verificationCode.length < 6}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Validando...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirmar e Ativar 2FA</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* DISABLE 2FA FORM */}
            {isDisabling2FA && (
              <form onSubmit={handleDisable2FA} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Desativação de Segurança</span>
                </div>
                <p className="text-xs text-slate-300">
                  Para desativar o 2FA, confirme sua senha atual de acesso ao sistema:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    required
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Sua senha atual"
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !disablePassword}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Confirmar Desativação
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDisabling2FA(false);
                      setDisablePassword('');
                    }}
                    className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* SECTION: CHANGE PASSWORD */}
          <form onSubmit={handleChangePassword} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Alterar Senha de Acesso</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Mantenha sua conta corporativa sempre protegida</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPasswords ? 'Ocultar senhas' : 'Ver senhas'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Senha Atual <span className="text-red-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nova Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirmar Nova Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Atualizando...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Atualizar Senha</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 3: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-lg font-bold text-white">Canais de Notificação & Preferências</h2>
            <p className="text-xs text-slate-400 mt-0.5">Defina como e quando você deseja receber alertas do sistema</p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Alertas por E-mail</span>
                  <span className="text-xs text-slate-400">Receber notificações críticas, fechamentos de caixa e relatórios</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Alertas por WhatsApp</span>
                  <span className="text-xs text-slate-400">Avisos de novas ordens de serviço e mensagens de clientes</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifWhatsapp}
                onChange={(e) => setNotifWhatsapp(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Notificações no Navegador (Push / Som)</span>
                  <span className="text-xs text-slate-400">Sons de alerta em tempo real e avisos no painel operacional</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifSystem}
                onChange={(e) => setNotifSystem(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
