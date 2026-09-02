import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter, 
  Search,
  ShoppingCart,
  Receipt,
  FileText,
  Camera,
  UploadCloud,
  Eye,
  Tag,
  Sparkles,
  Droplets,
  Wifi,
  Wrench,
  Utensils,
  Fuel,
  Package,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { MovimentacaoCaixa } from '../types';
import { ModalVisualizarComprovante } from './ModalVisualizarComprovante';
import { processarArquivoComprovante } from '../utils/comprovanteHelper';

interface CaixaTabProps {
  caixa: MovimentacaoCaixa[];
  onOpenNovoGasto: () => void;
  onRemoverGasto: (id: string) => void;
  onAtualizarGasto?: (mov: MovimentacaoCaixa) => void;
  onEditarGasto?: (mov: MovimentacaoCaixa) => void;
}

// Lista das categorias requisitadas
const CATEGORIAS_CONFIG: {
  nome: string;
  corBorda: string;
  corFundo: string;
  corTexto: string;
  corDot: string;
  Icone: React.FC<{ className?: string }>;
}[] = [
  {
    nome: 'Material de Limpeza',
    corBorda: 'border-cyan-400',
    corFundo: 'bg-cyan-50/80 hover:bg-cyan-100/80',
    corTexto: 'text-cyan-800',
    corDot: 'bg-cyan-500',
    Icone: Sparkles
  },
  {
    nome: 'Agua Mineral',
    corBorda: 'border-sky-400',
    corFundo: 'bg-sky-50/80 hover:bg-sky-100/80',
    corTexto: 'text-sky-800',
    corDot: 'bg-sky-500',
    Icone: Droplets
  },
  {
    nome: 'Doação / Crédito',
    corBorda: 'border-emerald-400',
    corFundo: 'bg-emerald-50/80 hover:bg-emerald-100/80',
    corTexto: 'text-emerald-800',
    corDot: 'bg-emerald-500',
    Icone: ArrowDownLeft
  },
  {
    nome: 'Internet',
    corBorda: 'border-indigo-400',
    corFundo: 'bg-indigo-50/80 hover:bg-indigo-100/80',
    corTexto: 'text-indigo-800',
    corDot: 'bg-indigo-500',
    Icone: Wifi
  },
  {
    nome: 'Manutenção e Reparos',
    corBorda: 'border-amber-400',
    corFundo: 'bg-amber-50/80 hover:bg-amber-100/80',
    corTexto: 'text-amber-800',
    corDot: 'bg-amber-500',
    Icone: Wrench
  },
  {
    nome: 'Alimentos',
    corBorda: 'border-rose-300',
    corFundo: 'bg-rose-50/80 hover:bg-rose-100/80',
    corTexto: 'text-rose-800',
    corDot: 'bg-rose-500',
    Icone: Utensils
  },
  {
    nome: 'Combustível',
    corBorda: 'border-orange-400',
    corFundo: 'bg-orange-50/80 hover:bg-orange-100/80',
    corTexto: 'text-orange-800',
    corDot: 'bg-orange-500',
    Icone: Fuel
  },
  {
    nome: 'Outros',
    corBorda: 'border-slate-300',
    corFundo: 'bg-slate-100 hover:bg-slate-200',
    corTexto: 'text-slate-800',
    corDot: 'bg-slate-500',
    Icone: Package
  }
];

export const CaixaTab: React.FC<CaixaTabProps> = ({
  caixa,
  onOpenNovoGasto,
  onRemoverGasto,
  onAtualizarGasto,
  onEditarGasto
}) => {
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'Entrada' | 'Saída'>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [comprovanteParaVisualizar, setComprovanteParaVisualizar] = useState<MovimentacaoCaixa | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Input oculto para envio direto de comprovante na linha
  const rowFileInputRef = useRef<HTMLInputElement>(null);
  const targetRowIdRef = useRef<string | null>(null);

  // Normalização de categoria para filtro resiliente
  const normalizarCategoria = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('limpeza')) return 'Material de Limpeza';
    if (c.includes('água') || c.includes('agua')) return 'Agua Mineral';
    if (c.includes('doação') || c.includes('doacao') || c.includes('crédito') || c.includes('credito')) return 'Doação / Crédito';
    if (c.includes('internet')) return 'Internet';
    if (c.includes('manuten') || c.includes('reparo')) return 'Manutenção e Reparos';
    if (c.includes('aliment') || c.includes('café') || c.includes('cafe')) return 'Alimentos';
    if (c.includes('combust')) return 'Combustível';
    if (c.includes('mensalidad')) return 'Doação / Crédito';
    return 'Outros';
  };

  const filteredCaixa = caixa.filter((item) => {
    const matchesTipo = tipoFilter === 'todos' || item.tipo === tipoFilter;
    const catNormalizada = normalizarCategoria(item.categoria);
    const matchesCategoria = categoriaFilter === 'todas' || 
      catNormalizada.toLowerCase() === categoriaFilter.toLowerCase() ||
      item.categoria.toLowerCase() === categoriaFilter.toLowerCase();

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.desc.toLowerCase().includes(searchLower) ||
      item.resp.toLowerCase().includes(searchLower) ||
      item.categoria.toLowerCase().includes(searchLower) ||
      item.data.includes(searchLower);

    return matchesTipo && matchesCategoria && matchesSearch;
  });

  const totalEntradas = caixa.filter(c => c.tipo === 'Entrada').reduce((a, b) => a + b.valor, 0);
  const totalSaidas = caixa.filter(c => c.tipo === 'Saída').reduce((a, b) => a + b.valor, 0);
  const balancoCaixa = totalEntradas - totalSaidas;

  // Handle direct file upload for a specific row
  const handleDirectComprovanteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const rowId = targetRowIdRef.current;
    if (!file || !rowId || !onAtualizarGasto) return;

    try {
      setUploadingId(rowId);
      const res = await processarArquivoComprovante(file);
      const item = caixa.find(c => c.id === rowId);
      if (item) {
        onAtualizarGasto({
          ...item,
          comprovanteUrl: res.dataUrl,
          comprovanteNome: res.nome,
          comprovanteTipo: res.tipo
        });
      }
    } catch (err) {
      console.error('Erro ao anexar comprovante:', err);
      alert('Erro ao processar imagem do comprovante.');
    } finally {
      setUploadingId(null);
      if (rowFileInputRef.current) rowFileInputRef.current.value = '';
    }
  };

  const triggerRowUpload = (rowId: string) => {
    targetRowIdRef.current = rowId;
    rowFileInputRef.current?.click();
  };

  const handleRemoverComprovante = (id: string) => {
    if (!onAtualizarGasto) return;
    const item = caixa.find(c => c.id === id);
    if (item) {
      onAtualizarGasto({
        ...item,
        comprovanteUrl: undefined,
        comprovanteNome: undefined,
        comprovanteTipo: undefined
      });
    }
  };

  const exportarCSV = () => {
    let csv = "Data;Tipo;Descricao;Categoria;Responsavel;Valor;Comprovante\n";
    caixa.forEach((c) => {
      csv += `"${c.data}";"${c.tipo}";"${c.desc}";"${c.categoria}";"${c.resp}";"${c.valor.toFixed(2)}";"${c.comprovanteNome || (c.comprovanteUrl ? 'Sim' : 'Nao')}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `controle_caixa_alojamento_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obter Badge Config da Categoria
  const getBadgeConfig = (categoriaNome: string) => {
    const norm = normalizarCategoria(categoriaNome);
    const found = CATEGORIAS_CONFIG.find(c => c.nome.toLowerCase() === norm.toLowerCase());
    return found || {
      nome: categoriaNome,
      corBorda: 'border-slate-300',
      corFundo: 'bg-slate-50',
      corTexto: 'text-slate-800',
      corDot: 'bg-slate-400',
      Icone: Tag
    };
  };

  return (
    <section className="space-y-6">
      
      {/* Input oculto para carregar arquivo em linha específica */}
      <input
        ref={rowFileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleDirectComprovanteUpload}
        className="hidden"
      />

      {/* Main Container mirroring the visual of the user's image */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-5 sm:p-7 space-y-6">
        
        {/* 1. HEADER SECTION (Title + Subtitle + Action Buttons) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 flex-shrink-0 shadow-2xs mt-0.5">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
                CONTROLE DE ENTRADAS E SAÍDAS DO CAIXA
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Registre doações, compras de materiais, reposição de café, água, combustível e manutenções do alojamento RP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={exportarCSV}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onOpenNovoGasto}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Lançar Movimentação</span>
            </button>
          </div>
        </div>

        {/* 2. STATS SUMMARY STRIP (Exact layout: Entradas Avulsas | Despesas Registradas | Balanço do Caixa) */}
        <div className="bg-[#f8fafc] border border-slate-200/90 rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 gap-3 md:gap-0">
            
            {/* Entradas Avulsas */}
            <div className="flex items-center justify-between md:justify-center md:flex-col md:text-center px-4 py-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                Entradas Avulsas:
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-600 font-['Chakra_Petch'] md:mt-0.5">
                + {totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* Despesas Registradas */}
            <div className="flex items-center justify-between md:justify-center md:flex-col md:text-center px-4 py-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                Despesas Registradas:
              </span>
              <span className="text-base sm:text-lg font-black text-rose-600 font-['Chakra_Petch'] md:mt-0.5">
                - {totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* Balanço do Caixa */}
            <div className="flex items-center justify-between md:justify-center md:flex-col md:text-center px-4 py-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                Balanço do Caixa:
              </span>
              <span className={`text-base sm:text-lg font-black font-['Chakra_Petch'] md:mt-0.5 ${
                balancoCaixa >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {balancoCaixa >= 0 ? '+ ' : ''}
                {balancoCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

          </div>
        </div>

        {/* 3. FILTER CONTROLS: TIPO + SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          
          {/* TIPO Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-amber-500" /> TIPO:
            </span>

            {/* Todas */}
            <button
              onClick={() => setTipoFilter('todos')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tipoFilter === 'todos'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas ({caixa.length})
            </button>

            {/* Entradas */}
            <button
              onClick={() => setTipoFilter('Entrada')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                tipoFilter === 'Entrada'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              Entradas (+ {caixa.filter(c => c.tipo === 'Entrada').length})
            </button>

            {/* Saídas / Gastos */}
            <button
              onClick={() => setTipoFilter('Saída')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                tipoFilter === 'Saída'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              Saídas / Gastos ({caixa.filter(c => c.tipo === 'Saída').length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gasto ou responsável..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* 4. CATEGORIA BADGE FILTER STRIP (Com todas as categorias pedidas pelo usuário) */}
        <div className="flex items-center gap-2 flex-wrap pt-1 pb-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5 mr-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" /> CATEGORIA:
          </span>

          {/* Botão Todas */}
          <button
            onClick={() => setCategoriaFilter('todas')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              categoriaFilter === 'todas'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            Todas
          </button>

          {/* Badges de Categoria: Material de Limpeza, Agua Mineral, Doação/Crédito, Internet, Manutenção e Reparos, Alimentos, Combustível, Outros */}
          {CATEGORIAS_CONFIG.map((cat) => {
            const count = caixa.filter(c => normalizarCategoria(c.categoria) === cat.nome).length;
            const isSelected = categoriaFilter.toLowerCase() === cat.nome.toLowerCase();
            const IconComponent = cat.Icone;

            return (
              <button
                key={cat.nome}
                onClick={() => setCategoriaFilter(isSelected ? 'todas' : cat.nome)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  cat.corBorda
                } ${cat.corFundo} ${cat.corTexto} ${
                  isSelected ? 'ring-2 ring-slate-800 shadow-xs' : ''
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.corDot}`}></span>
                <IconComponent className="w-3 h-3 flex-shrink-0" />
                <span>{cat.nome}</span>
                <span className="opacity-75 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* 5. TABELA DE REGISTROS (Seguindo fielmente as colunas do layout e acrescentando o envio de comprovante) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Header da Tabela */}
            <thead>
              <tr className="bg-slate-50/90 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                <th className="px-4 py-3.5 font-bold w-24">
                  DATA
                </th>
                <th className="px-4 py-3.5 font-bold w-28">
                  TIPO
                </th>
                <th className="px-4 py-3.5 font-bold min-w-[200px]">
                  DESCRIÇÃO / FINALIDADE
                </th>
                <th className="px-4 py-3.5 font-bold min-w-[190px]">
                  CATEGORIA (BADGE)
                </th>
                <th className="px-4 py-3.5 font-bold min-w-[170px]">
                  RESPONSÁVEL / DOADOR
                </th>
                <th className="px-4 py-3.5 font-bold text-right w-28">
                  VALOR (R$)
                </th>
                <th className="px-4 py-3.5 font-bold text-center min-w-[170px] bg-amber-50/40 text-amber-900 border-l border-r border-amber-200/60">
                  COMPROVANTE
                </th>
                <th className="px-3 py-3.5 font-bold text-center w-20">
                  AÇÕES
                </th>
              </tr>
            </thead>

            {/* Linhas da Tabela */}
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {filteredCaixa.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 bg-white">
                    <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Nenhum registro encontrado.</p>
                    <button
                      onClick={onOpenNovoGasto}
                      className="mt-3 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Lançar Movimentação
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCaixa.map((item) => {
                  const isEntrada = item.tipo === 'Entrada';
                  const badgeConfig = getBadgeConfig(item.categoria);
                  const IconBadge = badgeConfig.Icone;

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      
                      {/* 1. DATA */}
                      <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap text-xs">
                        {item.data}
                      </td>

                      {/* 2. TIPO (Badge com seta conforme o design) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                          isEntrada
                            ? 'bg-[#e6fcf5] text-[#0ca678] border-[#a3e635]/40'
                            : 'bg-[#fff5f5] text-[#f03e3e] border-[#ffa8a8]/50'
                        }`}>
                          {isEntrada ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-[#0ca678]" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#f03e3e]" />
                          )}
                          <span>{item.tipo}</span>
                        </span>
                      </td>

                      {/* 3. DESCRIÇÃO / FINALIDADE */}
                      <td className="px-4 py-3.5 font-bold text-slate-900 text-xs sm:text-sm">
                        <div className="max-w-[280px]" title={item.desc}>
                          {item.desc}
                        </div>
                        {item.observacoes && (
                          <span className="text-[10px] text-slate-500 font-normal italic block truncate max-w-[280px]">
                            {item.observacoes}
                          </span>
                        )}
                      </td>

                      {/* 4. CATEGORIA (BADGE) - Estilo fiel ao screenshot */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeConfig.corBorda} ${badgeConfig.corFundo} ${badgeConfig.corTexto}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.corDot}`}></span>
                          <IconBadge className="w-3 h-3 flex-shrink-0" />
                          <span>{badgeConfig.nome}</span>
                        </span>
                      </td>

                      {/* 5. RESPONSÁVEL / DOADOR */}
                      <td className="px-4 py-3.5 font-bold uppercase text-slate-700 text-[11.5px] whitespace-nowrap">
                        {item.resp}
                      </td>

                      {/* 6. VALOR (R$) */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <span className={`font-black font-['Chakra_Petch'] text-sm sm:text-base ${
                          isEntrada ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isEntrada ? '+ ' : '- '}
                          {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </td>

                      {/* 7. COMPROVANTE (COLUNA REQUISITADA PARA ENVIAR COMPROVANTES DE PAGAMENTO) */}
                      <td className="px-4 py-3 text-center bg-amber-50/20 border-l border-r border-amber-200/50">
                        {item.comprovanteUrl ? (
                          /* Já possui comprovante anexado */
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setComprovanteParaVisualizar(item)}
                              title="Clique para ver o comprovante em tamanho real"
                              className="group relative flex items-center justify-center p-0.5 rounded-xl border border-slate-300 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                            >
                              {item.comprovanteTipo === 'pdf' ? (
                                <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-lg flex flex-col items-center justify-center text-[8px] font-bold">
                                  <FileText className="w-4 h-4" />
                                  <span>PDF</span>
                                </div>
                              ) : (
                                <div className="relative w-9 h-9 overflow-hidden rounded-lg bg-slate-100">
                                  <img 
                                    src={item.comprovanteUrl} 
                                    alt="Comprovante" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                  />
                                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                              )}
                            </button>

                            <div className="text-left">
                              <button
                                type="button"
                                onClick={() => setComprovanteParaVisualizar(item)}
                                className="text-[11px] font-bold text-slate-900 hover:text-amber-600 block hover:underline cursor-pointer"
                              >
                                Ver Recibo
                              </button>
                              <button
                                type="button"
                                onClick={() => triggerRowUpload(item.id)}
                                className="text-[10px] text-slate-500 hover:text-slate-800 block cursor-pointer"
                              >
                                Trocar Foto
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Botão para enviar comprovante de pagamento */
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => triggerRowUpload(item.id)}
                              disabled={uploadingId === item.id}
                              title="Anexar foto ou PDF do comprovante"
                              className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                            >
                              {uploadingId === item.id ? (
                                <span>Enviando...</span>
                              ) : (
                                <>
                                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Enviar Comprovante</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </td>

                      {/* 8. AÇÕES */}
                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {onEditarGasto && (
                            <button
                              type="button"
                              onClick={() => onEditarGasto(item)}
                              title="Editar registro"
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onRemoverGasto(item.id)}
                            title="Excluir movimentação"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé Informativo */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Mostrando <strong>{filteredCaixa.length}</strong> de <strong>{caixa.length}</strong> movimentações cadastradas.
          </div>
          <div className="text-[11px] text-slate-400">
            Alojamento RP • 3º Batalhão de Polícia Militar
          </div>
        </div>

      </div>

      {/* Modal Lightbox para Visualizar Comprovante em Tamanho Real */}
      {comprovanteParaVisualizar && (
        <ModalVisualizarComprovante
          movimentacao={comprovanteParaVisualizar}
          onClose={() => setComprovanteParaVisualizar(null)}
          onRemoverComprovante={handleRemoverComprovante}
        />
      )}

    </section>
  );
};
