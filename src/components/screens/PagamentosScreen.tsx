import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Check,
  ShieldCheck,
  Zap,
  Save,
  Tag,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Copy,
  ExternalLink,
  Percent,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrderValue: number;
  maxUses?: number;
  usedCount: number;
  validUntil: string;
  status: 'active' | 'inactive';
}

export const PagamentosScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gateways' | 'pix' | 'cupons' | 'frete'>('gateways');

  // PIX Manual Config
  const [pixKey, setPixKey] = useState('51.936.187/0001-20');
  const [pixKeyType, setPixKeyType] = useState('cnpj');
  const [pixHolder, setPixHolder] = useState('Silk Print Comunicação Visual Ltda');
  const [pixBank, setPixBank] = useState('Banco Inter / Nubank');
  const [pixCity, setPixCity] = useState('São Paulo');
  const [pixInstructions, setPixInstructions] = useState(
    'Após realizar a transferência via PIX, favor enviar o comprovante com o número do pedido via WhatsApp para liberação imediata da produção.'
  );

  // Gateways status & configs
  const [asaasEnabled, setAsaasEnabled] = useState(true);
  const [asaasApiKey, setAsaasApiKey] = useState('$aact_YTU1YTE0M2M2N2I4MTliNjc0OTQ1...');
  const [asaasEnv, setAsaasEnv] = useState<'prod' | 'sandbox'>('prod');
  const [asaasAutoPix, setAsaasAutoPix] = useState(true);
  const [asaasAutoBoleto, setAsaasAutoBoleto] = useState(true);
  const [asaasAutoCard, setAsaasAutoCard] = useState(true);

  const [mercadoPagoEnabled, setMercadoPagoEnabled] = useState(true);
  const [mpPublicKey, setMpPublicKey] = useState('APP_USR-786d9e8f-4312-4f11-9a72-881c9a89d012');
  const [mpAccessToken, setMpAccessToken] = useState('APP_USR-827391823901-092312-abcdef1234567890-987654321');
  const [mpMaxInstallments, setMpMaxInstallments] = useState('12');
  const [mpInstallmentsWithoutInterest, setMpInstallmentsWithoutInterest] = useState('3');

  const [infinitePayEnabled, setInfinitePayEnabled] = useState(false);
  const [infinitePayHandle, setInfinitePayHandle] = useState('silkprintgrafica');
  const [infinitePayApiKey, setInfinitePayApiKey] = useState('');

  // Cupons
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'cup-1',
      code: 'PRIMEIRACOMPRA',
      type: 'percent',
      value: 10,
      minOrderValue: 100,
      maxUses: 100,
      usedCount: 34,
      validUntil: '2026-12-31',
      status: 'active',
    },
    {
      id: 'cup-2',
      code: 'CLIENTEVIP15',
      type: 'percent',
      value: 15,
      minOrderValue: 300,
      maxUses: 50,
      usedCount: 18,
      validUntil: '2026-08-31',
      status: 'active',
    },
    {
      id: 'cup-3',
      code: 'FRETEOFF50',
      type: 'fixed',
      value: 50,
      minOrderValue: 500,
      maxUses: 20,
      usedCount: 20,
      validUntil: '2026-05-01',
      status: 'inactive',
    },
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponValue, setNewCouponValue] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('100');
  const [newCouponUses, setNewCouponUses] = useState('50');
  const [newCouponDate, setNewCouponDate] = useState('2026-12-31');
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Frete Fixo & Opções de Envio
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [pickupAddress, setPickupAddress] = useState('Av. Industrial, 1420 - Galpão 3, Centro');
  const [pickupTime, setPickupTime] = useState('Seg a Sex: 08:30 às 18:00');

  const [fixedFreightEnabled, setFixedFreightEnabled] = useState(true);
  const [fixedFreightPrice, setFixedFreightPrice] = useState('25.00');
  const [fixedFreightDescription, setFixedFreightDescription] = useState('Entrega Expressa / Motoboy (Raio até 20km)');

  const [freeShippingThreshold, setFreeShippingThreshold] = useState('350.00');
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);

  const [correiosEnabled, setCorreiosEnabled] = useState(false);
  const [originCep, setOriginCep] = useState('01310-100');

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newC: Coupon = {
      id: `cup-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: parseFloat(newCouponValue) || 0,
      minOrderValue: parseFloat(newCouponMin) || 0,
      maxUses: parseInt(newCouponUses) || undefined,
      usedCount: 0,
      validUntil: newCouponDate,
      status: 'active',
    };
    setCoupons([newC, ...coupons]);
    setNewCouponCode('');
    setShowCouponModal(false);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c
      )
    );
  };

  return (
    <div id="screen-pagamentos" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-400" />
            <span>Formas de Pagamento & Frete</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Configure gateways (Mercado Pago, Asaas, InfinitePay), PIX direto, cupons de desconto e opções de entrega
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Todas Alterações</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>Configurações de pagamento e frete salvas com sucesso!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'gateways'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Gateways Online</span>
          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
            {Number(asaasEnabled) + Number(mercadoPagoEnabled) + Number(infinitePayEnabled)} ativos
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pix')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'pix'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>PIX Manual / Direto</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cupons')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'cupons'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Cupons de Desconto</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
            {coupons.filter((c) => c.status === 'active').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('frete')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'frete'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Frete Fixo & Entrega</span>
        </button>
      </div>

      {/* TAB 1: GATEWAYS */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          {/* Asaas */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 font-black text-sm flex items-center justify-center border border-blue-500/30">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">Asaas Pagamentos</h3>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-semibold">
                      Recomendado p/ Gráficas
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Cobranças via Pix imediato com QR Code, Boletos e Cartão de Crédito com taxa reduzida
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${asaasEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {asaasEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setAsaasEnabled(!asaasEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    asaasEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      asaasEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {asaasEnabled && (
              <div className="space-y-4 pt-3 border-t border-zinc-800/70 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Chave de API (API Key Asaas)
                    </label>
                    <input
                      type="password"
                      value={asaasApiKey}
                      onChange={(e) => setAsaasApiKey(e.target.value)}
                      placeholder="$aact_YTU1..."
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Encontre em Menu &gt; Configurações da Conta &gt; Integrações no painel do Asaas.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Ambiente de Operação
                    </label>
                    <select
                      value={asaasEnv}
                      onChange={(e) => setAsaasEnv(e.target.value as 'prod' | 'sandbox')}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="prod">Produção (Real)</option>
                      <option value="sandbox">Sandbox (Testes)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asaasAutoPix}
                      onChange={(e) => setAsaasAutoPix(e.target.checked)}
                      className="rounded border-zinc-700 text-blue-500 focus:ring-blue-400 bg-zinc-950"
                    />
                    <span>Gerar PIX Asaas automático</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asaasAutoBoleto}
                      onChange={(e) => setAsaasAutoBoleto(e.target.checked)}
                      className="rounded border-zinc-700 text-blue-500 focus:ring-blue-400 bg-zinc-950"
                    />
                    <span>Permitir Boleto Bancário</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={asaasAutoCard}
                      onChange={(e) => setAsaasAutoCard(e.target.checked)}
                      className="rounded border-zinc-700 text-blue-500 focus:ring-blue-400 bg-zinc-950"
                    />
                    <span>Cartão de Crédito Online</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Mercado Pago */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 font-black text-sm flex items-center justify-center border border-sky-500/30">
                  MP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">Mercado Pago</h3>
                    <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-semibold">
                      Checkout Transparente / Pro
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Cartão de crédito parcelado em até 12x, Pix instantâneo e saldo em conta Mercado Pago
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${mercadoPagoEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {mercadoPagoEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setMercadoPagoEnabled(!mercadoPagoEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    mercadoPagoEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      mercadoPagoEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {mercadoPagoEnabled && (
              <div className="space-y-4 pt-3 border-t border-zinc-800/70 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Public Key
                    </label>
                    <input
                      type="text"
                      value={mpPublicKey}
                      onChange={(e) => setMpPublicKey(e.target.value)}
                      placeholder="APP_USR-..."
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Access Token
                    </label>
                    <input
                      type="password"
                      value={mpAccessToken}
                      onChange={(e) => setMpAccessToken(e.target.value)}
                      placeholder="APP_USR-..."
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Parcelamento Máximo
                    </label>
                    <select
                      value={mpMaxInstallments}
                      onChange={(e) => setMpMaxInstallments(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="1">1x (À vista apenas)</option>
                      <option value="3">Até 3x</option>
                      <option value="6">Até 6x</option>
                      <option value="10">Até 10x</option>
                      <option value="12">Até 12x</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Parcelas Sem Juros (Assumidas pela Gráfica)
                    </label>
                    <select
                      value={mpInstallmentsWithoutInterest}
                      onChange={(e) => setMpInstallmentsWithoutInterest(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="1">Nenhuma (Juros por conta do cliente)</option>
                      <option value="2">Até 2x sem juros</option>
                      <option value="3">Até 3x sem juros</option>
                      <option value="6">Até 6x sem juros</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* InfinitePay */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/30">
                  ∞
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-100">InfinitePay (Infinity)</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                      Taxas Imbatíveis
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Links de pagamento e Pix com taxas super reduzidas e recebimento no dia seguinte
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${infinitePayEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {infinitePayEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setInfinitePayEnabled(!infinitePayEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    infinitePayEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      infinitePayEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {infinitePayEnabled && (
              <div className="space-y-4 pt-3 border-t border-zinc-800/70 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      InfiniteHandle / Usuário da Conta
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500 font-mono">@</span>
                      <input
                        type="text"
                        value={infinitePayHandle}
                        onChange={(e) => setInfinitePayHandle(e.target.value)}
                        placeholder="suagrafica"
                        className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Chave de API / JWT Token
                    </label>
                    <input
                      type="password"
                      value={infinitePayApiKey}
                      onChange={(e) => setInfinitePayApiKey(e.target.value)}
                      placeholder="inf_sec_..."
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PIX MANUAL */}
      {activeTab === 'pix' && (
        <div className="space-y-6">
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">PIX Direto na Conta da Gráfica</h3>
                  <p className="text-xs text-zinc-400">
                    Sem taxas de intermediação — seus dados bancários aparecem na finalização do pedido e nos orçamentos PDF
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                Sempre Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tipo de Chave PIX
                </label>
                <select
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="cnpj">CNPJ</option>
                  <option value="cpf">CPF</option>
                  <option value="phone">Telefone / Celular</option>
                  <option value="email">E-mail</option>
                  <option value="random">Chave Aleatória (EVP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Chave PIX
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Instituição Financeira / Banco
                </label>
                <input
                  type="text"
                  value={pixBank}
                  onChange={(e) => setPixBank(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome do Titular / Razão Social
                </label>
                <input
                  type="text"
                  value={pixHolder}
                  onChange={(e) => setPixHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Cidade do Titular
                </label>
                <input
                  type="text"
                  value={pixCity}
                  onChange={(e) => setPixCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Instruções Adicionais para o Cliente
                </label>
                <textarea
                  rows={2}
                  value={pixInstructions}
                  onChange={(e) => setPixInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Preview do Cartão PIX */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                    Como o cliente verá no checkout:
                  </div>
                  <div className="text-xs font-bold text-zinc-200 mt-0.5">
                    {pixHolder} • {pixBank}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    Chave: <span className="text-blue-400">{pixKey}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(pixKey);
                  alert('Chave PIX copiada!');
                }}
                className="px-3.5 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Chave</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUPONS DE DESCONTO */}
      {activeTab === 'cupons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-100">Cupons de Desconto Cadastrados</h2>
              <p className="text-xs text-zinc-400">
                Crie códigos promocionais em porcentagem (%) ou valor fixo (R$) para incentivar compras
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cupom</span>
            </button>
          </div>

          {/* Lista de Cupons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`p-4 rounded-2xl border transition-all ${
                  coupon.status === 'active'
                    ? 'bg-zinc-900/90 border-zinc-800/90 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-400" />
                    <span className="font-mono font-bold text-sm text-zinc-100 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                      {coupon.code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                      coupon.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {coupon.status === 'active' ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Desconto:</span>
                    <span className="font-bold text-blue-400 font-mono">
                      {coupon.type === 'percent' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Pedido Mínimo:</span>
                    <span className="font-mono text-zinc-200">R$ {coupon.minOrderValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Usos:</span>
                    <span className="font-mono text-zinc-200">
                      {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : 'utilizações'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Validade:</span>
                    <span className="text-zinc-400">{coupon.validUntil}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-800/70">
                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Novo Cupom */}
          {showCouponModal && (
            <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-100">Criar Novo Cupom de Desconto</h3>
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="text-zinc-400 hover:text-zinc-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddCoupon} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Código do Cupom (ex: PROMO10)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="SILK2026"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono uppercase focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Tipo de Desconto
                      </label>
                      <select
                        value={newCouponType}
                        onChange={(e) => setNewCouponType(e.target.value as 'percent' | 'fixed')}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="percent">Porcentagem (%)</option>
                        <option value="fixed">Valor Fixo (R$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Valor do Desconto
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Valor Mínimo do Pedido (R$)
                      </label>
                      <input
                        type="number"
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Limite de Usos Totais
                      </label>
                      <input
                        type="number"
                        value={newCouponUses}
                        onChange={(e) => setNewCouponUses(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Data de Expiração
                    </label>
                    <input
                      type="date"
                      value={newCouponDate}
                      onChange={(e) => setNewCouponDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCouponModal(false)}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-400"
                    >
                      Criar Cupom
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FRETE FIXO & ENTREGA */}
      {activeTab === 'frete' && (
        <div className="space-y-6">
          {/* Retirada no Balcão */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Retirada no Balcão / Loja Física</h3>
                  <p className="text-xs text-zinc-400">Cliente busca o material diretamente na gráfica (Custo R$ 0,00)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${pickupEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {pickupEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setPickupEnabled(!pickupEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    pickupEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      pickupEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {pickupEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/70 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Endereço de Retirada
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Horários de Atendimento para Retirada
                  </label>
                  <input
                    type="text"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Frete Fixo / Motoboy */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Taxa de Entrega Fixa / Motoboy Local</h3>
                  <p className="text-xs text-zinc-400">Valor único cobrado para entregas em sua cidade ou região</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${fixedFreightEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {fixedFreightEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setFixedFreightEnabled(!fixedFreightEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    fixedFreightEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      fixedFreightEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {fixedFreightEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/70 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Valor Fixo do Frete (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                    <input
                      type="text"
                      value={fixedFreightPrice}
                      onChange={(e) => setFixedFreightPrice(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Descrição do Frete (exibido ao cliente)
                  </label>
                  <input
                    type="text"
                    value={fixedFreightDescription}
                    onChange={(e) => setFixedFreightDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Frete Grátis acima de X */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Regra de Frete Grátis</h3>
                  <p className="text-xs text-zinc-400">Ofereça entrega grátis automaticamente para pedidos acima de determinado valor</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${freeShippingEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {freeShippingEnabled ? 'Ativo' : 'Desativado'}
                </span>
                <button
                  type="button"
                  onClick={() => setFreeShippingEnabled(!freeShippingEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    freeShippingEnabled ? 'bg-emerald-500' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      freeShippingEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {freeShippingEnabled && (
              <div className="pt-2 border-t border-zinc-800/70 animate-fadeIn">
                <div className="max-w-xs">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Valor Mínimo para Frete Grátis (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                    <input
                      type="text"
                      value={freeShippingThreshold}
                      onChange={(e) => setFreeShippingThreshold(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Pedidos de valor igual ou superior ganham frete 100% gratuito.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
