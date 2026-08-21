import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  TrendingUp,
  DollarSign,
  Layers,
  Save,
  Check,
  HelpCircle,
  Sparkles,
  Plus,
  Trash2,
  Sliders,
  Scale,
  RefreshCw,
  Info,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface CategoryMarkup {
  id: string;
  category: string;
  markup: number;
  minMargin: number;
  targetMargin: number;
}

interface QuantityTierDiscount {
  id: string;
  minQty: number;
  maxQty: number;
  discountPercent: number;
}

export const PrecificacaoScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'geral' | 'categorias' | 'escalas' | 'custos' | 'simulador'>('geral');

  // Regras Gerais
  const [markupGeral, setMarkupGeral] = useState('2.5');
  const [margemLucroMinima, setMargemLucroMinima] = useState('35');
  const [margemLucroAlvo, setMargemLucroAlvo] = useState('50');
  const [taxaCartao, setTaxaCartao] = useState('3.99');
  const [descontoPix, setDescontoPix] = useState('5');
  const [roundingRule, setRoundingRule] = useState<'90' | '99' | '00' | 'none'>('90');

  // Custos Operacionais & Base
  const [custoHoraMaquina, setCustoHoraMaquina] = useState('45.00');
  const [custoHoraMaoDeObra, setCustoHoraMaoDeObra] = useState('30.00');
  const [custoM2Lona, setCustoM2Lona] = useState('18.50');
  const [custoM2Adesivo, setCustoM2Adesivo] = useState('14.00');
  const [custoTelaSilk, setCustoTelaSilk] = useState('35.00');
  const [custoMilheiroOffset, setCustoMilheiroOffset] = useState('45.00');

  // Categorias de Markup
  const [categoryMarkups, setCategoryMarkups] = useState<CategoryMarkup[]>([
    { id: 'cat-1', category: 'Banners & Lonas', markup: 2.8, minMargin: 40, targetMargin: 55 },
    { id: 'cat-2', category: 'Adesivos & Vinil', markup: 3.0, minMargin: 45, targetMargin: 60 },
    { id: 'cat-3', category: 'Têxtil & Silk Screen', markup: 2.4, minMargin: 35, targetMargin: 48 },
    { id: 'cat-4', category: 'Papelaria & Cartões de Visita', markup: 2.2, minMargin: 30, targetMargin: 45 },
    { id: 'cat-5', category: 'Brindes Personalizados', markup: 2.5, minMargin: 35, targetMargin: 50 },
    { id: 'cat-6', category: 'Sinalização & Placas ACM', markup: 2.9, minMargin: 42, targetMargin: 58 },
  ]);

  // Escalas Progressivas de Quantidade
  const [quantityTiers, setQuantityTiers] = useState<QuantityTierDiscount[]>([
    { id: 'tier-1', minQty: 1, maxQty: 10, discountPercent: 0 },
    { id: 'tier-2', minQty: 11, maxQty: 50, discountPercent: 5 },
    { id: 'tier-3', minQty: 51, maxQty: 100, discountPercent: 12 },
    { id: 'tier-4', minQty: 101, maxQty: 500, discountPercent: 20 },
    { id: 'tier-5', minQty: 501, maxQty: 99999, discountPercent: 28 },
  ]);

  // Simulador Interativo States
  const [simCustoInsumos, setSimCustoInsumos] = useState('50.00');
  const [simCustoAcabamento, setSimCustoAcabamento] = useState('15.00');
  const [simTempoProducaoHoras, setSimTempoProducaoHoras] = useState('0.5');
  const [simQuantidade, setSimQuantidade] = useState('10');
  const [simMarkup, setSimMarkup] = useState('2.5');

  const [salvo, setSalvo] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  // Cálculos do Simulador
  const custoInsumoNum = parseFloat(simCustoInsumos) || 0;
  const custoAcabNum = parseFloat(simCustoAcabamento) || 0;
  const tempoHorasNum = parseFloat(simTempoProducaoHoras) || 0;
  const qtdNum = Math.max(parseInt(simQuantidade) || 1, 1);
  const markupNum = parseFloat(simMarkup) || 2.5;
  const custoHoraNum = parseFloat(custoHoraMaquina) || 45;

  const custoTotalProducao = custoInsumoNum + custoAcabNum + tempoHorasNum * custoHoraNum;
  const custoUnitario = custoTotalProducao / qtdNum;
  const precoTotalSugerido = custoTotalProducao * markupNum;
  const precoUnitarioSugerido = precoTotalSugerido / qtdNum;
  const lucroTotal = precoTotalSugerido - custoTotalProducao;
  const margemLucroReal = precoTotalSugerido > 0 ? (lucroTotal / precoTotalSugerido) * 100 : 0;
  const precoPixSugerido = precoTotalSugerido * (1 - (parseFloat(descontoPix) || 0) / 100);

  const updateCategoryMarkup = (id: string, field: keyof CategoryMarkup, val: number | string) => {
    setCategoryMarkups(
      categoryMarkups.map((c) => (c.id === id ? { ...c, [field]: typeof val === 'string' ? parseFloat(val) || 0 : val } : c))
    );
  };

  const updateTierDiscount = (id: string, val: string) => {
    setQuantityTiers(
      quantityTiers.map((t) => (t.id === id ? { ...t, discountPercent: parseFloat(val) || 0 } : t))
    );
  };

  return (
    <div id="screen-precificacao" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            <Calculator className="w-6 h-6 text-amber-400" />
            <span>Precificação, Margens & Custos</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Defina markups por categoria, tabelas de descontos progressivos, custos operacionais e simule preços
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Precificação</span>
        </button>
      </div>

      {salvo && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>Regras e parâmetros de precificação atualizados com sucesso!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('geral')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'geral'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Regras Gerais & Taxas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categorias')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'categorias'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Markup por Categoria ({categoryMarkups.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('escalas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'escalas'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Descontos Progressivos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custos')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'custos'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Custos Operacionais Base</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'simulador'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Simulador em Tempo Real</span>
        </button>
      </div>

      {/* TAB 1: GERAL & TAXAS */}
      {activeTab === 'geral' && (
        <div className="space-y-5">
          {/* Card Multiplicadores */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Multiplicador Padrão & Margens Mínimas</h3>
                <p className="text-xs text-zinc-400">Regras padrão para itens sem categoria específica</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Markup Geral (Multiplicador de Custo)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={markupGeral}
                    onChange={(e) => setMarkupGeral(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono">x</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Ex: Custo R$ 10,00 * 2.5 = Venda R$ 25,00
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Margem de Lucro Mínima Alvo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={margemLucroMinima}
                    onChange={(e) => setMargemLucroMinima(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono">%</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Emite alerta caso orçamento fique abaixo
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Margem de Lucro Desejada
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={margemLucroAlvo}
                    onChange={(e) => setMargemLucroAlvo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono">%</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Meta ideal para precificação inteligente
                </span>
              </div>
            </div>
          </div>

          {/* Card Condições Comerciais */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Taxas Financeiras & Descontos Comerciais</h3>
                <p className="text-xs text-zinc-400">Descontos à vista e taxas médias de operadoras de cartão</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Desconto no PIX / Dinheiro à Vista
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={descontoPix}
                    onChange={(e) => setDescontoPix(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono">%</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Aplicado automaticamente na opção Pix
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Taxa Média de Cartão (Crédito/Débito)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={taxaCartao}
                    onChange={(e) => setTaxaCartao(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-zinc-500 font-mono">%</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Considerado no cálculo de lucro líquido
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Regra de Arredondamento de Preço
                </label>
                <select
                  value={roundingRule}
                  onChange={(e) => setRoundingRule(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-amber-500"
                >
                  <option value="90">Arredondar para .90 (ex: R$ 29,90)</option>
                  <option value="99">Arredondar para .99 (ex: R$ 29,99)</option>
                  <option value="00">Arredondar para .00 (ex: R$ 30,00)</option>
                  <option value="none">Sem arredondamento (Exato)</option>
                </select>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Padrão visual de preços no catálogo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MARKUP POR CATEGORIA */}
      {activeTab === 'categorias' && (
        <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Markup Específico por Linha de Produto</h3>
              <p className="text-xs text-zinc-400">
                Ajuste os multiplicadores de acordo com a complexidade de produção de cada segmento
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="pb-3 pl-2">Categoria Gráfica</th>
                  <th className="pb-3 text-center">Markup Multiplicador</th>
                  <th className="pb-3 text-center">Margem Mínima (%)</th>
                  <th className="pb-3 text-center">Margem Alvo (%)</th>
                  <th className="pb-3 text-right pr-2">Exemplo (Custo R$ 100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {categoryMarkups.map((cat) => {
                  const samplePrice = 100 * cat.markup;
                  return (
                    <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pl-2 font-medium text-zinc-200">
                        {cat.category}
                      </td>
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            step="0.1"
                            value={cat.markup}
                            onChange={(e) => updateCategoryMarkup(cat.id, 'markup', e.target.value)}
                            className="w-16 px-2 py-1 text-xs text-center bg-zinc-950 border border-zinc-800 rounded-lg text-amber-400 font-bold focus:outline-hidden focus:border-amber-500"
                          />
                          <span className="text-zinc-500">x</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            value={cat.minMargin}
                            onChange={(e) => updateCategoryMarkup(cat.id, 'minMargin', e.target.value)}
                            className="w-14 px-2 py-1 text-xs text-center bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 focus:outline-hidden focus:border-amber-500"
                          />
                          <span className="text-zinc-500">%</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center gap-1 font-mono">
                          <input
                            type="number"
                            value={cat.targetMargin}
                            onChange={(e) => updateCategoryMarkup(cat.id, 'targetMargin', e.target.value)}
                            className="w-14 px-2 py-1 text-xs text-center bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-400 font-bold focus:outline-hidden focus:border-amber-500"
                          />
                          <span className="text-zinc-500">%</span>
                        </div>
                      </td>
                      <td className="py-3 text-right pr-2 font-mono font-bold text-zinc-100">
                        {formatCurrency(samplePrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DESCONTOS PROGRESSIVOS POR QUANTIDADE */}
      {activeTab === 'escalas' && (
        <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Tabela de Descontos por Volume / Escala</h3>
              <p className="text-xs text-zinc-400">
                Descontos concedidos automaticamente em orçamentos e pedidos com base no volume de peças
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="pb-3 pl-2">Faixa de Quantidade</th>
                  <th className="pb-3 text-center">Desconto Aplicado</th>
                  <th className="pb-3 text-right pr-2">Impacto no Preço Unitário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {quantityTiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 pl-2 font-medium text-zinc-200">
                      {tier.maxQty > 1000 ? `A partir de ${tier.minQty} unidades` : `${tier.minQty} a ${tier.maxQty} unidades`}
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1 font-mono">
                        <input
                          type="number"
                          value={tier.discountPercent}
                          onChange={(e) => updateTierDiscount(tier.id, e.target.value)}
                          className="w-16 px-2 py-1 text-xs text-center bg-zinc-950 border border-zinc-800 rounded-lg text-amber-400 font-bold focus:outline-hidden focus:border-amber-500"
                        />
                        <span className="text-zinc-500">% OFF</span>
                      </div>
                    </td>
                    <td className="py-3 text-right pr-2 font-mono text-zinc-400">
                      {tier.discountPercent === 0 ? (
                        <span className="text-zinc-500">Preço Cheio (Tabela Base)</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          {(100 - tier.discountPercent)}% do valor de tabela
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOS OPERACIONAIS BASE */}
      {activeTab === 'custos' && (
        <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Custos Médios de Insumos & Máquinas</h3>
              <p className="text-xs text-zinc-400">Valores de referência para formação automática de preços</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Médio Hora/Máquina
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoHoraMaquina}
                  onChange={(e) => setCustoHoraMaquina(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">Depreciação, energia e manutenção</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Hora de Mão de Obra
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoHoraMaoDeObra}
                  onChange={(e) => setCustoHoraMaoDeObra(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">Salários e encargos por operador</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Base m² Lona Frontlight 440g
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoM2Lona}
                  onChange={(e) => setCustoM2Lona(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">Mídia + Tinta solvente/eco</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Base m² Adesivo Vinil Brilho/Fosco
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoM2Adesivo}
                  onChange={(e) => setCustoM2Adesivo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Base Tela de Silk (Gravação + Fotolito)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoTelaSilk}
                  onChange={(e) => setCustoTelaSilk(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Custo Base Milheiro Offset (Entrada)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-zinc-500">R$</span>
                <input
                  type="text"
                  value={custoMilheiroOffset}
                  onChange={(e) => setCustoMilheiroOffset(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SIMULADOR INTERATIVO EM TEMPO REAL */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs do Simulador */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-zinc-100">Parâmetros do Produto para Teste</h3>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Custo Total de Insumos / Matéria Prima (R$)
                </label>
                <input
                  type="number"
                  value={simCustoInsumos}
                  onChange={(e) => setSimCustoInsumos(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Custo de Acabamentos / Terceirização (R$)
                </label>
                <input
                  type="number"
                  value={simCustoAcabamento}
                  onChange={(e) => setSimCustoAcabamento(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Tempo de Máquina (Horas)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={simTempoProducaoHoras}
                    onChange={(e) => setSimTempoProducaoHoras(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Quantidade de Peças
                  </label>
                  <input
                    type="number"
                    value={simQuantidade}
                    onChange={(e) => setSimQuantidade(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Markup Aplicado (Multiplicador)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.2"
                    max="5.0"
                    step="0.1"
                    value={simMarkup}
                    onChange={(e) => setSimMarkup(e.target.value)}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-sm font-mono font-bold text-amber-400 min-w-[50px]">
                    {simMarkup}x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado do Cálculo */}
          <div className="p-5 md:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-100">Resultado do Preço Sugerido</h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                    margemLucroReal >= 45
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : margemLucroReal >= 30
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {margemLucroReal >= 45 ? 'Margem Excelente' : margemLucroReal >= 30 ? 'Margem Saudável' : 'Margem Baixa (Atenção)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[11px] text-zinc-400">Preço Unitário</span>
                  <div className="text-xl font-bold font-mono text-zinc-100">
                    {formatCurrency(precoUnitarioSugerido)}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Custo un: {formatCurrency(custoUnitario)}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-1">
                  <span className="text-[11px] text-amber-400 font-semibold">Valor Total ({qtdNum} un)</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {formatCurrency(precoTotalSugerido)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    No PIX (-{descontoPix}%): {formatCurrency(precoPixSugerido)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-zinc-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Custo Total de Produção:</span>
                  <span className="font-mono text-zinc-200">{formatCurrency(custoTotalProducao)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Lucro Bruto Previsto:</span>
                  <span className="font-mono font-bold text-emerald-400">+{formatCurrency(lucroTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Margem de Lucro Real:</span>
                  <span className="font-mono font-bold text-amber-400">{margemLucroReal.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Este cálculo inclui automaticamente o custo da máquina ({tempoHorasNum}h * {formatCurrency(custoHoraNum)}) e insumos declarados.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
