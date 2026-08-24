import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Key,
  Building2,
  Server,
  Smartphone,
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { loginApi, verify2FAApi } from '../../lib/realDataApi';
import { UserEmployee, AccessProfile } from '../../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserEmployee, profiles: AccessProfile[], allowedScreens: string[], isAdmin: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  // Step 1 State
  const [email, setEmail] = useState('admin@silkprint.com.br');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 2 (2FA) State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [tempToken, setTempToken] = useState<string>('');
  const [twoFactorType, setTwoFactorType] = useState<'totp' | 'whatsapp'>('totp');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [userPreview, setUserPreview] = useState<{ email: string; name: string; whatsapp?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Por favor, informe o e-mail e a senha.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginApi(email.trim(), password);
      if (response.success) {
        if (response.requires2FA && response.tempToken) {
          // Transition to 2FA verification step
          setTempToken(response.tempToken);
          setTwoFactorType(response.twoFactorType || 'totp');
          setUserPreview({
            email: response.user?.email || email,
            name: response.user?.name || 'Colaborador',
            whatsapp: response.user?.whatsapp,
          });
          setIs2FAStep(true);
          setTwoFactorCode('');
          setUseBackupCode(false);
        } else if (response.user) {
          onLoginSuccess(
            response.user,
            response.assignedProfiles || [],
            response.allowedScreens || [],
            !!response.isAdmin
          );
        }
      } else {
        setErrorMessage(response.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar ao servidor de autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setErrorMessage(useBackupCode ? 'Informe o código de recuperação reserva.' : 'Informe o código de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await verify2FAApi(tempToken, twoFactorCode.trim(), useBackupCode);
      if (response.success && response.user) {
        onLoginSuccess(
          response.user,
          response.assignedProfiles || [],
          response.allowedScreens || [],
          !!response.isAdmin
        );
      } else {
        setErrorMessage(response.error || 'Código incorreto ou expirado. Tente novamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao validar autenticação em 2 etapas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillAdminMaster = () => {
    setEmail('admin@silkprint.com.br');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleBackToLogin = () => {
    setIs2FAStep(false);
    setTwoFactorCode('');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20 mb-4 border border-blue-400/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            SilkPrint <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/50">ERP Pro</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sistema Integrado de Gestão para Gráficas & Comunicação Visual
          </p>
        </div>

        {/* Login / 2FA Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-8 sm:p-10 transition-all duration-300">
          {!is2FAStep ? (
            /* STEP 1: EMAIL & PASSWORD FORM */
            <>
              <div className="mb-6 pb-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Acesso ao Sistema</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Informe suas credenciais corporativas</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  API Online
                </div>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs leading-relaxed">{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    E-mail Corporativo
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@silkprint.com.br"
                      className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      Senha de Acesso
                    </label>
                    <span className="text-xs text-slate-500">Mínimo 6 caracteres</span>
                  </div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    Lembrar credenciais
                  </label>
                  <span className="text-slate-500">Token JWT Seguro (7 dias)</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Autenticando sessão...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Entrar no Sistema</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Fill Admin Master Helper */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    Usuário Master de Produção:
                  </span>
                  <button
                    type="button"
                    onClick={handleFillAdminMaster}
                    className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline transition-colors"
                  >
                    Preencher 1-Clique
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">User:</span> admin@silkprint.com.br
                  </div>
                  <div>
                    <span className="text-slate-500">Pass:</span> admin123
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: TWO-FACTOR AUTHENTICATION (2FA) */
            <div className="animate-fadeIn">
              <div className="mb-6 pb-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Voltar ao login"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Verificação 2FA
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Segurança em Duas Etapas Ativa</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  Etapa 2 de 2
                </span>
              </div>

              {/* User Identifier Banner */}
              {userPreview && (
                <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {userPreview.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{userPreview.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{userPreview.email}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* 2FA Mode Description */}
              <div className="mb-5 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-slate-300 text-xs flex items-start gap-3">
                {twoFactorType === 'whatsapp' ? (
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                )}
                <div>
                  {useBackupCode ? (
                    <span>
                      Digite um dos seus <strong>códigos de recuperação reserva</strong> de 8 caracteres gerados na ativação do 2FA.
                    </span>
                  ) : twoFactorType === 'whatsapp' ? (
                    <span>
                      Digite o <strong>código de 6 dígitos</strong> recebido no WhatsApp cadastrado.
                    </span>
                  ) : (
                    <span>
                      Abra seu aplicativo autenticador (<strong>Google Authenticator</strong>, <strong>Authy</strong> ou <strong>1Password</strong>) e insira o código de 6 dígitos.
                    </span>
                  )}
                </div>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    {useBackupCode ? 'Código de Recuperação Reserva' : 'Código de Autenticação (6 Dígitos)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      required
                      value={twoFactorCode}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (useBackupCode) {
                          setTwoFactorCode(val);
                        } else {
                          // Allow max 6 numeric chars
                          setTwoFactorCode(val.replace(/[^0-9]/g, '').slice(0, 6));
                        }
                      }}
                      placeholder={useBackupCode ? 'Ex: SP-A1B2-C3D4' : '000000'}
                      className="block w-full text-center tracking-widest text-xl font-mono py-3 px-4 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupCode(!useBackupCode);
                      setTwoFactorCode('');
                      setErrorMessage(null);
                    }}
                    className="text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer transition-colors"
                  >
                    {useBackupCode ? '← Usar código do App Autenticador (6 dígitos)' : 'Perdeu o celular? Usar código de backup'}
                  </button>
                </div>

                {/* Submit 2FA Button */}
                <button
                  type="submit"
                  disabled={isLoading || !twoFactorCode.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Validando código 2FA...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verificar e Entrar</span>
                    </>
                  )}
                </button>
              </form>

              {/* Dev bypass helper hint */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <p className="text-[11px] text-slate-500">
                  Dica de Teste Rápido: <span className="font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">123456</span> é aceito como código de validação.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security & Production Badges */}
        <div className="mt-8 text-center space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Controle RBAC Ativo
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              2FA TOTP RFC 6238
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Hash PBKDF2
            </span>
          </div>
          <p>© 2026 SilkPrint ERP. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};
