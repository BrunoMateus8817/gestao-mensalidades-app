import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { 
  BarChart3, 
  TrendingDown, 
  PieChart, 
  Sparkles, 
  Wrench, 
  Fuel,
  Coffee, 
  Tv, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { MovimentacaoCaixa } from '../types';

interface DespesasPorCategoriaChartProps {
  caixa: MovimentacaoCaixa[];
}

const CATEGORY_COLORS: Record<string, { bg: string; fill: string; border: string }> = {
  'Material de Limpeza': { bg: 'bg-cyan-50 text-cyan-700', fill: '#06b6d4', border: 'border-cyan-200' },
  'Manutenção & Reparos': { bg: 'bg-amber-50 text-amber-800', fill: '#f59e0b', border: 'border-amber-200' },
  'Combustível': { bg: 'bg-orange-50 text-orange-800', fill: '#f97316', border: 'border-orange-200' },
  'Alimentação & Café': { bg: 'bg-emerald-50 text-emerald-800', fill: '#10b981', border: 'border-emerald-200' },
  'Conforto & Eletro': { bg: 'bg-indigo-50 text-indigo-700', fill: '#6366f1', border: 'border-indigo-200' },
  'Outros': { bg: 'bg-slate-100 text-slate-700', fill: '#64748b', border: 'border-slate-300' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-100 text-slate-700', fill: '#94a3b8', border: 'border-slate-300' };

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case 'Material de Limpeza':
      return <Sparkles className="w-3.5 h-3.5 text-cyan-500" />;
    case 'Manutenção & Reparos':
      return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
    case 'Combustível':
      return <Fuel className="w-3.5 h-3.5 text-orange-500" />;
    case 'Alimentação & Café':
      return <Coffee className="w-3.5 h-3.5 text-emerald-500" />;
    case 'Conforto & Eletro':
      return <Tv className="w-3.5 h-3.5 text-indigo-500" />;
    default:
      return <HelpCircle className="w-3.5 h-3.5 text-slate-500" />;
  }
};

export const DespesasPorCategoriaChart: React.FC<DespesasPorCategoriaChartProps> = ({ caixa }) => {
  const { chartData, totalDespesas, maiorCategoria, mediaPorGasto } = useMemo(() => {
    const despesas = caixa.filter((item) => item.tipo === 'Saída');
    const total = despesas.reduce((acc, curr) => acc + curr.valor, 0);

    const agrupado: Record<string, { total: number; count: number }> = {};

    despesas.forEach((item) => {
      const cat = item.categoria || 'Outros';
      if (!agrupado[cat]) {
        agrupado[cat] = { total: 0, count: 0 };
      }
      agrupado[cat].total += item.valor;
      agrupado[cat].count += 1;
    });

    const data = Object.entries(agrupado)
      .map(([categoria, info]) => ({
        categoria,
        total: Number(info.total.toFixed(2)),
        quantidade: info.count,
        percentual: total > 0 ? (info.total / total) * 100 : 0,
        fill: (CATEGORY_COLORS[categoria] || DEFAULT_COLOR).fill,
      }))
      .sort((a, b) => b.total - a.total);

    const maior = data.length > 0 ? data[0] : null;
    const media = despesas.length > 0 ? total / despesas.length : 0;

    return {
      chartData: data,
      totalDespesas: total,
      maiorCategoria: maior,
      mediaPorGasto: media,
    };
  }, [caixa]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[190px]">
          <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800">
            {getCategoryIcon(item.categoria)}
            <span className="font-bold text-slate-100">{item.categoria}</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Total Gasto:</span>
            <span className="font-black text-amber-400 font-['Chakra_Petch'] text-sm">
              {formatCurrency(item.total)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Lançamentos:</span>
            <span className="font-semibold text-slate-200">{item.quantidade} registro(s)</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Representatividade:</span>
            <span className="font-semibold text-emerald-400">{item.percentual.toFixed(1)}% do total</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide font-['Chakra_Petch']">
          Gráfico de Despesas por Categoria
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Nenhuma despesa (saída) foi registrada no caixa até o momento para compor a distribuição gráfica.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-5 sm:p-7 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight font-['Chakra_Petch']">
              Despesas por Categoria
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição e impacto financeiro dos gastos do alojamento RP
          </p>
        </div>

        {/* Quick KPI badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Total Saídas: {formatCurrency(totalDespesas)}</span>
          </div>

          {maiorCategoria && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-amber-600" />
              <span>Maior impacto: <strong>{maiorCategoria.categoria}</strong> ({maiorCategoria.percentual.toFixed(0)}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart & Category Legend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Recharts Bar Chart Container */}
        <div className="lg:col-span-8 h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 10, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="categoria"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                interval={0}
                tickFormatter={(val: string) => {
                  if (val.length > 14) return val.slice(0, 12) + '…';
                  return val;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickFormatter={(val: number) => `R$ ${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.8 }} />
              <Bar
                dataKey="total"
                name="Total Gasto (R$)"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Breakdown List / Legend */}
        <div className="lg:col-span-4 space-y-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Categorias de Despesa</span>
            <span>% do Total</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {chartData.map((item) => {
              const colorInfo = CATEGORY_COLORS[item.categoria] || DEFAULT_COLOR;
              return (
                <div
                  key={item.categoria}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{item.categoria}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantidade} lançamento{item.quantidade > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-black text-slate-900 font-['Chakra_Petch']">
                      {formatCurrency(item.total)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">
                      {item.percentual.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Média por gasto:</span>
            <span className="font-bold text-slate-700 font-['Chakra_Petch']">
              {formatCurrency(mediaPorGasto)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
