import React, { useState } from 'react';
import {
  X,
  Package,
  Layers,
  Ruler,
  DollarSign,
  Clock,
  Tag,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  Globe,
  Lock,
  Sparkles,
  Printer,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  Calculator,
} from 'lucide-react';
import { CatalogProduct, Order, KitSubItem } from '../../types';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';

interface ModalDetalhesProdutoProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
  orders?: Order[];
  onUpdateProduct?: (updatedProduct: CatalogProduct) => void;
  onDeleteProduct?: (productId: string) => void;
  onToggleInternal?: (productId: string) => void;
  onDuplicateProduct?: (product: CatalogProduct) => void;
  onOpenCatalogPreview?: () => void;
  onOpenNovoPedidoComProduto?: (product: CatalogProduct) => void;
  onOpenOrderDetails?: (order: Order) => void;
}

export const ModalDetalhesProduto: React.FC<ModalDetalhesProdutoProps> = ({
  product,
  isOpen,
  onClose,
  orders = [],
  onUpdateProduct,
  onDeleteProduct,
  onToggleInternal,
  onDuplicateProduct,
  onOpenCatalogPreview,
  onOpenNovoPedidoComProduto,
  onOpenOrderDetails,
}) => {
  if (!isOpen || !product) return null;

  const [activeTab, setActiveTab] = useState<'geral' | 'simulador' | 'pedidos' | 'kit'>('geral');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);

  // Edit form state
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price.toString());
  const [cost, setCost] = useState(product.cost ? product.cost.toString() : '');
  const [unit, setUnit] = useState(product.unit);
  const [isM2, setIsM2] = useState(!!product.isM2);
  const [productionTime, setProductionTime] = useState(product.productionTime || '3 a 5 dias úteis');
  const [description, setDescription] = useState(product.description || '');
  const [paperType, setPaperType] = useState(product.paperType || '');
  const [image, setImage] = useState(product.image || '');

  // Simulator state
  const [simQty, setSimQty] = useState('100');
  const [simWidth, setSimWidth] = useState('100');
  const [simHeight, setSimHeight] = useState('100');
  const [simFinishing, setSimFinishing] = useState('0');

  React.useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setCost(product.cost ? product.cost.toString() : '');
      setUnit(product.unit);
      setIsM2(!!product.isM2);
      setProductionTime(product.productionTime || '3 a 5 dias úteis');
      setDescription(product.description || '');
      setPaperType(product.paperType || '');
      setImage(product.image || '');
      setIsEditing(false);
      setIsDeletingConfirm(false);
    }
  }, [product]);

  // Cost and margin calculations
  const parsedPrice = parseFloat(price) || product.price || 0;
  const parsedCost = parseFloat(cost) || product.cost || parsedPrice * 0.45;
  const profit = Math.max(0, parsedPrice - parsedCost);
  const profitMarginPercent = parsedPrice > 0 ? ((profit / parsedPrice) * 100).toFixed(1) : '0';

  // Simulator calculation
  const calcSimResult = () => {
    const qty = parseInt(simQty, 10) || 1;
    const finishingAdd = parseFloat(simFinishing) || 0;

    if (product.isM2) {
      const w = parseFloat(simWidth) || 100;
      const h = parseFloat(simHeight) || 100;
      const m2Single = (w / 100) * (h / 100);
      const totalM2 = m2Single * qty;
      const baseVal = totalM2 * product.price;
      const totalVal = baseVal + finishingAdd * qty;
      return { totalM2: totalM2.toFixed(2), totalVal, m2Single: m2Single.toFixed(2) };
    } else {
      const unitVal = product.price + finishingAdd;
      const totalVal = unitVal * qty;
      return { totalM2: '0', totalVal, m2Single: '0' };
    }
  };

  const simResult = calcSimResult();

  // Orders using this product
  const relatedOrders = orders.filter((o) => {
    const term = product.name.toLowerCase();
    const inDesc = o.description.toLowerCase().includes(term);
    const inItems = o.items?.some((i) => i.name.toLowerCase().includes(term));
    return inDesc || inItems;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(price.replace(',', '.'));
    const c = cost ? parseFloat(cost.replace(',', '.')) : undefined;

    if (!name.trim() || isNaN(p) || p < 0) return;

    const updated: CatalogProduct = {
      ...product,
      name: name.trim(),
      category: category.trim(),
      price: p,
      cost: c,
      unit: isM2 ? 'm²' : unit.trim(),
      isM2,
      productionTime: productionTime.trim() || undefined,
      description: description.trim() || undefined,
      paperType: paperType.trim() || undefined,
      image: image.trim() || undefined,
    };

    onUpdateProduct?.(updated);
    setIsEditing(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-zinc-900"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-zinc-100">{product.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {product.category}
                </span>
                <span className="text-[10px] text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700 font-mono">
                  {product.isM2 ? 'Cálculo por m²' : `Por ${product.unit}`}
                </span>
                {product.isInternal ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Interno
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> E-commerce
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Código: <span className="font-mono text-zinc-300">{product.id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="px-5 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNovoPedidoComProduto?.(product)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
            >
              <Package className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Gerar Pedido com Produto</span>
            </button>

            <button
              onClick={() => onToggleInternal?.(product.id)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {product.isInternal ? <Globe className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{product.isInternal ? 'Publicar no Catálogo' : 'Tornar Interno'}</span>
            </button>

            <button
              onClick={() => onDuplicateProduct?.(product)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isEditing
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancelando...' : 'Editar'}</span>
            </button>

            {!isDeletingConfirm ? (
              <button
                onClick={() => setIsDeletingConfirm(true)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 transition-colors"
                title="Excluir Produto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onDeleteProduct?.(product.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded-lg transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setIsDeletingConfirm(false)}
                  className="px-2 py-1 bg-zinc-800 text-zinc-300 text-[11px] rounded-lg"
                >
                  Não
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-zinc-950/40 border-b border-zinc-800/80">
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] text-zinc-400 block font-medium">Preço de Venda</span>
            <span className="text-base font-bold font-mono text-blue-400">
              {formatCurrency(product.price)}
              <span className="text-xs text-zinc-400 font-normal"> / {product.unit}</span>
            </span>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] text-zinc-400 block font-medium">Custo Estimado</span>
            <span className="text-base font-bold font-mono text-zinc-300">
              {formatCurrency(parsedCost)}
            </span>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] text-zinc-400 block font-medium">Margem de Lucro</span>
            <span className="text-base font-bold font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{profitMarginPercent}%</span>
            </span>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] text-zinc-400 block font-medium">Prazo de Produção</span>
            <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{product.productionTime || '3 a 5 dias úteis'}</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 bg-zinc-900 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('geral')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'geral'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ficha & Especificações
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'simulador'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador de Preço</span>
          </button>

          {product.kitItems && product.kitItems.length > 0 && (
            <button
              onClick={() => setActiveTab('kit')}
              className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'kit'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Itens do Kit ({product.kitItems.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pedidos'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Pedidos Recentes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] font-mono">
              {relatedOrders.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* TAB 1: GERAL / ESPECIFICAÇÕES */}
          {activeTab === 'geral' && (
            <div>
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Categoria
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="Cartões">Cartões</option>
                        <option value="Papelaria">Papelaria</option>
                        <option value="Adesivos">Adesivos</option>
                        <option value="Panfletos">Panfletos</option>
                        <option value="Banners">Banners</option>
                        <option value="Comunicação Visual">Comunicação Visual</option>
                        <option value="Brindes">Brindes</option>
                        <option value="Kits">Kits</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Preço Base de Venda (R$) *
                      </label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Custo Estimado de Fabricação (R$)
                      </label>
                      <input
                        type="text"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        placeholder="Ex: 25.00"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Modo de Cálculo
                      </label>
                      <div className="flex items-center gap-4 py-1.5">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="tipoCalc"
                            checked={!isM2}
                            onChange={() => setIsM2(false)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>Por Unidade</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="radio"
                            name="tipoCalc"
                            checked={isM2}
                            onChange={() => setIsM2(true)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span>Por Metro Quadrado (m²)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Papel / Gramatura / Substrato
                      </label>
                      <input
                        type="text"
                        value={paperType}
                        onChange={(e) => setPaperType(e.target.value)}
                        placeholder="Ex: Couchê 300g Brilho / Lona 440g"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Prazo de Produção
                      </label>
                      <input
                        type="text"
                        value={productionTime}
                        onChange={(e) => setProductionTime(e.target.value)}
                        placeholder="Ex: 3 a 5 dias úteis"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        URL da Imagem
                      </label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Descrição Detalhada do Produto
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detalhes sobre impressão, resolução de arte, gabarito e orientações para o cliente..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Visual card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-3">
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-400" />
                        <span>Ficha Técnica do Material</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Categoria</span>
                          <span className="font-semibold text-zinc-200">{product.category}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Modo de Precificação</span>
                          <span className="font-semibold text-zinc-200">
                            {product.isM2 ? 'Metro Quadrado (m²)' : 'Unidade'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Substrato / Papel</span>
                          <span className="font-semibold text-zinc-200">{product.paperType || 'Conforme especificação da ordem'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px]">Prazo de Entrega Estimado</span>
                          <span className="font-semibold text-zinc-200">{product.productionTime || '3 a 5 dias úteis'}</span>
                        </div>
                      </div>

                      {product.description && (
                        <div className="pt-3 border-t border-zinc-800/80">
                          <span className="text-zinc-500 block text-[11px] mb-1">Descrição Comercial</span>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {product.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Preço e Rentabilidade */}
                    <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Rentabilidade</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Preço de Venda:</span>
                            <span className="font-mono font-bold text-blue-400">{formatCurrency(product.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Custo Estimado:</span>
                            <span className="font-mono text-zinc-300">{formatCurrency(parsedCost)}</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-zinc-800 font-bold">
                            <span className="text-emerald-400">Lucro Bruto:</span>
                            <span className="font-mono text-emerald-400">+{formatCurrency(profit)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
                        <div className="text-[10px] text-zinc-400">Margem Comercial</div>
                        <div className="text-lg font-black text-emerald-400 font-mono">{profitMarginPercent}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SIMULADOR DE PREÇO */}
          {activeTab === 'simulador' && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span>Calculadora Rápida de Orçamento</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400">
                    Base: {formatCurrency(product.price)} / {product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.isM2 && (
                    <>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Largura (cm)</label>
                        <input
                          type="number"
                          value={simWidth}
                          onChange={(e) => setSimWidth(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">Altura (cm)</label>
                        <input
                          type="number"
                          value={simHeight}
                          onChange={(e) => setSimHeight(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Quantidade de Peças</label>
                    <input
                      type="number"
                      value={simQty}
                      onChange={(e) => setSimQty(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Acabamento Adicional (R$)</label>
                    <select
                      value={simFinishing}
                      onChange={(e) => setSimFinishing(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    >
                      <option value="0">Nenhum (+R$ 0,00)</option>
                      <option value="5">Ilhós nos 4 cantos (+R$ 5,00)</option>
                      <option value="12">Laminação Fosca Soft Touch (+R$ 12,00)</option>
                      <option value="20">Verniz Localizado UV (+R$ 20,00)</option>
                      <option value="15">Corte Especial / Refile (+R$ 15,00)</option>
                    </select>
                  </div>
                </div>

                {/* Simulation Output Card */}
                <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] text-blue-300 font-semibold block">Resultado da Simulação</span>
                    <div className="text-xs text-zinc-400">
                      {product.isM2 ? (
                        <span>
                          Área unitária: <b className="text-zinc-200">{simResult.m2Single} m²</b> | Área total:{' '}
                          <b className="text-zinc-200">{simResult.totalM2} m²</b>
                        </span>
                      ) : (
                        <span>
                          Quantidade total: <b className="text-zinc-200">{simQty} unidades</b>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="text-[10px] text-zinc-400 block">Preço Final Sugerido</span>
                    <span className="text-xl font-black font-mono text-emerald-400">
                      {formatCurrency(simResult.totalVal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ITENS DO KIT (Se for Kit) */}
          {activeTab === 'kit' && product.kitItems && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-300">Sub-itens Inclusos neste Kit</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.kitItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-blue-400 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div className="text-xs flex-1">
                      <div className="font-bold text-zinc-100">{item.title}</div>
                      <div className="text-zinc-400 text-[11px] mt-0.5 space-y-0.5">
                        {item.size && <div>Tamanho: {item.size}</div>}
                        {item.paper && <div>Papel: {item.paper}</div>}
                        {item.finishing && <div>Acabamento: {item.finishing}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PEDIDOS RECENTES */}
          {activeTab === 'pedidos' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-300">
                Ordens de Serviço Recentes utilizando este Produto ({relatedOrders.length})
              </h3>

              {relatedOrders.length === 0 ? (
                <div className="p-8 text-center bg-zinc-950/40 rounded-xl border border-zinc-800/80 space-y-2">
                  <Package className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Nenhum pedido recente com este produto registrado.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => onOpenOrderDetails?.(ord)}
                      className="p-3 bg-zinc-950/70 hover:bg-zinc-800/60 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-zinc-700"
                    >
                      <div>
                        <div className="font-semibold text-xs text-zinc-100 flex items-center gap-2">
                          <span className="font-mono text-blue-400">{ord.code}</span>
                          <span>•</span>
                          <span>{ord.clientName}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{ord.description}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-zinc-200">
                          {formatCurrency(ord.total)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
