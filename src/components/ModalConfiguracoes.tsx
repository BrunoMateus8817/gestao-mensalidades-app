import React, { useState } from 'react';
import { X, Settings, Key, Building2, User, Database, RefreshCcw, Download, Upload, Check, FileDown } from 'lucide-react';
import { ConfiguracaoApp } from '../types';
import { gerarArquivoInstaladorHtml } from '../utils/downloadAppFile';

interface ModalConfiguracoesProps {
  config: ConfiguracaoApp;
  onSalvarConfig: (novaConfig: ConfiguracaoApp) => void;
  onExportarBackup: () => void;
  onImportarBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRestaurarPadroes: () => void;
  onClose: () => void;
}

export const ModalConfiguracoes: React.FC<ModalConfiguracoesProps> = ({
  config,
  onSalvarConfig,
  onExportarBackup,
  onImportarBackup,
  onRestaurarPadroes,
  onClose
}) => {
  const [form, setForm] = useState<ConfiguracaoApp>({ ...config });
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvarConfig(form);
    setSalvoFeedback(true);
    setTimeout(() => {
      setSalvoFeedback(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
              Configurações & Tesouraria
            </h3>
            <p className="text-xs text-slate-500">
              Dados para PIX, integração com Google Sheets e backup.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Seção PIX */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 font-['Chakra_Petch']">
              <Key className="w-4 h-4 text-amber-600" /> Dados para Recebimento via PIX
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tipo da Chave</label>
                <select
                  value={form.pixTipo}
                  onChange={(e) => setForm({ ...form, pixTipo: e.target.value as any })}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
                >
                  <option value="Email" className="bg-white">E-mail</option>
                  <option value="CPF" className="bg-white">CPF</option>
                  <option value="CNPJ" className="bg-white">CNPJ</option>
                  <option value="Telefone" className="bg-white">Telefone</option>
                  <option value="Aleatória" className="bg-white">Aleatória</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Chave PIX</label>
                <input
                  type="text"
                  required
                  value={form.pixChave}
                  onChange={(e) => setForm({ ...form, pixChave: e.target.value })}
                  placeholder="Ex: 82991234567 ou email@pm.al.gov.br"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nome do Titular / Favorecido</label>
                <input
                  type="text"
                  value={form.pixNome}
                  onChange={(e) => setForm({ ...form, pixNome: e.target.value })}
                  placeholder="Ex: 3º SGT Mateus"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banco / Instituição</label>
                <input
                  type="text"
                  value={form.pixBanco}
                  onChange={(e) => setForm({ ...form, pixBanco: e.target.value })}
                  placeholder="Ex: Banco do Brasil / Nubank"
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Seção Parâmetros da Unidade */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 font-['Chakra_Petch']">
              <Building2 className="w-4 h-4 text-amber-600" /> Identificação Militar & Valores
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Batalhão / OPM</label>
                <input
                  type="text"
                  value={form.batalhao}
                  onChange={(e) => setForm({ ...form, batalhao: e.target.value })}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Alojamento / Pelotão</label>
                <input
                  type="text"
                  value={form.alojamento}
                  onChange={(e) => setForm({ ...form, alojamento: e.target.value })}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Responsável pela Tesouraria</label>
                <input
                  type="text"
                  value={form.responsavelTesouraria}
                  onChange={(e) => setForm({ ...form, responsavelTesouraria: e.target.value })}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mensalidade Padrão (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.valorMensalidadePadrao}
                  onChange={(e) => setForm({ ...form, valorMensalidadePadrao: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-bold font-['Chakra_Petch'] focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Integração Google Apps Script */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5 font-['Chakra_Petch']">
              <Database className="w-4 h-4 text-amber-600" /> Endpoint do Google Apps Script
            </h4>
            <input
              type="url"
              value={form.googleAppsScriptUrl}
              onChange={(e) => setForm({ ...form, googleAppsScriptUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full p-2.5 text-[11px] bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
            <p className="text-[10px] text-slate-500">
              Conexão com a planilha Google Sheets do Pelotão para sincronização em tempo real.
            </p>
          </div>

          {/* Backup e Dados */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onExportarBackup}
                className="px-3 py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-600" /> Backup JSON
              </button>

              <button
                type="button"
                onClick={() => gerarArquivoInstaladorHtml(config.alojamento || 'Alojamento RP 3 BPM')}
                title="Baixar arquivo instalador web independente do aplicativo"
                className="px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-600" /> Baixar Instalador App
              </button>

              <label className="px-3 py-1.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-amber-600" /> Restaurar
                <input type="file" accept=".json" onChange={onImportarBackup} className="hidden" />
              </label>
            </div>

            <button
              type="button"
              onClick={onRestaurarPadroes}
              className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCcw className="w-3 h-3" /> Restaurar Padrões
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {salvoFeedback ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Configurações Salvas!</span>
                </>
              ) : (
                <span>Salvar Configurações</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
