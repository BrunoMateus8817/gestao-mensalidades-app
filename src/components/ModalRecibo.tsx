import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  MessageSquare, 
  Copy, 
  Check, 
  FileDown,
  Loader2,
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RPLogo } from './RPLogo';
import { Policial, ConfiguracaoApp } from '../types';
import { 
  gerarNumeroRecibo, 
  gerarAutenticacaoDigital,
  gerarTextoRecibo, 
  dispararReciboWhatsAppComPDF,
  compartilharArquivoPDFNativo,
  exportarPDFRecibo,
  formatWhatsAppPhone
} from '../utils/receipt';

interface ModalReciboProps {
  policial: Policial | null;
  config: ConfiguracaoApp;
  onClose: () => void;
  onSalvarTelefone?: (policialId: string, novoFone: string) => void;
}

export const ModalRecibo: React.FC<ModalReciboProps> = ({ 
  policial, 
  config, 
  onClose,
  onSalvarTelefone 
}) => {
  const [copied, setCopied] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [telefoneDestino, setTelefoneDestino] = useState(policial?.fone || '');

  if (!policial) return null;

  const dataAtual = policial.dataPagamento || new Date().toLocaleDateString('pt-BR');
  const numeroRecibo = gerarNumeroRecibo(config.anoReferencia, policial.id);
  const autenticacaoDigital = gerarAutenticacaoDigital(policial.id);
  const cleanPhone = formatWhatsAppPhone(telefoneDestino);

  const handlePrint = () => {
    window.print();
  };

  const handleEnviarWhatsAppPDF = async () => {
    try {
      setEnviando(true);
      
      // Se informou um telefone e for diferente, salva no militar
      if (telefoneDestino && telefoneDestino !== policial.fone && onSalvarTelefone) {
        onSalvarTelefone(policial.id, telefoneDestino);
      }

      await dispararReciboWhatsAppComPDF(policial, config, numeroRecibo, telefoneDestino);
      setStatusMsg('PDF baixado e conversa do WhatsApp aberta diretamente!');
      setTimeout(() => setStatusMsg(null), 6000);
    } catch (err) {
      console.error('Erro ao enviar recibo:', err);
      setStatusMsg('Abrindo WhatsApp...');
    } finally {
      setEnviando(false);
    }
  };

  const handleExportPDF = () => {
    exportarPDFRecibo(policial, config, numeroRecibo);
    setStatusMsg('PDF oficial gerado e salvo!');
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCompartilharArquivo = async () => {
    const shared = await compartilharArquivoPDFNativo(policial, config, numeroRecibo);
    if (!shared) {
      exportarPDFRecibo(policial, config, numeroRecibo);
      setStatusMsg('PDF baixado no aparelho.');
    } else {
      setStatusMsg('Arquivo PDF compartilhado com sucesso!');
    }
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCopyText = async () => {
    const texto = gerarTextoRecibo(policial, config, numeroRecibo);
    try {
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-slate-900 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Banner */}
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 no-print bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Militar Quitado: <strong>{policial.graduacao} {policial.nome}</strong></span>
          </div>

          <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-lg">
            Recibo Oficial
          </div>
        </div>

        {statusMsg && (
          <div className="mb-3 p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn no-print">
            <Check className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Printable & Visual Representation (Identical to reference image) */}
        <div 
          id="print-area" 
          className="space-y-4 sm:space-y-5 relative overflow-hidden bg-white text-slate-950 rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm"
        >
          {/* Subtle Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <RPLogo className="w-80 h-80" />
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-slate-200 pb-3 relative z-10">
            <div className="flex justify-center mb-2">
              <div className="p-1 bg-slate-950 rounded-xl border border-amber-500 shadow-md inline-block">
                <RPLogo className="w-14 h-16" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wider font-['Chakra_Petch']">
              COMPROVANTE DE PAGAMENTO
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-600 font-black uppercase tracking-wider mt-0.5">
              {config.alojamento} (RP) — {config.batalhao}
            </p>
          </div>

          {/* Receipt Body Frame */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5 relative z-10">
            
            <div className="flex justify-between items-center text-xs text-slate-600 font-mono">
              <span>Recibo: <strong className="text-slate-950 font-bold">{numeroRecibo}</strong></span>
              <span>Data: <strong className="text-slate-950 font-bold">{dataAtual}</strong></span>
            </div>

            {/* Big Green Emerald Amount Card */}
            <div className="text-center py-3.5 bg-emerald-50 rounded-xl border border-emerald-200 shadow-xs">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                VALOR RECEBIDO & QUITADO
              </p>
              <p className="text-3xl font-black text-emerald-700 mt-0.5 font-['Chakra_Petch'] tracking-tight">
                {policial.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-emerald-700/80 font-semibold mt-0.5">
                (Taxa de Manutenção do Alojamento)
              </p>
            </div>

            {/* Table Details */}
            <div className="text-xs space-y-2 pt-1 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-semibold">Recebemos de:</span>
                <strong className="text-slate-950 uppercase font-bold text-right">
                  {policial.graduacao} {policial.nome}
                </strong>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-semibold">Referência:</span>
                <span className="text-slate-900 font-medium text-right">
                  Mensalidade do Alojamento RP ({config.mesReferencia}/${config.anoReferencia})
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500 font-semibold">Forma de Pagamento:</span>
                <span className="text-slate-950 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {policial.forma || 'PIX'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Unidade:</span>
                <span className="text-slate-900 font-medium">{config.batalhao}</span>
              </div>
            </div>

          </div>

          {/* Signature Line */}
          <div className="pt-5 sm:pt-6 text-center relative z-10">
            <div className="w-56 mx-auto border-b-2 border-slate-950 mb-1.5"></div>
            <p className="text-xs font-bold text-slate-950 uppercase tracking-wide">
              {config.responsavelTesouraria}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">
              TESOURARIA — ALOJAMENTO RÁDIO PATRULHA
            </p>
            <p className="text-[9px] text-slate-400 font-mono mt-2">
              Autenticação Digital: {autenticacaoDigital}
            </p>
          </div>

        </div>

        {/* WhatsApp Direct Input for Contacts (Saved or Unsaved) */}
        <div className="mt-4 p-3 bg-white border border-emerald-200/90 rounded-2xl shadow-xs no-print space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 fill-current" />
              <span>WhatsApp de Destino:</span>
            </label>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Abre direto mesmo sem salvar contato
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={telefoneDestino}
                onChange={(e) => setTelefoneDestino(e.target.value)}
                placeholder="DDD + Telefone (ex: 82991234567)"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 space-y-2.5 no-print">
          {/* Main Action Button: Send in PDF via WhatsApp */}
          <button
            type="button"
            onClick={handleEnviarWhatsAppPDF}
            disabled={enviando}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-75"
          >
            {enviando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando envio do PDF via WhatsApp...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>ENVIAR RECIBO EM PDF VIA WHATSAPP</span>
              </>
            )}
          </button>

          {/* Secondary Action Buttons */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleCompartilharArquivo}
              title="Compartilhar arquivo PDF direto nos apps do aparelho"
              className="py-2.5 px-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>Arquivo</span>
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              title="Baixar arquivo PDF no dispositivo"
              className="py-2.5 px-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Baixar</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              title="Copiar texto oficial do recibo"
              className="py-2.5 px-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-[11px] sm:text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
              <span>{copied ? 'Copiado' : 'Texto'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              title="Imprimir comprovante"
              className="py-2.5 px-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
