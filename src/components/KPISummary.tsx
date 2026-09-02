import React from 'react';
import { 
  HandCoins, 
  ClockAlert, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  Printer,
  MessageSquare,
  FileCheck2,
  FileDown
} from 'lucide-react';
import { Policial, MovimentacaoCaixa, ConfiguracaoApp } from '../types';

interface KPISummaryProps {
  policiais: Policial[];
  caixa: MovimentacaoCaixa[];
  config?: ConfiguracaoApp;
  onOpenBalancete?: () => void;
  onOpenGrupoWhatsApp?: () => void;
  onOpenRelatorioPagos?: () => void;
  onOpenBaixarApp?: () => void;
}

export const KPISummary: React.FC<KPISummaryProps> = ({ 
  policiais, 
  caixa,
  config,
  onOpenBalancete,
  onOpenGrupoWhatsApp,
  onOpenRelatorioPagos,
  onOpenBaixarApp
}) => {
  const pagos = policiais.filter(p => p.status === 'Pago');
  const pendentes = policiais.filter(p => p.status === 'Pendente');
  const isentos = policiais.filter(p => p.status === 'Isento');

  const totalArrecadadoMensalidades = pagos.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPendente = pendentes.reduce((acc, curr) => acc + curr.valor, 0);

  const entradasCaixa = caixa.filter(c => c.tipo === 'Entrada').reduce((acc, curr) => acc + curr.valor, 0);
  const saidasCaixa = caixa.filter(c => c.tipo === 'Saída').reduce((acc, curr) => acc + curr.valor, 0);

  const totalEntradas = totalArrecadadoMensalidades + entradasCaixa;
  const saldoCaixa = totalEntradas - saidasCaixa;

  const totalObrigatorios = policiais.filter(p => p.status !== 'Isento').length;
  const taxaAdimplencia = totalObrigatorios > 0 ? Math.round((pagos.length / totalObrigatorios) * 100) : 0;

  return (
    <div className="space-y-4 mb-6 no-print">
      
      {/* Bento Grid Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Bento Hero Card (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-md text-white">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-black rounded-full border border-amber-400/30 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                Fundos Operacionais • {config?.mesReferencia || 'Período Atual'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-4 text-white tracking-tight uppercase font-['Chakra_Petch']">
              Saldo Líquido em Caixa
            </h2>
            <div className="mt-2 flex items-baseline gap-3">
              <span className={`text-3xl sm:text-4xl font-black font-['Chakra_Petch'] ${saldoCaixa >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {saldoCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                disponível para compras & melhorias
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-lg">
              Arrecadação total de <strong className="text-white">{totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> ({pagos.length} militares quitados) com <strong className="text-white">{saidasCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> investidos na conservação do alojamento.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 relative z-10">
            {onOpenRelatorioPagos && (
              <button
                onClick={onOpenRelatorioPagos}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-slate-950" />
                <span>Relatório de Pagos ({pagos.length})</span>
              </button>
            )}
            {onOpenBalancete && (
              <button
                onClick={onOpenBalancete}
                className="px-5 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl hover:bg-amber-300 transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Emitir Balancete</span>
              </button>
            )}
            {onOpenGrupoWhatsApp && (
              <button
                onClick={onOpenGrupoWhatsApp}
                className="px-5 py-2.5 bg-slate-800/90 text-white font-bold rounded-xl hover:bg-slate-700 border border-slate-600 transition-colors text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Aviso no WhatsApp</span>
              </button>
            )}
            {onOpenBaixarApp && (
              <button
                onClick={onOpenBaixarApp}
                title="Gerar arquivo para baixar o aplicativo ou instalar no celular / computador"
                className="px-5 py-2.5 bg-slate-800/90 text-white font-bold rounded-xl hover:bg-slate-700 border border-slate-600 transition-colors text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileDown className="w-4 h-4 text-amber-400" />
                <span>Baixar App</span>
              </button>
            )}
          </div>

          {/* Ambient blur inside Bento Card */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Bento System Status & Efficiency Gauge (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-200 text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-lg border border-slate-200">
                Taxa do Pelotão
              </span>
            </div>

            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Status de Adimplência</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-['Chakra_Petch']">
                {taxaAdimplencia}% Quitado
              </p>
              <span className="text-xs text-emerald-600 font-extrabold">
                {pagos.length} de {totalObrigatorios}
              </span>
            </div>

            <div className="mt-4 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${taxaAdimplencia}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onOpenRelatorioPagos}
              title="Clique para abrir o Relatório de Militares Pagos"
              className={`p-2 bg-emerald-50/80 hover:bg-emerald-100/90 rounded-xl border border-emerald-200 transition-all ${onOpenRelatorioPagos ? 'cursor-pointer hover:scale-102 hover:shadow-2xs' : ''}`}
            >
              <p className="text-[10px] uppercase font-bold text-emerald-700 flex items-center justify-center gap-1">
                <span>Pagos</span>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              </p>
              <p className="text-base font-black text-emerald-950 font-['Chakra_Petch']">{pagos.length}</p>
            </button>
            <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100">
              <p className="text-[10px] uppercase font-bold text-rose-700">Pendentes</p>
              <p className="text-base font-black text-rose-950 font-['Chakra_Petch']">{pendentes.length}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-600">Isentos</p>
              <p className="text-base font-black text-slate-900 font-['Chakra_Petch']">{isentos.length}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3 Modular Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Arrecadado */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Arrecadação Total</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-['Chakra_Petch']">
              {totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold">{pagos.length}</span> mensalidades + {caixa.filter(c => c.tipo === 'Entrada').length} doações
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
            <HandCoins className="w-6 h-6" />
          </div>
        </div>

        {/* Pendente de Recebimento */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:border-rose-300 transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>A Receber (Pendente)</span>
              <ClockAlert className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-600 mt-1 font-['Chakra_Petch']">
              {totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-rose-700 font-bold">{pendentes.length}</span> policiais a quitar
            </p>
          </div>
          <div className="w-12 h-12 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 shrink-0 group-hover:scale-105 transition-transform">
            <ClockAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Total de Gastos com Materiais */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex items-center justify-between hover:border-amber-300 transition-all group">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>Despesas / Materiais</span>
              <ShoppingCart className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600 mt-1 font-['Chakra_Petch']">
              {saidasCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-amber-700 font-bold">{caixa.filter(c => c.tipo === 'Saída').length}</span> registros no caixa
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

      </div>

    </div>
  );
};

