import React, { useState } from 'react';
import {
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Building2,
  User,
  Package,
} from 'lucide-react';
import { Client } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface DeclaracaoConteudoScreenProps {
  clients: Client[];
}

interface ItemRow {
  id: string;
  descricao: string;
  qtd: number;
  valor: number;
}

export const DeclaracaoConteudoScreen: React.FC<DeclaracaoConteudoScreenProps> = ({
  clients,
}) => {
  // Remetente
  const [remetenteNome, setRemetenteNome] = useState('Silk Print Grafica');
  const [remetenteDoc, setRemetenteDoc] = useState('00.000.000/0000-00');
  const [remetenteEndereco, setRemetenteEndereco] = useState('Rua Principal, 100 - Centro');
  const [remetenteCidade, setRemetenteCidade] = useState('Salvador');
  const [remetenteUF, setRemetenteUF] = useState('BA');
  const [remetenteCEP, setRemetenteCEP] = useState('40000-000');

  // Destinatário
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [destinatarioDoc, setDestinatarioDoc] = useState('');
  const [destinatarioEndereco, setDestinatarioEndereco] = useState('');
  const [destinatarioCidade, setDestinatarioCidade] = useState('');
  const [destinatarioUF, setDestinatarioUF] = useState('SP');
  const [destinatarioCEP, setDestinatarioCEP] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);

  // Itens
  const [itens, setItens] = useState<ItemRow[]>([
    { id: '1', descricao: '', qtd: 1, valor: 0 },
    { id: '2', descricao: '', qtd: 1, valor: 0 },
  ]);
  const [pesoTotal, setPesoTotal] = useState('0.500');

  const handleAddItem = () => {
    setItens([
      ...itens,
      { id: String(Date.now()), descricao: '', qtd: 1, valor: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItens(
      itens.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSelectClient = (client: Client) => {
    setDestinatarioNome(client.name);
    setDestinatarioDoc(client.cpfCnpj || '');
    setDestinatarioEndereco(
      client.endereco
        ? `${client.endereco}, ${client.numero || 'S/N'}${client.bairro ? ` - ${client.bairro}` : ''}`
        : ''
    );
    setDestinatarioCidade(client.cidade || '');
    setDestinatarioUF(client.estado || 'SP');
    setDestinatarioCEP(client.cep || '');
    setShowClientPicker(false);
  };

  const totalQuantidade = itens.reduce((sum, i) => sum + (Number(i.qtd) || 0), 0);
  const totalValor = itens.reduce((sum, i) => sum + ((Number(i.qtd) || 0) * (Number(i.valor) || 0)), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="screen-declaracao" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tight text-center">
          Declaração de Conteúdo
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-1 text-center">
          Preencha as informações à esquerda e visualize o documento à direita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Remetente Card */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Remetente</span>
              </div>
              <button
                onClick={() => {
                  setRemetenteNome('Silk Print Grafica');
                  setRemetenteDoc('00.000.000/0000-00');
                  setRemetenteEndereco('Rua Principal, 100 - Centro');
                  setRemetenteCidade('Salvador');
                  setRemetenteUF('BA');
                  setRemetenteCEP('40000-000');
                }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                title="Restaurar padrão"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Nome / Razão Social</label>
              <input
                type="text"
                value={remetenteNome}
                onChange={(e) => setRemetenteNome(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={remetenteDoc}
                onChange={(e) => setRemetenteDoc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Endereço</label>
              <input
                type="text"
                value={remetenteEndereco}
                onChange={(e) => setRemetenteEndereco(e.target.value)}
                placeholder="Rua, número, bairro"
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-3">
                <label className="block text-[11px] text-zinc-400 mb-1">Cidade</label>
                <input
                  type="text"
                  value={remetenteCidade}
                  onChange={(e) => setRemetenteCidade(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] text-zinc-400 mb-1">UF</label>
                <input
                  type="text"
                  value={remetenteUF}
                  onChange={(e) => setRemetenteUF(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center uppercase focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-zinc-400 mb-1">CEP</label>
                <input
                  type="text"
                  value={remetenteCEP}
                  onChange={(e) => setRemetenteCEP(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Destinatário Card */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <User className="w-4 h-4 text-amber-400" />
                <span>Destinatário</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientPicker(!showClientPicker)}
                  className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Search className="w-3 h-3 text-amber-400" />
                  <span>Buscar cliente</span>
                </button>
                <button
                  onClick={() => {
                    setDestinatarioNome('');
                    setDestinatarioDoc('');
                    setDestinatarioEndereco('');
                    setDestinatarioCidade('');
                    setDestinatarioUF('SP');
                    setDestinatarioCEP('');
                  }}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title="Limpar destinatário"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Client quick picker dropdown */}
            {showClientPicker && (
              <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-500/40 space-y-1.5 animate-in fade-in">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">
                  Selecione um cliente cadastrado:
                </span>
                {clients.length === 0 ? (
                  <p className="text-xs text-zinc-500">Nenhum cliente cadastrado.</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1">
                    {clients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectClient(c)}
                        className="w-full text-left p-2 rounded hover:bg-zinc-800 text-xs flex justify-between items-center transition-colors"
                      >
                        <span className="font-medium text-zinc-200">{c.name}</span>
                        <span className="text-[11px] text-zinc-500">{c.whatsapp}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Nome / Razão Social</label>
              <input
                type="text"
                value={destinatarioNome}
                onChange={(e) => setDestinatarioNome(e.target.value)}
                placeholder="Nome do destinatário"
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">CNPJ / CPF</label>
              <input
                type="text"
                value={destinatarioDoc}
                onChange={(e) => setDestinatarioDoc(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Endereço</label>
              <input
                type="text"
                value={destinatarioEndereco}
                onChange={(e) => setDestinatarioEndereco(e.target.value)}
                placeholder="Rua, número, bairro"
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-3">
                <label className="block text-[11px] text-zinc-400 mb-1">Cidade</label>
                <input
                  type="text"
                  value={destinatarioCidade}
                  onChange={(e) => setDestinatarioCidade(e.target.value)}
                  placeholder="Cidade"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-[11px] text-zinc-400 mb-1">UF</label>
                <input
                  type="text"
                  value={destinatarioUF}
                  onChange={(e) => setDestinatarioUF(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center uppercase focus:outline-hidden focus:border-amber-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-zinc-400 mb-1">CEP</label>
                <input
                  type="text"
                  value={destinatarioCEP}
                  onChange={(e) => setDestinatarioCEP(e.target.value)}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Itens Card */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Itens</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-md bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>Adicionar</span>
                </button>
                <button
                  onClick={() =>
                    setItens([
                      { id: '1', descricao: '', qtd: 1, valor: 0 },
                      { id: '2', descricao: '', qtd: 1, valor: 0 },
                    ])
                  }
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title="Limpar itens"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {itens.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.descricao}
                    onChange={(e) => handleUpdateItem(item.id, 'descricao', e.target.value)}
                    placeholder={`Item ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-amber-500"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.qtd}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'qtd', parseInt(e.target.value) || 1)
                    }
                    className="w-16 px-2.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center font-mono focus:outline-hidden focus:border-amber-500"
                    placeholder="Qtd"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={item.valor}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'valor', parseFloat(e.target.value) || 0)
                    }
                    className="w-24 px-2.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-right font-mono focus:outline-hidden focus:border-amber-500"
                    placeholder="R$"
                  />
                  {itens.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Peso (kg):</span>
                <input
                  type="text"
                  value={pesoTotal}
                  onChange={(e) => setPesoTotal(e.target.value)}
                  className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 text-center font-mono text-xs focus:outline-hidden"
                />
              </div>
              <div className="font-mono font-bold text-amber-400">
                Total: {formatCurrency(totalValor)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PREVIEW Sheet */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-1">
            PREVIEW
          </div>

          <div
            id="declaracao-print-sheet"
            className="bg-white text-black p-5 md:p-6 rounded-xl shadow-2xl text-[9px] md:text-[10px] leading-tight font-sans space-y-2 border border-zinc-300 select-none"
          >
            {/* Title Header */}
            <div className="border border-black p-2 text-center font-bold text-xs md:text-sm tracking-wider uppercase">
              DECLARAÇÃO DE CONTEÚDO
            </div>

            {/* Remetente vs Destinatário Table */}
            <div className="border border-black divide-y divide-black">
              <div className="grid grid-cols-2 divide-x divide-black bg-zinc-100 font-bold p-1">
                <div>REMETENTE</div>
                <div>DESTINATÁRIO</div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-black p-1">
                <div>
                  <span className="font-bold">NOME:</span> {remetenteNome}
                </div>
                <div>
                  <span className="font-bold">NOME:</span> {destinatarioNome || '—'}
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-black p-1">
                <div>
                  <span className="font-bold">ENDEREÇO:</span> {remetenteEndereco}
                </div>
                <div>
                  <span className="font-bold">ENDEREÇO:</span> {destinatarioEndereco || '—'}
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-black">
                <div className="grid grid-cols-3 divide-x divide-black p-1">
                  <div className="col-span-2">
                    <span className="font-bold">CIDADE:</span> {remetenteCidade}
                  </div>
                  <div>
                    <span className="font-bold">UF:</span> {remetenteUF}
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-black p-1">
                  <div className="col-span-2">
                    <span className="font-bold">CIDADE:</span> {destinatarioCidade || '—'}
                  </div>
                  <div>
                    <span className="font-bold">UF:</span> {destinatarioUF || '—'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 divide-x divide-black">
                <div className="grid grid-cols-2 divide-x divide-black p-1">
                  <div>
                    <span className="font-bold">CEP:</span> {remetenteCEP}
                  </div>
                  <div>
                    <span className="font-bold">CNPJ/CPF:</span> {remetenteDoc}
                  </div>
                </div>
                <div className="grid grid-cols-2 divide-x divide-black p-1">
                  <div>
                    <span className="font-bold">CEP:</span> {destinatarioCEP || '—'}
                  </div>
                  <div>
                    <span className="font-bold">CNPJ/CPF:</span> {destinatarioDoc || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Identificação dos Bens */}
            <div className="border border-black">
              <div className="bg-zinc-100 font-bold text-center p-1 border-b border-black">
                IDENTIFICAÇÃO DOS BENS
              </div>

              <table className="w-full text-left text-[9px]">
                <thead className="border-b border-black">
                  <tr>
                    <th className="p-1 w-10 text-center border-r border-black font-bold">ITEM</th>
                    <th className="p-1 border-r border-black font-bold">CONTEÚDO</th>
                    <th className="p-1 w-16 text-center border-r border-black font-bold">
                      QUANTIDADE
                    </th>
                    <th className="p-1 w-20 text-right font-bold">VALOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {itens.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="p-1 text-center border-r border-black">{idx + 1}</td>
                      <td className="p-1 border-r border-black">{it.descricao || '—'}</td>
                      <td className="p-1 text-center border-r border-black">{it.qtd}</td>
                      <td className="p-1 text-right font-mono">
                        {formatCurrency(it.qtd * it.valor)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-zinc-50 border-t border-black">
                    <td colSpan={2} className="p-1 text-right border-r border-black uppercase">
                      TOTAIS
                    </td>
                    <td className="p-1 text-center border-r border-black">{totalQuantidade}</td>
                    <td className="p-1 text-right font-mono">{formatCurrency(totalValor)}</td>
                  </tr>
                  <tr className="font-bold bg-zinc-50 border-t border-black">
                    <td colSpan={3} className="p-1 text-right border-r border-black uppercase">
                      PESO TOTAL (Kg)
                    </td>
                    <td className="p-1 text-right font-mono">{pesoTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Declaração Legal */}
            <div className="border border-black p-2 space-y-2">
              <div className="font-bold text-center">DECLARAÇÃO</div>
              <p className="text-[8px] text-justify text-zinc-700 leading-tight">
                Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei
                Complementar nº 87/1996, uma vez que não realizo, com habitualidade ou em volume que
                caracterize intuito comercial, operações de circulação de mercadoria, ainda que se
                iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da
                legislação tributária vigente, responsabilizando-me, nos termos da lei e a quem de
                direito, por informações inverídicas.
              </p>
              <p className="text-[8px] text-justify text-zinc-700 leading-tight">
                Declaro ainda que não estou postando conteúdo inflamável, explosivo, causador de
                combustão espontânea, tóxico, corrosivo, gás ou qualquer outro conteúdo que
                constitua perigo, conforme o art. 13 da Lei Postal nº 6.538/78.
              </p>

              <div className="pt-4 flex justify-between items-end text-[8px]">
                <span>____________________, 21 de agosto de 2026</span>
                <div className="text-center">
                  <div className="w-44 border-t border-black pt-0.5">
                    Assinatura do Declarante/Remetente
                  </div>
                </div>
              </div>
            </div>

            {/* Observação */}
            <div className="border border-black p-1 text-[7px] text-zinc-600">
              <span className="font-bold">OBSERVAÇÃO:</span> Constitui crime contra a ordem tributária
              suprimir ou reduzir tributo, ou contribuição social de qualquer acessório (Lei 8.137/90
              Art. 1º, V).
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
