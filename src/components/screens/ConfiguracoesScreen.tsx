import React, { useState } from 'react';
import {
  Store,
  MessageCircle,
  Globe,
  Database,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Download,
  PlusCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Shield,
  FileCode,
  CreditCard,
  Calculator,
  Palette,
  Zap,
  DownloadCloud,
  Settings,
  Sliders,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { PagamentosScreen } from './PagamentosScreen';
import { PrecificacaoScreen } from './PrecificacaoScreen';
import { AparenciaScreen } from './AparenciaScreen';
import { IntegracoesScreen } from './IntegracoesScreen';
import { ExportarScreen } from './ExportarScreen';
import { Client, Order, CatalogProduct, Transaction } from '../../types';

interface ConfiguracoesScreenProps {
  initialTab?: 'geral' | 'pagamentos' | 'precificacao' | 'aparencia' | 'integracoes' | 'exportar';
  onOpenCatalogPreview: () => void;
  onOpenUpgradeModal?: () => void;
  clients?: Client[];
  orders?: Order[];
  products?: CatalogProduct[];
  transactions?: Transaction[];
}

export const ConfiguracoesScreen: React.FC<ConfiguracoesScreenProps> = ({
  initialTab = 'geral',
  onOpenCatalogPreview,
  onOpenUpgradeModal = () => {},
  clients = [],
  orders = [],
  products = [],
  transactions = [],
}) => {
  const [activeTab, setActiveTab] = useState<
    'geral' | 'pagamentos' | 'precificacao' | 'aparencia' | 'integracoes' | 'exportar'
  >(initialTab);

  const [openSection, setOpenSection] = useState<string | null>('loja');

  // Dados da Loja
  const [nomeLoja, setNomeLoja] = useState('Silk Print Gráfica');
  const [razaoSocial, setRazaoSocial] = useState('Silk Print Comunicação Visual Ltda');
  const [cnpj, setCnpj] = useState('51.936.187/0001-20');
  const [emailContato, setEmailContato] = useState('contato@silkprint.com.br');
  const [endereco, setEndereco] = useState('Av. Industrial, 1420 - Sala 4 - Porto Alegre/RS');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('Segunda a Sexta: 08:30 às 18:00');
  const [subtituloCatalogo, setSubtituloCatalogo] = useState(
    'Kits, Comunicação Visual, Adesivos e Papelaria Personalizada'
  );
  const [linkCatalogo] = useState('cataloglab.app/@silkprint');
  const [linkCurto] = useState('ctlg.to/silkprint');

  // Contato
  const [whatsapp, setWhatsapp] = useState('51993618721');
  const [instagram, setInstagram] = useState('silkprintgrafica');

  // Backup checkboxes
  const [backupOptions, setBackupOptions] = useState({
    all: true,
    catalogo: true,
    clientes: true,
    pedidos: true,
    financeiro: true,
    identidade: true,
    configuracoes: true,
  });

  const [importMode, setImportMode] = useState<'aditiva' | 'restaurar'>('aditiva');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    showToast(`Link copiado: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleAllBackup = (checked: boolean) => {
    setBackupOptions({
      all: checked,
      catalogo: checked,
      clientes: checked,
      pedidos: checked,
      financeiro: checked,
      identidade: checked,
      configuracoes: checked,
    });
  };

  const toggleBackupOption = (key: keyof typeof backupOptions) => {
    setBackupOptions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      const allSelected =
        updated.catalogo &&
        updated.clientes &&
        updated.pedidos &&
        updated.financeiro &&
        updated.identidade &&
        updated.configuracoes;
      return { ...updated, all: allSelected };
    });
  };

  const handleDownloadBackup = () => {
    const backupData = {
      store: nomeLoja,
      cnpj,
      exportedAt: new Date().toISOString(),
      modules: backupOptions,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${nomeLoja.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
    showToast('Download do backup JSON iniciado com sucesso!');
  };

  const tabs = [
    { id: 'geral', label: 'Geral & Loja', icon: Settings },
    { id: 'pagamentos', label: 'Pagamentos & Frete', icon: CreditCard },
    { id: 'precificacao', label: 'Precificação & Custos', icon: Calculator },
    { id: 'aparencia', label: 'Aparência & Tema', icon: Palette },
    { id: 'integracoes', label: 'Integrações', icon: Zap },
    { id: 'exportar', label: 'Exportar Dados', icon: DownloadCloud },
  ] as const;

  return (
    <div id="screen-configuracoes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Configurações do Sistema
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie dados cadastrais, pagamentos, markups, identidade visual e integrações
          </p>
        </div>

        <button
          onClick={onOpenCatalogPreview}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span>Ver Catálogo</span>
        </button>
      </div>

      {/* Top Tabs Bar */}
      <div className="border-b border-zinc-800/80 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1 sm:gap-2 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab 1: Geral & Loja */}
      {activeTab === 'geral' && (
        <div className="space-y-4 max-w-5xl">
          {/* Accordion 1: Dados da Loja */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
            <button
              onClick={() => setOpenSection(openSection === 'loja' ? null : 'loja')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-blue-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-100 block">Identificação & Dados da Gráfica</span>
                  <span className="text-[11px] text-zinc-400">Nome fantasia, razão social, CNPJ e links</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Ativo
                </span>
                {openSection === 'loja' ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSection === 'loja' && (
              <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Nome Fantasia da Gráfica <span className="text-blue-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={nomeLoja}
                      onChange={(e) => setNomeLoja(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Razão Social
                    </label>
                    <input
                      type="text"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      E-mail de Contato
                    </label>
                    <input
                      type="email"
                      value={emailContato}
                      onChange={(e) => setEmailContato(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Endereço Completo / Balcão de Retirada
                  </label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Horário de Atendimento
                  </label>
                  <input
                    type="text"
                    value={horarioFuncionamento}
                    onChange={(e) => setHorarioFuncionamento(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Subtítulo do Catálogo
                  </label>
                  <textarea
                    rows={2}
                    value={subtituloCatalogo}
                    onChange={(e) => setSubtituloCatalogo(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500 resize-none"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Exibido no cabeçalho do catálogo para os clientes
                  </span>
                </div>

                {/* Link do catálogo */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Link do seu catálogo online
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={linkCatalogo}
                      className="flex-1 px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono select-all focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(`https://${linkCatalogo}`, 'link1')}
                      className="px-4 py-2.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {copiedField === 'link1' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copiar Link</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => showToast('Configurações da loja salvas com sucesso!')}
                    className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm"
                  >
                    Salvar Dados da Loja
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Contato & Redes Sociais */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
            <button
              onClick={() => setOpenSection(openSection === 'contato' ? null : 'contato')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-100 block">WhatsApp & Redes Sociais</span>
                  <span className="text-[11px] text-zinc-400">Canais de atendimento direto aos clientes</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {openSection === 'contato' ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSection === 'contato' && (
              <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Número do WhatsApp (com DDD)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: 51993618721"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Recebe os pedidos finalizados pelo catálogo
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Instagram da Gráfica
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                        @
                      </span>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => showToast('Contatos atualizados com sucesso!')}
                    className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-sm"
                  >
                    Salvar Contatos
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 3: Backup & Restauração */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
            <button
              onClick={() => setOpenSection(openSection === 'backup' ? null : 'backup')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-blue-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-100 block">Backup & Restauração JSON</span>
                  <span className="text-[11px] text-zinc-400">Exportação completa de segurança de todos os dados</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {openSection === 'backup' ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {openSection === 'backup' && (
              <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-4">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Faça download do arquivo JSON contendo todas as configurações, catálogo, clientes e pedidos da sua loja.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Backup Completo (.json)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Pagamentos & Frete */}
      {activeTab === 'pagamentos' && <PagamentosScreen />}

      {/* Tab 3: Precificação & Custos */}
      {activeTab === 'precificacao' && <PrecificacaoScreen />}

      {/* Tab 4: Aparência & Tema */}
      {activeTab === 'aparencia' && (
        <AparenciaScreen
          onOpenCatalogPreview={onOpenCatalogPreview}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}

      {/* Tab 5: Integrações */}
      {activeTab === 'integracoes' && <IntegracoesScreen />}

      {/* Tab 6: Exportar Dados */}
      {activeTab === 'exportar' && (
        <ExportarScreen
          clients={clients}
          orders={orders}
          products={products}
          transactions={transactions}
        />
      )}
    </div>
  );
};
