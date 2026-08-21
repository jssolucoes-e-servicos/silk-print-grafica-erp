import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { CatalogProduct, KitSubItem } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface CatalogoEcommerceProdutosScreenProps {
  products: CatalogProduct[];
  onOpenCatalogPreview: () => void;
  onAddProduct: (prod: CatalogProduct) => void;
  onDeleteProduct?: (id: string) => void;
}

const CATEGORIES = [
  'Produtos por m²',
  'Kit Variável',
  'Kit Fixo',
  'Tags',
  'Cartões',
  'Adesivos',
  'Blocos',
  'Panfletos',
  'Banners',
  'Agendas',
  'Presentes',
  'Cardápios',
  'Impressão',
  'Outros',
  'Sacolas',
];

export const CatalogoEcommerceProdutosScreen: React.FC<CatalogoEcommerceProdutosScreenProps> = ({
  products,
  onOpenCatalogPreview,
  onAddProduct,
  onDeleteProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Kit Variável');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for new kit / product
  const [kitName, setKitName] = useState('');
  const [kitPrice, setKitPrice] = useState('');
  const [kitProductionTime, setKitProductionTime] = useState('');
  const [kitDescription, setKitDescription] = useState('');
  const [kitItems, setKitItems] = useState<KitSubItem[]>([
    {
      id: 'sub-1',
      title: '',
      size: '',
      printType: '',
      paper: '',
      finishing: '',
      image: '',
    },
  ]);

  // Filter products for active category
  const activeProducts = products.filter((p) => {
    if (selectedCategory === 'Produtos por m²') {
      return p.isM2;
    }
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const totalCatalogCount = products.length;

  const handleAddItemSlot = () => {
    if (kitItems.length >= 4) return;
    setKitItems((prev) => [
      ...prev,
      {
        id: `sub-${Date.now()}`,
        title: '',
        size: '',
        printType: '',
        paper: '',
        finishing: '',
        image: '',
      },
    ]);
  };

  const handleRemoveItemSlot = (id: string) => {
    if (kitItems.length <= 1) return;
    setKitItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItemSlot = (id: string, field: keyof KitSubItem, val: string) => {
    setKitItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleCreateKit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(kitPrice.replace(',', '.'));
    if (!kitName.trim() || isNaN(priceNum)) return;

    const newProduct: CatalogProduct = {
      id: `prod-cat-${Date.now()}`,
      name: kitName.trim(),
      category: selectedCategory,
      price: priceNum,
      unit: selectedCategory.includes('Kit') ? 'kit' : 'unidade',
      productionTime: kitProductionTime.trim() || undefined,
      description: kitDescription.trim() || undefined,
      kitItems: kitItems.filter((i) => i.title.trim() !== ''),
      isActive: true,
      image:
        kitItems[0]?.image ||
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=60',
    };

    onAddProduct(newProduct);
    setIsModalOpen(false);
    // Reset
    setKitName('');
    setKitPrice('');
    setKitProductionTime('');
    setKitDescription('');
    setKitItems([
      {
        id: 'sub-1',
        title: '',
        size: '',
        printType: '',
        paper: '',
        finishing: '',
        image: '',
      },
    ]);
  };

  const handleImportMock = () => {
    const sampleKit: CatalogProduct = {
      id: `prod-sample-${Date.now()}`,
      name: 'Kit Empreendedor Semijoias',
      category: selectedCategory,
      price: 299.9,
      unit: 'kit',
      productionTime: '5 a 7 dias úteis',
      description: 'Kit completo com tags personalizadas, cartelas de brinco e adesivos lacre.',
      kitItems: [
        {
          id: 'sub-1',
          title: '200 Tag Brinco + 1 par de Corte',
          size: '4cm x 4cm',
          printType: '4x0 (Colorido)',
          paper: 'Couché 300g',
          finishing: 'Laminação Fosca Bopp',
          image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=60',
        },
        {
          id: 'sub-2',
          title: '100 Cartelas Gravatinha Corrente',
          size: '4cm x 9cm',
          printType: '4x0 (Colorido)',
          paper: 'Kraft 240g',
          finishing: 'Corte Especial',
        },
        {
          id: 'sub-3',
          title: '300 Adesivos Lacre Redondos',
          size: '3cm x 3cm',
          printType: '4x0 (Colorido)',
          paper: 'Vinil Brilho',
          finishing: 'Meio Corte',
        },
      ],
      isActive: true,
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=60',
    };
    onAddProduct(sampleKit);
  };

  return (
    <div id="screen-ecommerce-produtos" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Categories Scrollable Nav Bar */}
      <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="inline-flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-amber-400 shadow-xs border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            {selectedCategory}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {selectedCategory.includes('Kit')
              ? 'Gerencie seus kits promocionais (até 4 produtos por kit)'
              : `Gerencie produtos da categoria ${selectedCategory} exibidos no catálogo do e-commerce`}
          </p>
          <p className="text-xs text-zinc-500 mt-1 font-medium">
            Produtos cadastrados:{' '}
            <strong className="text-amber-400 font-mono font-bold">
              {activeProducts.length}
            </strong>{' '}
            / 40
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCatalogPreview}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Catálogo</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{selectedCategory.includes('Kit') ? '+ Novo Kit' : '+ Novo Produto'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Empty State (matches kit-1.png) or Product Grid */}
      {activeProducts.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-16 text-center flex flex-col items-center justify-center min-h-[360px] space-y-4">
          <p className="text-sm text-zinc-400 font-medium">
            {selectedCategory.includes('Kit')
              ? 'Nenhum kit cadastrado'
              : 'Nenhum produto cadastrado nesta categoria'}
          </p>
          <button
            onClick={handleImportMock}
            className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-2 shadow-xs group"
          >
            <Upload className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
            <span>Importar dados do catálogo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/80 transition-all overflow-hidden flex flex-col justify-between shadow-md group"
            >
              {/* Product Top Header / Image */}
              <div>
                <div className="relative h-40 bg-zinc-950 overflow-hidden flex items-center justify-center">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-zinc-700" />
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-950/80 backdrop-blur-xs text-amber-400 border border-amber-500/30">
                      {formatCurrency(prod.price)}
                    </span>
                  </div>
                  {prod.productionTime && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-black/70 backdrop-blur-xs text-zinc-300 border border-zinc-800">
                        ⏱️ {prod.productionTime}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                        {prod.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Ativo no Catálogo
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-100">{prod.name}</h3>
                    {prod.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}
                  </div>

                  {/* If it has kit items */}
                  {prod.kitItems && prod.kitItems.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                      <span className="text-[11px] font-semibold text-zinc-400 block">
                        Itens inclusos ({prod.kitItems.length}):
                      </span>
                      <div className="space-y-1">
                        {prod.kitItems.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="text-[11px] text-zinc-300 bg-zinc-950/60 border border-zinc-800/60 px-2.5 py-1.5 rounded-lg flex items-center justify-between"
                          >
                            <span className="font-medium truncate">{item.title}</span>
                            {item.size && (
                              <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-2">
                                {item.size}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={onOpenCatalogPreview}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Visualizar no catálogo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onDeleteProduct && (
                  <button
                    onClick={() => onDeleteProduct(prod.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Novo Kit Variável / Novo Produto (matches cadastro-kit.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-zinc-950">
              <h3 className="text-base font-bold text-zinc-100">
                {selectedCategory.includes('Kit') ? `Novo ${selectedCategory}` : `Novo Produto em ${selectedCategory}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleCreateKit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              {/* Row 1: Nome e Preço */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nome do Kit <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={kitName}
                    onChange={(e) => setKitName(e.target.value)}
                    placeholder="Kit Iniciante"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Preço (R$) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={kitPrice}
                    onChange={(e) => setKitPrice(e.target.value)}
                    placeholder="299.99"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 font-mono focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Prazo de Produção */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Prazo de Produção (opcional)
                </label>
                <input
                  type="text"
                  value={kitProductionTime}
                  onChange={(e) => setKitProductionTime(e.target.value)}
                  placeholder="Ex: 5 a 7 dias úteis"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Row 3: Descrição do Kit */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descrição do Kit
                </label>
                <textarea
                  rows={2}
                  value={kitDescription}
                  onChange={(e) => setKitDescription(e.target.value)}
                  placeholder="Descreva os detalhes do kit que serão exibidos no catálogo..."
                  className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500 resize-none"
                />
              </div>

              {/* Sub-Items of Kit (máx. 4) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-200">
                    Itens do Kit (máx. 4)
                  </label>
                  {kitItems.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddItemSlot}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {kitItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300">
                          Item {idx + 1}
                        </span>
                        {kitItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemSlot(item.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Título do Item */}
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Título do Item
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            handleUpdateItemSlot(item.id, 'title', e.target.value)
                          }
                          placeholder="Ex: 200 Tag Brinco + 1 par de Corte"
                          className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                        />
                      </div>

                      {/* Tamanho & Impressão */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                            Tamanho
                          </label>
                          <input
                            type="text"
                            value={item.size}
                            onChange={(e) =>
                              handleUpdateItemSlot(item.id, 'size', e.target.value)
                            }
                            placeholder="Ex: 4cm x 4cm"
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                            Impressão
                          </label>
                          <select
                            value={item.printType}
                            onChange={(e) =>
                              handleUpdateItemSlot(item.id, 'printType', e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                          >
                            <option value="">Selecione...</option>
                            <option value="4x0">4x0 (Frente Colorida)</option>
                            <option value="4x4">4x4 (Frente e Verso Colorido)</option>
                            <option value="4x1">4x1 (Frente Colorida / Verso P&B)</option>
                            <option value="1x0">1x0 (Preto e Branco)</option>
                          </select>
                        </div>
                      </div>

                      {/* Papel & Acabamento */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                            Papel
                          </label>
                          <select
                            value={item.paper}
                            onChange={(e) =>
                              handleUpdateItemSlot(item.id, 'paper', e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                          >
                            <option value="">Selecione...</option>
                            <option value="Couché 300g">Couché 300g</option>
                            <option value="Kraft 240g">Kraft 240g</option>
                            <option value="Offset 240g">Offset 240g</option>
                            <option value="Supremo 300g">Supremo 300g</option>
                            <option value="Duplex 250g">Duplex 250g</option>
                            <option value="Vinil Adesivo">Vinil Adesivo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                            Acabamento
                          </label>
                          <select
                            value={item.finishing}
                            onChange={(e) =>
                              handleUpdateItemSlot(item.id, 'finishing', e.target.value)
                            }
                            className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                          >
                            <option value="">Selecione...</option>
                            <option value="Laminação Fosca Bopp">Laminação Fosca Bopp</option>
                            <option value="Verniz Localizado UV">Verniz Localizado UV</option>
                            <option value="Corte Especial">Corte Especial / Vinco</option>
                            <option value="Refile Reto">Refile Reto</option>
                            <option value="Furo Central">Furo Central</option>
                            <option value="Meio Corte">Meio Corte</option>
                          </select>
                        </div>
                      </div>

                      {/* Imagem do Modelo Dropzone */}
                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Imagem do Modelo
                        </label>
                        <div className="border border-dashed border-zinc-700/80 hover:border-amber-500/60 rounded-lg p-3 text-center bg-zinc-950 flex flex-col items-center justify-center cursor-pointer transition-colors">
                          <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                          <span className="text-[10px] text-zinc-400">.png, .jpg...</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão de Criação */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-md shadow-amber-500/10"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
