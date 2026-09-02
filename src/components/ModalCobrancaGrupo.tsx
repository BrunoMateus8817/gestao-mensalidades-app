import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, AlertTriangle } from 'lucide-react';
import { Policial, ConfiguracaoApp } from '../types';

interface ModalCobrancaGrupoProps {
  policiais: Policial[];
  config: ConfiguracaoApp;
  onClose: () => void;
}

export const ModalCobrancaGrupo: React.FC<ModalCobrancaGrupoProps> = ({
  policiais,
  config,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const pendentes = policiais.filter((p) => p.status === 'Pendente');
  const totalPendente = pendentes.reduce((acc, curr) => acc + curr.valor, 0);

  const formatText = () => {
    let msg = `📢 *RELAÇÃO DE MENSALIDADES PENDENTES — ALOJAMENTO RÁDIO PATRULHA*\n`;
    msg += `🏛️ *${config.batalhao} — ${config.alojamento}*\n`;
    msg += `📅 *Referência:* ${config.mesReferencia}/${config.anoReferencia}\n\n`;
    msg += `Senhores militares, segue a relação atualizada para quitação da taxa de manutenção do alojamento:\n\n`;
    msg += `💳 *DADOS PARA PAGAMENTO VIA PIX:*\n`;
    msg += `• *Chave PIX:* \`${config.pixChave}\` (${config.pixTipo})\n`;
    msg += `• *Titular:* ${config.pixNome}\n`;
    msg += `• *Banco:* ${config.pixBanco}\n`;
    msg += `• *Valor Padrão:* ${config.valorMensalidadePadrao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
    
    msg += `📋 *MILITARES PENDENTES (${pendentes.length}):*\n`;
    if (pendentes.length === 0) {
      msg += `✅ *Parabéns! Todo o efetivo está quitado este mês.*\n`;
    } else {
      pendentes.forEach((p, idx) => {
        msg += `${idx + 1}. 🔴 *${p.nome}* — ${p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
      });
    }

    msg += `\n💰 *Total a Arrecadar:* ${totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n`;
    msg += `⚠️ *Atenção:* Favor enviar o comprovante no privado da Tesouraria (${config.responsavelTesouraria}) para baixa e emissão de recibo.\n\n`;
    msg += `_Contamos com o apoio de todos para manter nosso alojamento limpo e estruturado!_`;

    return msg;
  };

  const texto = formatText();

  const handleCopy = () => {
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 max-h-[90vh] flex flex-col">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center space-x-3 text-emerald-600">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight font-['Chakra_Petch']">
                Cobrança em Grupo (WhatsApp)
              </h3>
              <p className="text-xs text-slate-500">
                Texto formatado para envio no grupo do WhatsApp da Rádio Patrulha.
              </p>
            </div>
          </div>
        </div>

        {/* Quick summary strip */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-800 flex items-center justify-between mb-3.5">
          <span className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            {pendentes.length} militares pendentes em {config.mesReferencia}/{config.anoReferencia}
          </span>
          <span className="font-bold font-['Chakra_Petch'] text-sm text-rose-700">
            {totalPendente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        {/* Textarea view */}
        <div className="flex-1 overflow-hidden flex flex-col mb-4">
          <textarea
            readOnly
            value={texto}
            className="w-full flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-800 focus:outline-none resize-none leading-relaxed shadow-inner"
            rows={10}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700">Texto Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-700" />
                <span>Copiar Mensagem</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar no WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
