import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { FinishingItem } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface AcabamentosScreenProps {
  finishings: FinishingItem[];
  onAddFinishing: (finishing: Omit<FinishingItem, 'id'>) => void;
  onRemoveFinishing: (id: string) => void;
}

export const AcabamentosScreen: React.FC<AcabamentosScreenProps> = ({
  finishings,
  onAddFinishing,
  onRemoveFinishing,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [pricingType, setPricingType] = useState<'unidade' | 'm2' | 'fixo'>('unidade');
  const [value, setValue] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const numVal = parseFloat(value.replace(',', '.')) || 0;

    onAddFinishing({
      name: name.trim(),
      category: 'Geral',
      price: numVal,
      pricingType,
      isActive: true,
    });

    setName('');
    setValue('');
    setIsAdding(false);
  };

  return (
    <div id="screen-acabamentos" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
          <Scissors className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
            Acabamentos
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Lista global de acabamentos adicionais disponíveis em orçamentos e pedidos.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Acabamentos Adicionais</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Serão exibidos ao adicionar um produto desta categoria em orçamentos e pedidos.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Novo</span>
            </button>
          )}
        </div>

        {/* Inline Add Form */}
        {isAdding && (
          <form
            onSubmit={handleSave}
            className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3 animate-in fade-in duration-150"
          >
            <div className="text-xs font-semibold text-zinc-300">Novo Acabamento</div>
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome (ex: Laminação Brilho)"
                required
                className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={pricingType}
                  onChange={(e) => setPricingType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="unidade">Por unidade</option>
                  <option value="m2">Por m²</option>
                  <option value="fixo">Valor fixo por pedido</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Valor (ex: 0,50)"
                  className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-zinc-500">
              {pricingType === 'unidade'
                ? 'Será multiplicado pela quantidade do pedido.'
                : pricingType === 'm2'
                ? 'Será multiplicado pela metragem quadrada total.'
                : 'Valor único adicionado ao pedido.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        )}

        {/* List of Finishings or Empty state */}
        {finishings.length === 0 && !isAdding ? (
          <div className="p-8 border border-dashed border-zinc-800/80 rounded-xl text-center text-xs text-zinc-500">
            Nenhum acabamento cadastrado ainda.
          </div>
        ) : (
          finishings.length > 0 && (
            <div className="space-y-2">
              {finishings.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-zinc-200">{item.name}</div>
                    <div className="text-[11px] text-zinc-500 capitalize">
                      Tipo: {item.pricingType === 'unidade' ? 'Por unidade' : item.pricingType === 'm2' ? 'Por m²' : 'Valor Fixo'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-400">
                      {formatCurrency(item.price)}
                    </span>
                    <button
                      onClick={() => onRemoveFinishing(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
