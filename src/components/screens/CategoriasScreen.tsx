import React, { useState } from 'react';
import {
  GripVertical,
  Lock,
  ArrowUp,
  ArrowDown,
  Gift,
  Package,
  Tag,
  CreditCard,
  Layers,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Printer,
  BookOpen,
  Utensils,
  Image as ImageIcon,
} from 'lucide-react';

interface CategoriasScreenProps {
  onOpenUpgradeModal: () => void;
  onOpenCatalogPreview: () => void;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  isLocked?: boolean;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Kit Variável', icon: Gift },
  { id: 'cat-2', name: 'Kit Fixo', icon: Package },
  { id: 'cat-3', name: 'Tags / Cartelas', icon: Tag },
  { id: 'cat-4', name: 'Cartões', icon: CreditCard },
  { id: 'cat-5', name: 'Adesivos', icon: Layers },
  { id: 'cat-6', name: 'Blocos & Talões', icon: FileText },
  { id: 'cat-7', name: 'Panfletos', icon: FileText },
  { id: 'cat-8', name: 'Banners & Lonas', icon: ImageIcon },
  { id: 'cat-9', name: 'Agendas & Planners', icon: BookOpen },
  { id: 'cat-10', name: 'Presentes Personalizados', icon: Sparkles },
  { id: 'cat-11', name: 'Cardápios', icon: Utensils },
  { id: 'cat-12', name: 'Impressão Digital', icon: Printer },
  { id: 'cat-13', name: 'Sacolas Personalizadas', icon: ShoppingBag },
  { id: 'cat-14', name: 'Outros', icon: Sparkles },
];

export const CategoriasScreen: React.FC<CategoriasScreenProps> = ({
  onOpenUpgradeModal,
  onOpenCatalogPreview,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;
    setCategories(newCategories);
  };

  return (
    <div id="screen-categorias" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Organizar Categorias
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5 max-w-2xl leading-relaxed">
            Arraste as categorias para definir a ordem de exibição no catálogo. A primeira
            categoria com produtos será exibida como padrão.
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

      {/* Card 1: Categorias Personalizadas (Plano Pro Locked) */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-5 md:p-6 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-100">Categorias Personalizadas</h3>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-3 h-3" />
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            Recurso exclusivo dos Planos Pro
          </span>
        </div>

        <div className="rounded-xl bg-zinc-950/80 border border-zinc-800 p-8 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
            <Lock className="w-5 h-5 text-amber-400/80" />
          </div>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            Faça upgrade para criar categorias personalizadas com nomes e ícones customizados.
          </p>
          <button
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Ver planos</span>
          </button>
        </div>
      </div>

      {/* Card 2: Ordem das Categorias */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-5 md:p-6 shadow-md space-y-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-100">Ordem das Categorias</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            A primeira categoria da lista com produtos será a aba aberta por padrão no seu
            catálogo.
          </p>
        </div>

        <div className="space-y-2">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 cursor-grab shrink-0" />
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {cat.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveCategory(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveCategory(index, 'down')}
                    disabled={index === categories.length - 1}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
