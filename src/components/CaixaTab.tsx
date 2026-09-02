import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter, 
  Search,
  ShoppingCart,
  Receipt,
  Tags
} from 'lucide-react';
import { MovimentacaoCaixa } from '../types';
import { DespesasPorCategoriaChart } from './DespesasPorCategoriaChart';
import { CategoriaBadge, getCategoryConfig } from './CategoriaBadge';

interface CaixaTabProps {
  caixa: MovimentacaoCaixa[];
  onOpenNovoGasto: () => void;
  onRemoverGasto: (id: string) => void;
}

const CATEGORIAS_FILTRO = [
  'Material de Limpeza',
  'Manutenção & Reparos',
  'Combustível',
  'Alimentação & Café',
  'Conforto & Eletro',
  'Doação / Crédito',
  'Outros'
];

export const CaixaTab: React.FC<CaixaTabProps> = ({
  caixa,
  onOpenNovoGasto,
  onRemoverGasto
}) => {
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'Entrada' | 'Saída'>('todos');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCaixa = caixa.filter((item) => {
    const matchesTipo = tipoFilter === 'todos' || item.tipo === tipoFilter;
    const matchesCat = categoriaFilter === 'todos' || item.categoria === categoriaFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.desc.toLowerCase().includes(searchLower) ||
      item.resp.toLowerCase().includes(searchLower) ||
      item.categoria.toLowerCase().includes(searchLower);

    return matchesTipo && matchesCat && matchesSearch;
  });

  const totalEntradas = caixa.filter(c => c.tipo === 'Entrada').reduce((a, b) => a + b.valor, 0);
  const totalSaidas = caixa.filter(c => c.tipo === 'Saída').reduce((a, b) => a + b.valor, 0);
  const saldoCaixa = totalEntradas - totalSaidas;

  const exportarCSV = () => {
    let csv = "Data;Tipo;Categoria;Descricao;Responsavel;Valor\n";
    caixa.forEach((c) => {
      csv += `"${c.data}";"${c.tipo}";"${c.categoria}";"${c.desc}";"${c.resp}";"${c.valor.toFixed(2)}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `caixa_alojamento_rp_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="space-y-5">
      {/* Componente de Visualização de Despesas por Categoria (Recharts) */}
      <DespesasPorCategoriaChart caixa={caixa} />
      
      {/* Bento Main Cash Management Card */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight font-['Chakra_Petch']">
                Controle de Entradas e Saídas do Caixa
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registre doações, compras de materiais, reposição de café, água, combustível e manutenções do alojamento RP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={exportarCSV}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={onOpenNovoGasto}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs sm:text-sm font-black flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Lançar Movimentação</span>
            </button>
          </div>
        </div>

        {/* Bento Sub-Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-slate-500">Entradas Avulsas:</span>
            <span className="text-sm font-bold text-emerald-600 font-['Chakra_Petch']">
              + {totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-1 border-t sm:border-t-0 sm:border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Despesas Registradas:</span>
            <span className="text-sm font-bold text-rose-600 font-['Chakra_Petch']">
              - {totalSaidas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-1 border-t sm:border-t-0 sm:border-l border-slate-200">
            <span className="text-xs font-semibold text-slate-500">Balanço do Caixa:</span>
            <span className={`text-sm font-black font-['Chakra_Petch'] ${saldoCaixa >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {saldoCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Filters and search */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter by Type */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-amber-500" /> Tipo:
              </span>

              <button
                onClick={() => setTipoFilter('todos')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tipoFilter === 'todos'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Todas ({caixa.length})
              </button>

              <button
                onClick={() => setTipoFilter('Entrada')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tipoFilter === 'Entrada'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Entradas (+ {caixa.filter(c => c.tipo === 'Entrada').length})
              </button>

              <button
                onClick={() => setTipoFilter('Saída')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  tipoFilter === 'Saída'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                Saídas / Gastos ({caixa.filter(c => c.tipo === 'Saída').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar gasto ou responsável..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Categories Quick Filter Badges Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mr-1">
              <Tags className="w-3 h-3 text-slate-400" /> Categoria:
            </span>

            <button
              type="button"
              onClick={() => setCategoriaFilter('todos')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                categoriaFilter === 'todos'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Todas
            </button>

            {CATEGORIAS_FILTRO.map((cat) => {
              const cfg = getCategoryConfig(cat);
              const count = caixa.filter(c => c.categoria === cat).length;
              if (count === 0 && cat !== 'Combustível') return null;
              const isSelected = categoriaFilter === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaFilter(isSelected ? 'todos' : cat)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-slate-900 shadow-xs`
                      : `${cfg.bg} ${cfg.text} ${cfg.border} opacity-80 hover:opacity-100 hover:shadow-2xs`
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.icon}
                  <span>{cfg.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100/90 text-slate-700 uppercase font-bold text-xs border-b border-slate-200 font-['Chakra_Petch']">
              <tr>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5">Tipo</th>
                <th className="px-6 py-3.5">Descrição / Finalidade</th>
                <th className="px-6 py-3.5">Categoria (Badge)</th>
                <th className="px-6 py-3.5">Responsável / Doador</th>
                <th className="px-6 py-3.5 text-right">Valor (R$)</th>
                <th className="px-6 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredCaixa.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Nenhuma movimentação encontrada.</p>
                  </td>
                </tr>
              ) : (
                filteredCaixa.map((item) => {
                  const isEntrada = item.tipo === 'Entrada';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Data */}
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-600 font-medium">
                        {item.data}
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold rounded-full border ${
                          isEntrada
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {isEntrada ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          {item.tipo}
                        </span>
                      </td>

                      {/* Descrição */}
                      <td className="px-6 py-3.5 font-bold text-slate-900 text-xs sm:text-sm">
                        {item.desc}
                      </td>

                      {/* Categoria com Indicador de Cor (Badge) */}
                      <td className="px-6 py-3.5 text-xs">
                        <CategoriaBadge categoria={item.categoria} />
                      </td>

                      {/* Responsável */}
                      <td className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">
                        {item.resp}
                      </td>

                      {/* Valor */}
                      <td className={`px-6 py-3.5 text-right font-black font-['Chakra_Petch'] text-sm ${
                        isEntrada ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isEntrada ? '+ ' : '- '}
                        {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      {/* Ação */}
                      <td className="px-6 py-3.5 text-center">
                        <button
                          onClick={() => onRemoverGasto(item.id)}
                          title="Excluir Registro"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

