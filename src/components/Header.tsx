import React from 'react';
import { RPLogo } from './RPLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  DollarSign, 
  ReceiptText, 
  Users, 
  Settings, 
  RefreshCw, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Shield,
  Activity,
  FileCheck2
} from 'lucide-react';
import { ConfiguracaoApp } from '../types';

interface HeaderProps {
  activeTab: 'mensalidades' | 'caixa' | 'cadastro';
  setActiveTab: (tab: 'mensalidades' | 'caixa' | 'cadastro') => void;
  config: ConfiguracaoApp;
  onOpenSettings: () => void;
  onOpenBalancete: () => void;
  onOpenRelatorioPagos?: () => void;
  isSyncing: boolean;
  onSync: () => void;
  syncStatus: 'idle' | 'success' | 'error';
  onMonthChange: (mes: string) => void;
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenSettings,
  onOpenBalancete,
  onOpenRelatorioPagos,
  isSyncing,
  onSync,
  syncStatus,
  onMonthChange
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-xl text-slate-900 sticky top-0 z-30 border-b border-slate-200/90 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Branding & Unit Bento Pill */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-14 bg-gradient-to-br from-slate-900 to-slate-800 p-1 rounded-2xl border border-slate-700/70 shadow-sm flex items-center justify-center shrink-0">
            <RPLogo className="w-10 h-12" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 uppercase font-['Chakra_Petch']">
                Alojamento Rádio Patrulha
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                3º BPM
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 font-medium">Controle Financeiro & Tesouraria</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Pelotão RP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Bento Navigation Tabs */}
        <nav className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200 self-center md:self-auto shadow-xs">
          <button
            id="tab-btn-mensalidades"
            onClick={() => setActiveTab('mensalidades')}
            className={`flex items-center gap-2 py-1.5 px-3.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'mensalidades'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Mensalidades</span>
          </button>

          <button
            id="tab-btn-caixa"
            onClick={() => setActiveTab('caixa')}
            className={`flex items-center gap-2 py-1.5 px-3.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'caixa'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Caixa & Gastos</span>
          </button>

          <button
            id="tab-btn-cadastro"
            onClick={() => setActiveTab('cadastro')}
            className={`flex items-center gap-2 py-1.5 px-3.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'cadastro'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Efetivo RP</span>
          </button>
        </nav>

        {/* Right: Period Selector, Sync & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          
          {/* Mês Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 shadow-xs hover:border-slate-300 transition-colors">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
            <select
              value={config.mesReferencia}
              onChange={(e) => onMonthChange(e.target.value)}
              className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer pr-1"
            >
              {MESES.map((m) => (
                <option key={m} value={m} className="bg-white text-slate-900">
                  {m} / {config.anoReferencia}
                </option>
              ))}
            </select>
          </div>

          {/* Sincronização com Google Sheets */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="Sincronizar com a Planilha do Google Apps Script"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </span>
            {syncStatus === 'success' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Planilha atualizada" />
            )}
            {syncStatus === 'error' && (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" title="Modo local (Planilha offline)" />
            )}
          </button>

          {/* Relatório de Militares Pagos */}
          {onOpenRelatorioPagos && (
            <button
              onClick={onOpenRelatorioPagos}
              title="Gerar Relatório dos Militares que Pagaram a Mensalidade"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Relatório de Pagos</span>
            </button>
          )}

          {/* Balancete Formal / Impressão */}
          <button
            onClick={onOpenBalancete}
            title="Gerar Balancete / Prestação de Contas Militar"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Balancete</span>
          </button>

          {/* Configurações */}
          <button
            onClick={onOpenSettings}
            title="Configurações do PIX e Tesouraria"
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-500" />
          </button>

          {/* Botão de Instalação PWA */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};

