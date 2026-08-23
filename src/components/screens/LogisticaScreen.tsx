import React, { useState } from 'react';
import {
  Truck,
  FileCheck2,
  Package,
  Printer,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Building2,
  User,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  QrCode,
  Tag,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { Client, Order, OrderStatus } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { STATUS_CONFIG } from '../../data/mockData';

interface LogisticaScreenProps {
  clients: Client[];
  orders: Order[];
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onOpenOrderDetails?: (order: Order) => void;
}

interface ItemRow {
  id: string;
  descricao: string;
  qtd: number;
  valor: number;
}

export const LogisticaScreen: React.FC<LogisticaScreenProps> = ({
  clients,
  orders,
  onUpdateOrderStatus,
  onOpenOrderDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'declaracao' | 'entregas' | 'etiquetas'>('declaracao');

  // Remetente (Silk Print Gráfica)
  const [remetenteNome, setRemetenteNome] = useState('Silk Print Gráfica');
  const [remetenteDoc, setRemetenteDoc] = useState('12.345.678/0001-90');
  const [remetenteEndereco, setRemetenteEndereco] = useState('Av. Paulista, 1000 - Bela Vista');
  const [remetenteCidade, setRemetenteCidade] = useState('São Paulo');
  const [remetenteUF, setRemetenteUF] = useState('SP');
  const [remetenteCEP, setRemetenteCEP] = useState('01310-100');

  // Destinatário
  const [destinatarioNome, setDestinatarioNome] = useState('');
  const [destinatarioDoc, setDestinatarioDoc] = useState('');
  const [destinatarioEndereco, setDestinatarioEndereco] = useState('');
  const [destinatarioCidade, setDestinatarioCidade] = useState('');
  const [destinatarioUF, setDestinatarioUF] = useState('SP');
  const [destinatarioCEP, setDestinatarioCEP] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showOrderPicker, setShowOrderPicker] = useState(false);

  // Itens da Declaração
  const [itens, setItens] = useState<ItemRow[]>([
    { id: '1', descricao: 'Material Gráfico Publicitário Impresso', qtd: 1, valor: 150.0 },
  ]);
  const [pesoTotal, setPesoTotal] = useState('0.850');

  // Filtro na aba de entregas
  const [deliverySearch, setDeliverySearch] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState<'todos' | 'em_transporte' | 'aguardando_retirada' | 'entregue'>('todos');

  const handleAddItem = () => {
    setItens([
      ...itens,
      { id: String(Date.now()), descricao: '', qtd: 1, valor: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (itens.length <= 1) return;
    setItens(itens.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof ItemRow,
    value: string | number
  ) => {
    setItens(
      itens.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSelectClient = (client: Client) => {
    setDestinatarioNome(client.name);
    setDestinatarioDoc(client.cpfCnpj || '');
    setDestinatarioEndereco(
      client.endereco
        ? `${client.endereco}, ${client.numero || 'S/N'}${client.bairro ? ` - ${client.bairro}` : ''}`
        : 'Rua das Flores, 120 - Centro'
    );
    setDestinatarioCidade(client.cidade || 'São Paulo');
    setDestinatarioUF(client.estado || 'SP');
    setDestinatarioCEP(client.cep || '01001-000');
    setShowClientPicker(false);
  };

  const handleSelectOrder = (order: Order) => {
    setDestinatarioNome(order.clientName);
    setDestinatarioDoc(order.clientCpf || '');
    setDestinatarioEndereco(
      order.endereco
        ? `${order.endereco}, ${order.numero || 'S/N'}${order.bairro ? ` - ${order.bairro}` : ''}`
        : 'Endereço Comercial Cadastrado'
    );
    setDestinatarioCidade(order.cidade || 'São Paulo');
    setDestinatarioUF(order.estado || 'SP');
    setDestinatarioCEP(order.cep || '01001-000');

    // Preenche itens a partir da descrição ou dos itens do pedido
    if (order.items && order.items.length > 0) {
      setItens(
        order.items.map((i, idx) => ({
          id: String(idx + 1),
          descricao: i.name,
          qtd: i.quantity,
          valor: i.unitPrice,
        }))
      );
    } else {
      setItens([
        {
          id: '1',
          descricao: order.description || 'Material Gráfico Personalizado',
          qtd: 1,
          valor: order.total,
        },
      ]);
    }
    setShowOrderPicker(false);
  };

  const totalQuantidade = itens.reduce((sum, i) => sum + (Number(i.qtd) || 0), 0);
  const totalValor = itens.reduce((sum, i) => sum + (Number(i.qtd) || 0) * (Number(i.valor) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  // Pedidos para logística
  const shippingOrders = orders.filter((o) => {
    const matchSearch =
      o.code.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      o.clientName.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      o.description.toLowerCase().includes(deliverySearch.toLowerCase());
    
    if (deliveryFilter === 'todos') {
      return matchSearch;
    }
    return matchSearch && o.status === deliveryFilter;
  });

  return (
    <div id="screen-logistica" className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <span>Logística & Expedição</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            Declaração de Conteúdo dos Correios, despacho de encomendas e controle de entregas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Documento / PDF</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab('declaracao')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'declaracao'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Declaração de Conteúdo</span>
        </button>

        <button
          onClick={() => setActiveTab('entregas')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'entregas'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Despacho & Rastreio</span>
        </button>

        <button
          onClick={() => setActiveTab('etiquetas')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'etiquetas'
              ? 'bg-blue-600 text-white shadow-xs font-bold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Etiqueta de Envio</span>
        </button>
      </div>

      {/* TAB 1: DECLARAÇÃO DE CONTEÚDO */}
      {activeTab === 'declaracao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-6 space-y-4">
            {/* Quick Fill Toolbar */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Preenchimento Automático:</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOrderPicker(!showOrderPicker);
                    setShowClientPicker(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Package className="w-3 h-3" />
                  <span>Puxar de Pedido</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowClientPicker(!showClientPicker);
                    setShowOrderPicker(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Search className="w-3 h-3 text-blue-400" />
                  <span>Puxar de Cliente</span>
                </button>
              </div>
            </div>

            {/* Quick Order Picker Dropdown */}
            {showOrderPicker && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-blue-500/40 space-y-2 animate-in fade-in">
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
                  Selecione um pedido para importar destinatário e itens:
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => handleSelectOrder(o)}
                      className="w-full text-left p-2.5 rounded-lg bg-zinc-900/80 hover:bg-blue-600/10 border border-zinc-800 hover:border-blue-500/40 text-xs flex justify-between items-center transition-all cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                          <span className="text-blue-400 font-mono">{o.code}</span>
                          <span>-</span>
                          <span>{o.clientName}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5">
                          {o.description}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-zinc-200">
                        {formatCurrency(o.total)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Client Picker Dropdown */}
            {showClientPicker && (
              <div className="p-3 rounded-xl bg-zinc-950 border border-blue-500/40 space-y-2 animate-in fade-in">
                <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
                  Selecione um cliente cadastrado:
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                  {clients.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectClient(c)}
                      className="w-full text-left p-2.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xs flex justify-between items-center transition-colors cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-zinc-100">{c.name}</span>
                        <div className="text-[10px] text-zinc-400">
                          {c.cidade ? `${c.cidade} - ${c.estado}` : c.whatsapp}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{c.cpfCnpj || 'S/ Doc'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Remetente Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Remetente (Silk Print Gráfica)</span>
                </div>
                <button
                  onClick={() => {
                    setRemetenteNome('Silk Print Gráfica');
                    setRemetenteDoc('12.345.678/0001-90');
                    setRemetenteEndereco('Av. Paulista, 1000 - Bela Vista');
                    setRemetenteCidade('São Paulo');
                    setRemetenteUF('SP');
                    setRemetenteCEP('01310-100');
                  }}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  title="Restaurar padrão"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Razão Social / Nome</label>
                <input
                  type="text"
                  value={remetenteNome}
                  onChange={(e) => setRemetenteNome(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">CNPJ / CPF</label>
                  <input
                    type="text"
                    value={remetenteDoc}
                    onChange={(e) => setRemetenteDoc(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">CEP</label>
                  <input
                    type="text"
                    value={remetenteCEP}
                    onChange={(e) => setRemetenteCEP(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={remetenteEndereco}
                  onChange={(e) => setRemetenteEndereco(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <label className="block text-[11px] text-zinc-400 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={remetenteCidade}
                    onChange={(e) => setRemetenteCidade(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">UF</label>
                  <input
                    type="text"
                    value={remetenteUF}
                    onChange={(e) => setRemetenteUF(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Destinatário Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Destinatário (Cliente)</span>
                </div>
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
                  title="Limpar campos"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Nome / Razão Social</label>
                <input
                  type="text"
                  value={destinatarioNome}
                  onChange={(e) => setDestinatarioNome(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    value={destinatarioDoc}
                    onChange={(e) => setDestinatarioDoc(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">CEP</label>
                  <input
                    type="text"
                    value={destinatarioCEP}
                    onChange={(e) => setDestinatarioCEP(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Endereço de Entrega</label>
                <input
                  type="text"
                  value={destinatarioEndereco}
                  onChange={(e) => setDestinatarioEndereco(e.target.value)}
                  placeholder="Rua, número, complemento, bairro"
                  className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <label className="block text-[11px] text-zinc-400 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={destinatarioCidade}
                    onChange={(e) => setDestinatarioCidade(e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">UF</label>
                  <input
                    type="text"
                    value={destinatarioUF}
                    onChange={(e) => setDestinatarioUF(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center uppercase focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Itens Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Itens Declarados</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-blue-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {itens.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.descricao}
                      onChange={(e) => handleUpdateItem(item.id, 'descricao', e.target.value)}
                      placeholder={`Descrição do Item ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-hidden focus:border-blue-500"
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.qtd}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'qtd', parseInt(e.target.value) || 1)
                      }
                      className="w-16 px-2 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-center font-mono focus:outline-hidden focus:border-blue-500"
                      placeholder="Qtd"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.valor}
                      onChange={(e) =>
                        handleUpdateItem(item.id, 'valor', parseFloat(e.target.value) || 0)
                      }
                      className="w-24 px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 text-right font-mono focus:outline-hidden focus:border-blue-500"
                      placeholder="R$"
                    />
                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Peso Total (kg):</span>
                  <input
                    type="text"
                    value={pesoTotal}
                    onChange={(e) => setPesoTotal(e.target.value)}
                    className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 text-center font-mono text-xs focus:outline-hidden"
                  />
                </div>
                <div className="font-mono font-bold text-blue-400">
                  Total: {formatCurrency(totalValor)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: PREVIEW Sheet Ready for Print */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Visualização para Impressão (Padrão Correios / Transportadoras)
              </span>
              <button
                onClick={handlePrint}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>

            <div
              id="declaracao-print-sheet"
              className="bg-white text-black p-5 md:p-6 rounded-2xl shadow-2xl text-[9px] md:text-[10px] leading-tight font-sans space-y-2 border border-zinc-300 select-none"
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
              <div className="border border-black p-2 space-y-1.5">
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

                <div className="pt-3 flex justify-between items-end text-[8px]">
                  <span>São Paulo - SP, {new Date().toLocaleDateString('pt-BR')}</span>
                  <div className="text-center">
                    <div className="w-40 border-t border-black pt-0.5">
                      Assinatura do Declarante
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-black p-1 text-[7px] text-zinc-600">
                <span className="font-bold">OBSERVAÇÃO:</span> Constitui crime contra a ordem tributária
                suprimir ou reduzir tributo, ou contribuição social de qualquer acessório (Lei 8.137/90
                Art. 1º, V).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAINEL DE ENVIOS & DESPACHO */}
      {activeTab === 'entregas' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={deliverySearch}
                onChange={(e) => setDeliverySearch(e.target.value)}
                placeholder="Buscar por código, cliente ou item..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setDeliveryFilter('todos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  deliveryFilter === 'todos'
                    ? 'bg-zinc-800 text-blue-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setDeliveryFilter('em_transporte')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  deliveryFilter === 'em_transporte'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🚚 Em Transporte
              </button>
              <button
                onClick={() => setDeliveryFilter('aguardando_retirada')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  deliveryFilter === 'aguardando_retirada'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                📦 Pronto p/ Retirada
              </button>
              <button
                onClick={() => setDeliveryFilter('entregue')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  deliveryFilter === 'entregue'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                🟢 Entregues
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {shippingOrders.map((order) => {
              const statusConf = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400 text-sm">
                        {order.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusConf.badgeBg}`}>
                        {statusConf.label}
                      </span>
                      <span className="text-xs font-semibold text-zinc-100 truncate">
                        {order.clientName}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 truncate">
                      {order.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        Previsão: {formatDate(order.deliveryDate)}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-300 font-mono font-semibold">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => {
                        handleSelectOrder(order);
                        setActiveTab('declaracao');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Gerar Declaração</span>
                    </button>

                    {onOpenOrderDetails && (
                      <button
                        onClick={() => onOpenOrderDetails(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ETIQUETAS DE ENVIO */}
      {activeTab === 'etiquetas' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Etiqueta de Envio / Despacho</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cole na caixa ou pacote de envio com dados do remetente e destinatário
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Etiqueta</span>
            </button>
          </div>

          <div className="max-w-xl mx-auto bg-white text-black p-6 rounded-2xl border-2 border-black space-y-4 select-none">
            <div className="border-b-2 border-black pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  DESTINATÁRIO
                </span>
                <h2 className="text-base font-black tracking-tight">{destinatarioNome || 'Nome do Cliente'}</h2>
                <p className="text-xs font-semibold text-zinc-800 mt-0.5">
                  {destinatarioEndereco || 'Rua das Flores, 120 - Centro'}
                </p>
                <p className="text-xs font-semibold text-zinc-800">
                  {destinatarioCidade || 'São Paulo'} - {destinatarioUF || 'SP'}
                </p>
                <div className="mt-2 text-sm font-black font-mono tracking-widest bg-zinc-100 p-1.5 inline-block border border-black">
                  CEP: {destinatarioCEP || '01001-000'}
                </div>
              </div>
              <div className="w-20 h-20 border-2 border-black flex flex-col items-center justify-center text-center p-1">
                <QrCode className="w-10 h-10" />
                <span className="text-[8px] font-bold font-mono">PEDIDO</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] space-y-0.5">
              <span className="font-bold tracking-widest text-zinc-500 uppercase block">
                REMETENTE:
              </span>
              <p className="font-bold">{remetenteNome} • CNPJ: {remetenteDoc}</p>
              <p>{remetenteEndereco} • {remetenteCidade} - {remetenteUF} • CEP: {remetenteCEP}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
