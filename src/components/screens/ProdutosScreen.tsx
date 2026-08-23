import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Layers,
  Ruler,
  ExternalLink,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { CatalogProduct } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface ProdutosScreenProps {
  products: CatalogProduct[];
  onOpenCatalogPreview: () => void;
  onAddProduct?: (prod: CatalogProduct) => void;
  onOpenProductDetails?: (product: CatalogProduct) => void;
}

export const ProdutosScreen: React.FC<ProdutosScreenProps> = ({
  products,
  onOpenCatalogPreview,
  onAddProduct,
  onOpenProductDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [categoriaFilter, setCategoriaFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form state
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Papelaria');
  const [novoPreco, setNovoPreco] = useState('');
  const [novoTipoCalculo, setNovoTipoCalculo] = useState<'unit' | 'm2'>('unit');
  const [novaDescricao, setNovaDescricao] = useState('');

  const totalProdutos = products.length;
  const porUnidade = products.filter((p) => !p.isM2).length;
  const porM2 = products.filter((p) => p.isM2).length;

  const filtered = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term);
    const matchTipo =
      tipoFilter === 'Todos' ||
      (tipoFilter === 'Unidade' && !p.isM2) ||
      (tipoFilter === 'm²' && p.isM2);
    const matchCategoria =
      categoriaFilter === 'Todas' || p.category === categoriaFilter;
    return matchSearch && matchTipo && matchCategoria;
  });

  const handleSaveNovoProduto = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPreco = parseFloat(novoPreco.replace(',', '.'));
    if (!novoNome.trim() || isNaN(parsedPreco) || parsedPreco < 0) {
      return;
    }

    const newProd: CatalogProduct = {
      id: `prod-${Date.now()}`,
      name: novoNome.trim(),
      category: novaCategoria,
      price: parsedPreco,
      unit: novoTipoCalculo === 'm2' ? 'm²' : 'un',
      isM2: novoTipoCalculo === 'm2',
      isInternal: true,
      description: novaDescricao.trim() || undefined,
    };

    onAddProduct?.(newProd);
    setIsModalOpen(false);
    setNovoNome('');
    setNovoPreco('');
    setNovaDescricao('');
  };

  return (
    <div id="screen-produtos-internos" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Produtos Internos
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Gerencie produtos para uso exclusivo em orçamentos e pedidos manuais
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Novo Produto</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Total Produtos</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{totalProdutos}</div>
        </div>

        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Por Unidade</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{porUnidade}</div>
        </div>

        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/80 p-4 space-y-1">
          <div className="text-xs text-zinc-400">Por m²</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{porM2}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto interno..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400">Tipo:</span>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden"
            >
              <option value="Todos">Todos</option>
              <option value="Unidade">Unidade</option>
              <option value="m²">Por m²</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-zinc-400">Categoria:</span>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden"
            >
              <option value="Todas">Todas</option>
              <option value="Papelaria">Papelaria</option>
              <option value="Comunicação Visual">Comunicação Visual</option>
              <option value="Adesivos">Adesivos</option>
              <option value="Brindes">Brindes</option>
              <option value="Cartões">Cartões</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content: Empty State or Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/80 p-16 text-center flex flex-col items-center justify-center min-h-[280px] space-y-4">
          <Package className="w-12 h-12 text-zinc-600 stroke-[1.2]" />
          <p className="text-xs text-zinc-400 font-medium">Nenhum produto interno cadastrado</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Cadastrar Primeiro Produto</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              onClick={() => onOpenProductDetails?.(prod)}
              className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors cursor-pointer group hover:bg-zinc-850"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {prod.category}
                  </span>
                  <span className="text-[10px] text-zinc-400 px-2 py-0.5 bg-zinc-950 rounded border border-zinc-800 font-mono">
                    {prod.isM2 ? 'Por m²' : 'Unidade'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100">{prod.name}</h3>
                {prod.description && (
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prod.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 block">Preço Base</span>
                  <span className="text-sm font-mono font-bold text-blue-400">
                    {formatCurrency(prod.price)}
                    <span className="text-xs text-zinc-400 font-normal"> / {prod.unit}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <button className="p-1.5 hover:bg-zinc-800 hover:text-zinc-200 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Novo Produto Interno */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
              <h3 className="text-base font-bold text-zinc-100">Novo Produto Interno</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNovoProduto} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nome do Produto <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Lona Frontlight 440g"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Papelaria">Papelaria</option>
                    <option value="Comunicação Visual">Comunicação Visual</option>
                    <option value="Adesivos">Adesivos</option>
                    <option value="Brindes">Brindes</option>
                    <option value="Cartões">Cartões</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Tipo de Cálculo
                  </label>
                  <select
                    value={novoTipoCalculo}
                    onChange={(e) => setNovoTipoCalculo(e.target.value as 'unit' | 'm2')}
                    className="w-full px-3 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="unit">Por Unidade</option>
                    <option value="m2">Por Metro Quadrado (m²)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Preço Base (R$) <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={novoPreco}
                  onChange={(e) => setNovoPreco(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Descrição (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Especificações do material..."
                  className="w-full px-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                >
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
