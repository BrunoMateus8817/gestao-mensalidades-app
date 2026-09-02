import React, { useState } from 'react';
import { 
  Check, 
  Search, 
  MessageSquare, 
  RotateCcw, 
  Download, 
  FileText, 
  Plus, 
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  Shield,
  CreditCard,
  Send,
  FileDown,
  Phone,
  Sparkles,
  ExternalLink,
  FileCheck2
} from 'lucide-react';
import { Policial, StatusPagamento, ConfiguracaoApp } from '../types';
import { 
  dispararReciboWhatsAppComPDF, 
  exportarPDFRecibo, 
  formatWhatsAppPhone 
} from '../utils/receipt';

interface MensalidadesTabProps {
  policiais: Policial[];
  config: ConfiguracaoApp;
  onDarBaixa: (id: string, forma: 'PIX' | 'Dinheiro' | 'Transferência') => void;
  onReverterStatus: (id: string, novoStatus: StatusPagamento) => void;
  onGerarRecibo: (policial: Policial) => void;
  onOpenGrupoWhatsApp: () => void;
  onOpenNovoPolicial: () => void;
  onOpenRelatorioPagos?: () => void;
  onAtualizarTelefone?: (policialId: string, novoFone: string) => void;
}

export const MensalidadesTab: React.FC<MensalidadesTabProps> = ({
  policiais,
  config,
  onDarBaixa,
  onReverterStatus,
  onGerarRecibo,
  onOpenGrupoWhatsApp,
  onOpenNovoPolicial,
  onOpenRelatorioPagos,
  onAtualizarTelefone
}) => {
  const [filterStatus, setFilterStatus] = useState<'todos' | StatusPagamento>('todos');
  const [filterGraduacao, setFilterGraduacao] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [baixaModalMilitar, setBaixaModalMilitar] = useState<Policial | null>(null);
  const [formaSelecionada, setFormaSelecionada] = useState<'PIX' | 'Dinheiro' | 'Transferência'>('PIX');
  const [enviarReciboAposBaixa, setEnviarReciboAposBaixa] = useState<boolean>(true);
  const [enviandoReciboId, setEnviandoReciboId] = useState<string | null>(null);

  // Modal para digitar telefone de militar não salvo/sem fone cadastrado
  const [promptPhoneMilitar, setPromptPhoneMilitar] = useState<Policial | null>(null);
  const [promptPhoneInput, setPromptPhoneInput] = useState<string>('');

  // Filter logic
  const filteredPoliciais = policiais.filter((p) => {
    const matchesStatus = filterStatus === 'todos' || p.status === filterStatus;
    const matchesGrad = 
      filterGraduacao === 'todos' ||
      (filterGraduacao === 'TEN' && (p.graduacao.includes('TEN') || p.graduacao.includes('CAP'))) ||
      (filterGraduacao === 'SGT' && p.graduacao.includes('SGT')) ||
      (filterGraduacao === 'CB' && p.graduacao === 'CB') ||
      (filterGraduacao === 'SD' && p.graduacao === 'SD');
    
    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      p.nome.toLowerCase().includes(searchLower) ||
      p.nomeGuerra.toLowerCase().includes(searchLower) ||
      p.fone.includes(searchLower);

    return matchesStatus && matchesGrad && matchesSearch;
  });

  const formatPhone = (fone: string) => {
    if (!fone) return '-';
    const clean = fone.replace(/\D/g, '');
    if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    if (clean.length === 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    }
    return fone;
  };

  // Envia cobrança para militar pendente (funciona para contatos não salvos)
  const handleEnviarCobrancaWhatsApp = (p: Policial) => {
    const cleanPhone = formatWhatsAppPhone(p.fone);
    if (!cleanPhone) {
      setPromptPhoneMilitar(p);
      setPromptPhoneInput('');
      return;
    }

    const mensagem = `Olá, *${p.nome}*!\n\nInformamos que a mensalidade do *Alojamento Rádio Patrulha (3º BPM)* referente a *${config.mesReferencia}/${config.anoReferencia}* consta como *PENDENTE*.\n\n💲 *Valor:* ${p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n🔑 *Chave PIX:* ${config.pixChave} (${config.pixTipo})\n👤 *Favorecido:* ${config.pixNome}\n🏦 *Banco:* ${config.pixBanco}\n\nFavor realizar o pagamento e encaminhar o comprovante para confirmação e emissão de recibo.\n\n_Tesouraria - Alojamento Rádio Patrulha_`;

    // Abre a conversa direta no WhatsApp mesmo sem estar salvo na agenda
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  // Envio direto do Recibo em PDF no WhatsApp pelo botão da tabela (funciona para contatos NÃO salvos)
  const handleEnviarReciboDireto = async (p: Policial) => {
    const cleanPhone = formatWhatsAppPhone(p.fone);
    
    // Se o militar não tiver telefone cadastrado, abre prompt para digitar na hora
    if (!cleanPhone || cleanPhone.length < 10) {
      setPromptPhoneMilitar(p);
      setPromptPhoneInput(p.fone || '82');
      return;
    }

    try {
      setEnviandoReciboId(p.id);
      await dispararReciboWhatsAppComPDF(p, config);
    } catch (err) {
      console.error('Erro ao enviar recibo:', err);
    } finally {
      setEnviandoReciboId(null);
    }
  };

  // Confirmação do envio com o telefone digitado no prompt
  const handleConfirmarEnvioPrompt = async () => {
    if (!promptPhoneMilitar) return;

    const militarAtualizado: Policial = {
      ...promptPhoneMilitar,
      fone: promptPhoneInput
    };

    if (onAtualizarTelefone && promptPhoneInput) {
      onAtualizarTelefone(promptPhoneMilitar.id, promptPhoneInput);
    }

    try {
      setEnviandoReciboId(promptPhoneMilitar.id);
      await dispararReciboWhatsAppComPDF(militarAtualizado, config, undefined, promptPhoneInput);
    } finally {
      setEnviandoReciboId(null);
      setPromptPhoneMilitar(null);
    }
  };

  const confirmarBaixa = async () => {
    if (baixaModalMilitar) {
      const militarAtualizado: Policial = {
        ...baixaModalMilitar,
        status: 'Pago',
        forma: formaSelecionada,
        dataPagamento: new Date().toLocaleDateString('pt-BR'),
      };

      onDarBaixa(baixaModalMilitar.id, formaSelecionada);

      if (enviarReciboAposBaixa) {
        if (!baixaModalMilitar.fone) {
          setPromptPhoneMilitar(militarAtualizado);
          setPromptPhoneInput('82');
        } else {
          await dispararReciboWhatsAppComPDF(militarAtualizado, config);
        }
      }

      setBaixaModalMilitar(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden">
        
        {/* Bento Toolbar */}
        <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status & Grad Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-200/70 p-1 rounded-2xl border border-slate-300/50">
              <button
                onClick={() => setFilterStatus('todos')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'todos'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({policiais.length})
              </button>
              <button
                onClick={() => setFilterStatus('Pago')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'Pago'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Pagos ({policiais.filter(p => p.status === 'Pago').length})
              </button>
              <button
                onClick={() => setFilterStatus('Pendente')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'Pendente'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-700'
                }`}
              >
                Pendentes ({policiais.filter(p => p.status === 'Pendente').length})
              </button>
              <button
                onClick={() => setFilterStatus('Isento')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'Isento'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Isentos ({policiais.filter(p => p.status === 'Isento').length})
              </button>
            </div>

            {/* Graduação Filter */}
            <select
              value={filterGraduacao}
              onChange={(e) => setFilterGraduacao(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl px-3 py-2 outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
            >
              <option value="todos">Todas as Patentes</option>
              <option value="TEN">Oficiais (TEN / CAP)</option>
              <option value="SGT">Sargentos (1º, 2º, 3º SGT)</option>
              <option value="CB">Cabos (CB)</option>
              <option value="SD">Soldados (SD)</option>
            </select>
          </div>

          {/* Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar militar ou fone..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>

            {onOpenRelatorioPagos && (
              <button
                type="button"
                onClick={onOpenRelatorioPagos}
                title="Gerar Relatório e Lista Oficial dos Militares que Pagaram a Mensalidade"
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-300" />
                <span>Relatório de Pagos ({policiais.filter(p => p.status === 'Pago').length})</span>
              </button>
            )}

            <button
              onClick={onOpenGrupoWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>Cobrança em Grupo</span>
            </button>

            <button
              onClick={onOpenNovoPolicial}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black flex items-center justify-center space-x-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Policial</span>
            </button>
          </div>

        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Militar / Graduação</th>
                <th className="py-3 px-3">Telefone</th>
                <th className="py-3 px-3 text-center">Situação</th>
                <th className="py-3 px-3 text-right">Valor</th>
                <th className="py-3 px-3 text-center">Pagamento</th>
                <th className="py-3 px-4 sm:px-6 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPoliciais.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    Nenhum militar localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredPoliciais.map((p) => {
                  const isPago = p.status === 'Pago';
                  const isPendente = p.status === 'Pendente';
                  const isIsento = p.status === 'Isento';
                  const isEnviandoEste = enviandoReciboId === p.id;

                  return (
                    <tr 
                      key={p.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      {/* Name & Rank */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPago ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                            isPendente ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            <Shield className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">
                              {p.graduacao} {p.nomeGuerra || p.nome}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {p.nome}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">
                        {p.fone ? (
                          <a 
                            href={`https://api.whatsapp.com/send?phone=${formatWhatsAppPhone(p.fone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir WhatsApp direto (mesmo sem salvar contato)"
                            className="hover:text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>{formatPhone(p.fone)}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 italic text-[11px]">Sem fone</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3 text-center">
                        {isPago && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Pago
                          </span>
                        )}
                        {isPendente && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <Clock className="w-3 h-3 text-rose-600" />
                            Pendente
                          </span>
                        )}
                        {isIsento && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Ban className="w-3 h-3 text-slate-500" />
                            Isento
                          </span>
                        )}
                      </td>

                      {/* Valor */}
                      <td className="py-3 px-3 text-right font-['Chakra_Petch'] font-bold text-xs sm:text-sm text-slate-900">
                        {isIsento ? (
                          <span className="text-slate-400 font-normal">R$ 0,00</span>
                        ) : (
                          <span>{p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        )}
                      </td>

                      {/* Info Quitação */}
                      <td className="py-3 px-3 text-center text-xs text-slate-500">
                        {isPago ? (
                          <div className="text-[11px] leading-tight">
                            <span className="font-bold text-emerald-800">{p.forma || 'PIX'}</span>
                            <span className="block text-[10px] text-slate-400">{p.dataPagamento || 'Hoje'}</span>
                          </div>
                        ) : isPendente ? (
                          <span className="text-rose-600/80 text-[11px] font-semibold">Aguardando</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPendente && (
                            <>
                              <button
                                onClick={() => setBaixaModalMilitar(p)}
                                title="Dar Baixa no Pagamento"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Dar Baixa</span>
                              </button>

                              <button
                                onClick={() => handleEnviarCobrancaWhatsApp(p)}
                                title="Enviar Cobrança no WhatsApp (mesmo sem salvar contato)"
                                className="p-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {isPago && (
                            <>
                              {/* Botão de Envio Direto do PDF no WhatsApp */}
                              <button
                                onClick={() => handleEnviarReciboDireto(p)}
                                disabled={isEnviandoEste}
                                title="Enviar Recibo em PDF diretamente pelo WhatsApp (funciona para contatos NÃO salvos)"
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-75"
                              >
                                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                <span>{isEnviandoEste ? 'Enviando...' : 'Recibo PDF WhatsApp'}</span>
                              </button>

                              {/* Botão para abrir o modal de recibo / impressão / cópia */}
                              <button
                                onClick={() => onGerarRecibo(p)}
                                title="Visualizar / Imprimir Comprovante"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                <FileText className="w-4 h-4 text-amber-600" />
                              </button>

                              <button
                                onClick={() => onReverterStatus(p.id, 'Pendente')}
                                title="Reverter para Pendente"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {isIsento && (
                            <button
                              onClick={() => setBaixaModalMilitar(p)}
                              title="Tornar Pagante / Quitar"
                              className="px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
                            >
                              Dar Baixa
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal de Confirmação de Telefone para Militar Não Salvo ou Sem Telefone */}
      {promptPhoneMilitar && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Enviar Recibo no WhatsApp</h3>
                  <p className="text-[10px] text-emerald-700 font-semibold">Abre direto mesmo sem salvar na agenda</p>
                </div>
              </div>
              <button 
                onClick={() => setPromptPhoneMilitar(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
              <p className="text-slate-500 font-semibold">Militar Destinatário:</p>
              <p className="font-black text-slate-900 text-sm">
                {promptPhoneMilitar.graduacao} {promptPhoneMilitar.nome}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Número de WhatsApp (DDD + Número):</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={promptPhoneInput}
                  onChange={(e) => setPromptPhoneInput(e.target.value)}
                  placeholder="Ex: 82991234567"
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                O arquivo PDF será baixado e o chat no WhatsApp abrirá imediatamente com este número.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPromptPhoneMilitar(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarEnvioPrompt}
                disabled={!promptPhoneInput.trim()}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                Enviar PDF WhatsApp
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Baixa de Pagamento */}
      {baixaModalMilitar && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Confirmar Pagamento</h3>
              </div>
              <button 
                onClick={() => setBaixaModalMilitar(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <p className="text-slate-500 font-semibold">Militar:</p>
              <p className="font-black text-slate-900 text-sm">
                {baixaModalMilitar.graduacao} {baixaModalMilitar.nome}
              </p>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-600 font-medium">
                <span>Valor a Quitar:</span>
                <strong className="text-emerald-700 font-bold">
                  {baixaModalMilitar.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </strong>
              </div>
            </div>

            {/* Seleção de Forma de Pagamento */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Forma de Pagamento:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['PIX', 'Dinheiro', 'Transferência'] as const).map((forma) => (
                  <button
                    key={forma}
                    type="button"
                    onClick={() => setFormaSelecionada(forma)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      formaSelecionada === forma
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {forma}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox para enviar recibo em PDF via WhatsApp */}
            <label className="flex items-center gap-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors">
              <input
                type="checkbox"
                checked={enviarReciboAposBaixa}
                onChange={(e) => setEnviarReciboAposBaixa(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <div className="text-xs text-slate-800">
                <span className="font-bold text-emerald-950 block">Enviar recibo PDF no WhatsApp</span>
                <span className="text-[10px] text-emerald-800 block">Envia exclusivamente o arquivo PDF do comprovante</span>
              </div>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBaixaModalMilitar(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarBaixa}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Salvar Pagamento</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
