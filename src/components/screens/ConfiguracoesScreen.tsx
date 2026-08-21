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
} from 'lucide-react';

interface ConfiguracoesScreenProps {
  onOpenCatalogPreview: () => void;
  onOpenUpgradeModal: () => void;
}

export const ConfiguracoesScreen: React.FC<ConfiguracoesScreenProps> = ({
  onOpenCatalogPreview,
  onOpenUpgradeModal,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('loja');

  // Dados da Loja
  const [nomeLoja, setNomeLoja] = useState('Silk Print Grafica');
  const [subtituloCatalogo, setSubtituloCatalogo] = useState(
    'Kits e Cartelas Personalizadas para Semijoias'
  );
  const [linkCatalogo] = useState('cataloglab.com.br/silkprint');
  const [linkCurto] = useState('ctlg.com.br/silkprint');

  // Contato
  const [whatsapp, setWhatsapp] = useState('51936187210');
  const [instagram, setInstagram] = useState('silkprint');

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

  // Import Mode
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

  return (
    <div id="screen-configuracoes" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Configurações
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Informações gerais da sua loja
          </p>
        </div>

        <button
          onClick={onOpenCatalogPreview}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Catálogo</span>
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Accordions */}
      <div className="space-y-4">
        {/* 1. Dados da Loja */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
          <button
            onClick={() => setOpenSection(openSection === 'loja' ? null : 'loja')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Dados da Loja</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Preenchido
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
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome da Loja <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  value={nomeLoja}
                  onChange={(e) => setNomeLoja(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-amber-500"
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
                  className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-amber-500 resize-none"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Aparece abaixo do logo no catálogo
                </span>
              </div>

              {/* Link do catálogo */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Link do seu catálogo
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
                    <span>Copiar</span>
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Compartilhe este link com seus clientes: {linkCatalogo}
                </span>
              </div>

              {/* Link curto */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Link curto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={linkCurto}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopy(`https://${linkCurto}`, 'link2')}
                    className="px-4 py-2.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {copiedField === 'link2' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copiar</span>
                  </button>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Versão curta para compartilhar: {linkCurto}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. Contato */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
          <button
            onClick={() => setOpenSection(openSection === 'contato' ? null : 'contato')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Contato</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                WhatsApp e Insta
              </span>
              {openSection === 'contato' ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </button>

          {openSection === 'contato' && (
            <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  WhatsApp
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-zinc-950 border border-r-0 border-zinc-800 rounded-l-xl text-xs font-semibold text-zinc-400">
                    +55
                  </span>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="71999513994"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-r-xl text-zinc-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Digite apenas DDD + número (ex: 71999513994)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Instagram
                </label>
                <div className="flex items-center">
                  <span className="px-3.5 py-2.5 bg-zinc-950 border border-r-0 border-zinc-800 rounded-l-xl text-xs font-semibold text-zinc-400">
                    @
                  </span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="sualoja"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-r-xl text-zinc-200 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Domínio Personalizado */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
          <button
            onClick={() => setOpenSection(openSection === 'dominio' ? null : 'dominio')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Domínio Personalizado</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                Em breve
              </span>
              {openSection === 'dominio' ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </button>

          {openSection === 'dominio' && (
            <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Conecte seu próprio domínio (ex: <span className="font-mono text-zinc-300">loja.silkprint.com.br</span>)
                diretamente ao seu catálogo sem custos adicionais de hospedagem.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-300 font-medium">Recurso em fase final de homologação SSL.</span>
                <span className="text-[11px] font-semibold text-amber-400">Notificar lançamento</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Backup dos meus dados */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
          <button
            onClick={() => setOpenSection(openSection === 'backup' ? null : 'backup')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Backup dos meus dados</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full">
                JSON Export
              </span>
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
                Exporte um backup completo da sua loja em formato JSON. Selecione as categorias desejadas:
              </p>

              {/* Checkboxes List */}
              <div className="space-y-2 pt-1">
                {/* Selecionar tudo */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.all}
                    onChange={(e) => toggleAllBackup(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-zinc-200">Selecionar tudo</span>
                </label>

                {/* Catálogo */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.catalogo}
                    onChange={() => toggleBackupOption('catalogo')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Catálogo</span>
                    <span className="text-[11px] text-zinc-500">
                      Produtos, categorias, preços e variações
                    </span>
                  </div>
                </label>

                {/* Clientes */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.clientes}
                    onChange={() => toggleBackupOption('clientes')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Clientes</span>
                    <span className="text-[11px] text-zinc-500">
                      Dados de clientes cadastrados
                    </span>
                  </div>
                </label>

                {/* Pedidos */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.pedidos}
                    onChange={() => toggleBackupOption('pedidos')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Pedidos</span>
                    <span className="text-[11px] text-zinc-500">
                      Pedidos com itens, status e vínculo com clientes
                    </span>
                  </div>
                </label>

                {/* Financeiro */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.financeiro}
                    onChange={() => toggleBackupOption('financeiro')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Financeiro</span>
                    <span className="text-[11px] text-zinc-500">
                      Entradas, saídas e formas de pagamento
                    </span>
                  </div>
                </label>

                {/* Identidade visual */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.identidade}
                    onChange={() => toggleBackupOption('identidade')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Identidade visual</span>
                    <span className="text-[11px] text-zinc-500">
                      Logo, cores e configurações visuais
                    </span>
                  </div>
                </label>

                {/* Configurações */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={backupOptions.configuracoes}
                    onChange={() => toggleBackupOption('configuracoes')}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">Configurações</span>
                    <span className="text-[11px] text-zinc-500">
                      Status personalizados, preferências da loja
                    </span>
                  </div>
                </label>
              </div>

              {/* Botão Baixar backup */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full py-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Baixar backup</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Importar Catálogo */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 overflow-hidden shadow-md">
          <button
            onClick={() => setOpenSection(openSection === 'importar' ? null : 'importar')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-amber-400">
                <UploadCloud className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Importar Catálogo</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                JSON
              </span>
              {openSection === 'importar' ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </button>

          {openSection === 'importar' && (
            <div className="p-5 md:p-6 border-t border-zinc-800/80 bg-zinc-950/40 space-y-4">
              {/* 2 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Importação Aditiva */}
                <div
                  onClick={() => setImportMode('aditiva')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    importMode === 'aditiva'
                      ? 'bg-zinc-900 border-amber-500 ring-1 ring-amber-500/30 shadow-md'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-amber-400">
                    <PlusCircle className="w-5 h-5" />
                    <h4 className="text-xs font-bold text-zinc-100">Importação Aditiva</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Os produtos importados serão adicionados ao seu catálogo. Nenhum dado existente será alterado ou removido.
                  </p>
                </div>

                {/* Card 2: Restaurar Backup Completo */}
                <div
                  onClick={() => setImportMode('restaurar')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 opacity-75 ${
                    importMode === 'restaurar'
                      ? 'bg-zinc-900 border-amber-500 ring-1 ring-amber-500/30'
                      : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-zinc-400">
                    <RotateCcw className="w-5 h-5" />
                    <h4 className="text-xs font-bold text-zinc-200">Restaurar Backup Completo</h4>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Todos os seus dados atuais serão substituídos pelo backup. Use apenas para restaurar uma conta do zero.{' '}
                    <em className="text-amber-400/80 not-italic block mt-1">Em manutenção — disponível em breve.</em>
                  </p>
                </div>
              </div>

              {/* Info text */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                <span className="text-amber-400 font-bold">ℹ️</span>
                <span>
                  <strong>Importação aditiva:</strong> Os produtos importados serão adicionados ao seu catálogo. Nenhum produto existente será alterado ou removido.
                </span>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-xl p-8 text-center bg-zinc-950/80 flex flex-col items-center justify-center space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500">
                  <FileCode className="w-6 h-6" />
                </div>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Selecionar arquivo JSON</span>
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        showToast(`Arquivo selecionado: ${e.target.files[0].name}. Dados prontos para sincronizar!`);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating / Bottom Save Bar */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={() => showToast('Configurações da loja salvas com sucesso!')}
          className="px-6 py-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Salvar Configurações</span>
        </button>
      </div>
    </div>
  );
};
