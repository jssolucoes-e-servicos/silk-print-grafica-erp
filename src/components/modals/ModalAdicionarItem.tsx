import React, { useState } from 'react';
import {
  X,
  Plus,
  Search,
  Check,
  Package,
  Layers,
  Ruler,
  Sliders,
  Calculator,
  Trash2,
} from 'lucide-react';
import { CatalogProduct, QuoteItem } from '../../types';
import { CATALOG_PRODUCTS } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';

interface ModalAdicionarItemProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: QuoteItem[]) => void;
}

export const ModalAdicionarItem: React.FC<ModalAdicionarItemProps> = ({
  isOpen,
  onClose,
  onAddItems,
}) => {
  const [activeTab, setActiveTab] = useState<'catalogo' | 'internos' | 'm2' | 'personalizado'>('catalogo');
  const [searchTerm, setSearchTerm] = useState('');
  const [stagedItems, setStagedItems] = useState<QuoteItem[]>([]);

  // State for "Por m²" sub-form
  const [selectedM2Product, setSelectedM2Product] = useState<CatalogProduct | null>(
    CATALOG_PRODUCTS.find((p) => p.isM2) || null
  );
  const [m2WidthCm, setM2WidthCm] = useState<number>(100);
  const [m2HeightCm, setM2HeightCm] = useState<number>(100);
  const [m2Quantity, setM2Quantity] = useState<number>(1);
  const [m2Finishings, setM2Finishings] = useState<string[]>(['Bainha reforçada', 'Ilhós a cada 50cm']);

  // State for "Personalizado" sub-form
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPricingType, setCustomPricingType] = useState<
    'unidade' | 'milheiro' | 'pacote' | 'hora'
  >('unidade');
  const [customQuantity, setCustomQuantity] = useState<number>(1);
  const [customUnitPrice, setCustomUnitPrice] = useState<string>('');

  if (!isOpen) return null;

  // Filtering products
  const catalogProducts = CATALOG_PRODUCTS.filter(
    (p) => !p.isInternal && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const internalProducts = CATALOG_PRODUCTS.filter(
    (p) => p.isInternal && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const m2Products = CATALOG_PRODUCTS.filter(
    (p) => p.isM2 && p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add simple catalog / internal product to staged items
  const handleAddDirectProduct = (product: CatalogProduct) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      name: product.name,
      description: `Categoria: ${product.category}`,
      sourceTab: product.isInternal ? 'internos' : 'catalogo',
      pricingType: 'unidade',
      quantity: product.minQty || 1,
      unitPrice: product.price,
      total: (product.minQty || 1) * product.price,
    };
    setStagedItems((prev) => [...prev, newItem]);
  };

  // Add M2 item
  const handleAddM2Item = () => {
    if (!selectedM2Product) return;
    const widthM = m2WidthCm / 100;
    const heightM = m2HeightCm / 100;
    const areaM2 = widthM * heightM;
    const basePrice = selectedM2Product.baseM2Price || selectedM2Product.price;
    const unitPriceCalculated = Math.round(areaM2 * basePrice * 100) / 100;
    const totalCalculated = Math.round(unitPriceCalculated * m2Quantity * 100) / 100;

    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      name: `${selectedM2Product.name} (${m2WidthCm}cm x ${m2HeightCm}cm)`,
      description: `Área: ${areaM2.toFixed(2)}m² | Acabamentos: ${
        m2Finishings.length > 0 ? m2Finishings.join(', ') : 'Nenhum'
      }`,
      sourceTab: 'm2',
      pricingType: 'm2',
      width: m2WidthCm,
      height: m2HeightCm,
      finishings: [...m2Finishings],
      quantity: m2Quantity,
      unitPrice: unitPriceCalculated,
      total: totalCalculated,
    };
    setStagedItems((prev) => [...prev, newItem]);
  };

  // Add Custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedUnitPrice = parseFloat(customUnitPrice.replace(',', '.'));
    if (!customName.trim() || isNaN(parsedUnitPrice) || parsedUnitPrice <= 0) {
      alert('Informe o nome do item e um valor unitário válido.');
      return;
    }

    const total = Math.round(customQuantity * parsedUnitPrice * 100) / 100;

    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      name: customName.trim(),
      description: customDescription.trim() || undefined,
      sourceTab: 'personalizado',
      pricingType: customPricingType,
      quantity: customQuantity,
      unitPrice: parsedUnitPrice,
      total,
    };

    setStagedItems((prev) => [...prev, newItem]);
    setCustomName('');
    setCustomDescription('');
    setCustomUnitPrice('');
    setCustomQuantity(1);
  };

  const handleRemoveStagedItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFinish = () => {
    if (stagedItems.length === 0) {
      alert('Adicione pelo menos um item à lista antes de finalizar.');
      return;
    }
    onAddItems(stagedItems);
    setStagedItems([]);
    onClose();
  };

  // M2 calculations preview
  const m2AreaPreview = ((m2WidthCm || 0) / 100) * ((m2HeightCm || 0) / 100);
  const m2BaseRate = selectedM2Product?.baseM2Price || selectedM2Product?.price || 90;
  const m2TotalPreview = m2AreaPreview * m2BaseRate * (m2Quantity || 1);

  // Custom preview
  const customUnitNumeric = parseFloat(customUnitPrice.replace(',', '.')) || 0;
  const customTotalPreview = customUnitNumeric * (customQuantity || 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-adicionar-item"
        className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Adicionar Item ao Orçamento
              </h3>
              <p className="text-xs text-zinc-400">
                Selecione do catálogo ou crie um item sob medida
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs Header */}
        <div className="px-6 pt-3 border-b border-zinc-800 bg-zinc-950/30">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="tab-catalogo"
              onClick={() => setActiveTab('catalogo')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === 'catalogo'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catálogo</span>
            </button>

            <button
              id="tab-internos"
              onClick={() => setActiveTab('internos')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === 'internos'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Internos</span>
            </button>

            <button
              id="tab-m2"
              onClick={() => setActiveTab('m2')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === 'm2'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Por m²</span>
            </button>

            <button
              id="tab-personalizado"
              onClick={() => setActiveTab('personalizado')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeTab === 'personalizado'
                  ? 'border-amber-500 text-amber-400 bg-zinc-800/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Personalizado</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {/* TAB 1: CATÁLOGO */}
          {activeTab === 'catalogo' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar um produto..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {catalogProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                  Nenhum produto encontrado no catálogo.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {catalogProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-200 truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {p.category} • {formatCurrency(p.price)} / {p.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddDirectProduct(p)}
                        className="px-2.5 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERNOS */}
          {activeTab === 'internos' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-400">
                Produtos internos (não aparecem no catálogo público para clientes).
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar insumos e serviços internos..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {internalProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/50 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-200 truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {formatCurrency(p.price)} / {p.unit}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddDirectProduct(p)}
                      className="px-2.5 py-1.5 rounded-md bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-zinc-950 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: POR M² */}
          {activeTab === 'm2' && (
            <div className="space-y-4">
              <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-400">
                Clique em um produto para configurar medidas e acabamentos
              </div>

              {/* Product selector */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Material / Produto em m²
                </label>
                <select
                  value={selectedM2Product?.id || ''}
                  onChange={(e) => {
                    const found = CATALOG_PRODUCTS.find((p) => p.id === e.target.value);
                    if (found) setSelectedM2Product(found);
                  }}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {m2Products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {formatCurrency(p.baseM2Price || p.price)}/m²
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Largura (cm)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={m2WidthCm}
                    onChange={(e) => setM2WidthCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={m2HeightCm}
                    onChange={(e) => setM2HeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Quantidade (unidades)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={m2Quantity}
                    onChange={(e) => setM2Quantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Finishes Checkboxes */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Acabamentos Inclusos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Bainha reforçada',
                    'Ilhós a cada 50cm',
                    'Madeira + Cordinha',
                    'Laminação Brilho',
                    'Laminação Fosca',
                    'Refile Reto',
                  ].map((finishing) => {
                    const isChecked = m2Finishings.includes(finishing);
                    return (
                      <label
                        key={finishing}
                        className={`flex items-center gap-2 p-2 rounded-md border text-xs cursor-pointer select-none transition-colors ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setM2Finishings((prev) => [...prev, finishing]);
                            } else {
                              setM2Finishings((prev) => prev.filter((f) => f !== finishing));
                            }
                          }}
                          className="hidden"
                        />
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-amber-500 border-amber-500 text-zinc-950'
                              : 'border-zinc-700'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{finishing}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Area and Total Summary */}
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">
                    Área unitária: <span className="font-mono text-zinc-200 font-semibold">{m2AreaPreview.toFixed(2)} m²</span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Preço base: {formatCurrency(m2BaseRate)}/m²
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider">Total Calculado</div>
                  <div className="text-base font-bold text-amber-400 font-mono">
                    {formatCurrency(m2TotalPreview)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddM2Item}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar Produto por m²</span>
              </button>
            </div>
          )}

          {/* TAB 4: PERSONALIZADO */}
          {activeTab === 'personalizado' && (
            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nome do Item <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Fachada em ACM com Letra Caixa Iluminada"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Detalhes técnicos, acabamentos específicos ou instruções..."
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Tipo de Precificação
                  </label>
                  <select
                    value={customPricingType}
                    onChange={(e) =>
                      setCustomPricingType(
                        e.target.value as 'unidade' | 'milheiro' | 'pacote' | 'hora'
                      )
                    }
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="unidade">Por Unidade</option>
                    <option value="milheiro">Por Milheiro (1.000 un)</option>
                    <option value="pacote">Por Pacote / Kit</option>
                    <option value="hora">Por Hora de Serviço</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Valor Unitário (R$) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customUnitPrice}
                    onChange={(e) => setCustomUnitPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Box de Total */}
              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Total do Item Personalizado</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {formatCurrency(customTotalPreview)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Adicionar</span>
              </button>
            </form>
          )}

          {/* Staged Items List (Preview) */}
          {stagedItems.length > 0 && (
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                <span>Itens Selecionados ({stagedItems.length})</span>
                <span>
                  Subtotal:{' '}
                  <span className="text-amber-400 font-mono">
                    {formatCurrency(
                      stagedItems.reduce((acc, item) => acc + item.total, 0)
                    )}
                  </span>
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                {stagedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-200 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {item.quantity}x {formatCurrency(item.unitPrice)} ={' '}
                        <span className="text-zinc-300 font-mono">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStagedItem(item.id)}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={stagedItems.length === 0}
            className={`px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
              stagedItems.length > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Finalizar ({stagedItems.length} {stagedItems.length === 1 ? 'item' : 'itens'})
          </button>
        </div>
      </div>
    </div>
  );
};
