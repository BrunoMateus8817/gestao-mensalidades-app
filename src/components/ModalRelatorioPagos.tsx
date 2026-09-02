import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  FileDown, 
  CheckCircle2, 
  Search, 
  Copy, 
  Check, 
  Send, 
  Shield, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText,
  Filter,
  ExternalLink,
  Users,
  QrCode,
  Banknote,
  Building2,
  Receipt
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RPLogo } from './RPLogo';
import { Policial, ConfiguracaoApp } from '../types';
import { dispararReciboWhatsAppComPDF } from '../utils/receipt';

interface ModalRelatorioPagosProps {
  policiais: Policial[];
  config: ConfiguracaoApp;
  onClose: () => void;
  onGerarRecibo?: (policial: Policial) => void;
}

export const ModalRelatorioPagos: React.FC<ModalRelatorioPagosProps> = ({
  policiais,
  config,
  onClose,
  onGerarRecibo
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterForma, setFilterForma] = useState<string>('todos');

  // Filtra apenas os policiais com status "Pago"
  const militaresPagos = useMemo(() => {
    return policiais.filter(p => p.status === 'Pago');
  }, [policiais]);

  const totalArrecadado = useMemo(() => {
    return militaresPagos.reduce((acc, curr) => acc + curr.valor, 0);
  }, [militaresPagos]);

  // Estatísticas por forma de pagamento
  const statsForma = useMemo(() => {
    const pix = militaresPagos.filter(p => (p.forma || 'PIX') === 'PIX');
    const dinheiro = militaresPagos.filter(p => p.forma === 'Dinheiro');
    const transf = militaresPagos.filter(p => p.forma === 'Transferência' || p.forma === 'Cartão');

    return {
      pix: {
        qtd: pix.length,
        total: pix.reduce((acc, curr) => acc + curr.valor, 0)
      },
      dinheiro: {
        qtd: dinheiro.length,
        total: dinheiro.reduce((acc, curr) => acc + curr.valor, 0)
      },
      transf: {
        qtd: transf.length,
        total: transf.reduce((acc, curr) => acc + curr.valor, 0)
      }
    };
  }, [militaresPagos]);

  // Lista filtrada para exibição na tela
  const listaFiltrada = useMemo(() => {
    return militaresPagos.filter(p => {
      const matchForma = filterForma === 'todos' || (p.forma || 'PIX') === filterForma;
      const searchLower = searchTerm.toLowerCase().trim();
      const matchSearch = 
        p.nome.toLowerCase().includes(searchLower) ||
        p.nomeGuerra.toLowerCase().includes(searchLower) ||
        p.graduacao.toLowerCase().includes(searchLower) ||
        p.fone.includes(searchLower);

      return matchForma && matchSearch;
    });
  }, [militaresPagos, filterForma, searchTerm]);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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

  // Texto oficial para copiar ou compartilhar no WhatsApp do Pelotão
  const gerarTextoRelatorio = () => {
    const dataEmissao = new Date().toLocaleDateString('pt-BR');
    let txt = `👮‍♂️ *POLÍCIA MILITAR DE ALAGOAS - 3º BPM*\n`;
    txt += `🚔 *ALOJAMENTO RÁDIO PATRULHA*\n`;
    txt += `📋 *RELATÓRIO DE MILITARES PAGOS (QUITAÇÕES)*\n`;
    txt += `🗓️ *Referência:* ${config.mesReferencia.toUpperCase()} / ${config.anoReferencia}\n`;
    txt += `📅 *Emissão:* ${dataEmissao}\n\n`;
    txt += `📊 *RESUMO GERAL:*\n`;
    txt += `• *Total de Militares Quitados:* ${militaresPagos.length} militares\n`;
    txt += `• *Total Arrecadado:* ${formatCurrency(totalArrecadado)}\n`;
    txt += `• *PIX:* ${statsForma.pix.qtd} (${formatCurrency(statsForma.pix.total)})\n`;
    if (statsForma.dinheiro.qtd > 0) {
      txt += `• *Espécie (Dinheiro):* ${statsForma.dinheiro.qtd} (${formatCurrency(statsForma.dinheiro.total)})\n`;
    }
    if (statsForma.transf.qtd > 0) {
      txt += `• *Transferência / Outros:* ${statsForma.transf.qtd} (${formatCurrency(statsForma.transf.total)})\n`;
    }
    txt += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    txt += `📜 *RELAÇÃO NOMINAL DOS MILITARES QUITADOS:*\n\n`;

    militaresPagos.forEach((p, idx) => {
      const forma = p.forma || 'PIX';
      const dataPgto = p.dataPagamento ? ` em ${p.dataPagamento}` : '';
      txt += `${(idx + 1).toString().padStart(2, '0')}. ✅ *${p.graduacao} ${p.nomeGuerra || p.nome}* — ${formatCurrency(p.valor)} (${forma}${dataPgto})\n`;
    });

    txt += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    txt += `*Tesouraria:* ${config.responsavelTesouraria}\n`;
    txt += `_Pelotão de Rádio Patrulha - 3º BPM_`;
    return txt;
  };

  const handleCopyTexto = async () => {
    try {
      await navigator.clipboard.writeText(gerarTextoRelatorio());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('Erro ao copiar texto.');
    }
  };

  const handleCompartilharWhatsApp = () => {
    const texto = gerarTextoRelatorio();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // Geração de PDF Oficial em Folha A4 com Formatação Militar
  const handleExportPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const dataEmissao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Top Bar Estilo Militar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('POLÍCIA MILITAR DE ALAGOAS', pageWidth / 2, 9, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${config.batalhao.toUpperCase()} — ${config.alojamento.toUpperCase()}`, pageWidth / 2, 16, { align: 'center' });

      doc.setTextColor(251, 191, 36); // amber-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('RELATÓRIO OFICIAL DE QUITAÇÃO DE MENSALIDADES', pageWidth / 2, 23, { align: 'center' });

      // Subheader Box
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.roundedRect(14, 33, pageWidth - 28, 14, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`MÊS DE REFERÊNCIA: ${config.mesReferencia.toUpperCase()} / ${config.anoReferencia}`, 18, 41);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Emissão: ${dataEmissao}`, pageWidth - 18, 41, { align: 'right' });

      // Cards Resumo no PDF
      const boxWidth = (pageWidth - 28 - 8) / 3;
      const boxY = 51;
      const boxHeight = 18;

      // Card 1: Total Militares Pagos
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(110, 231, 183); // emerald-300
      doc.roundedRect(14, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text('MILITARES QUITADOS', 17, boxY + 6);
      doc.setFontSize(12);
      doc.setTextColor(4, 120, 87); // emerald-700
      doc.text(`${militaresPagos.length} POLICIAIS`, 17, boxY + 14);

      // Card 2: Total Arrecadado
      const card2X = 14 + boxWidth + 4;
      doc.setFillColor(240, 253, 244); // green-50
      doc.setDrawColor(134, 239, 172); // green-300
      doc.roundedRect(card2X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52); // green-800
      doc.text('TOTAL ARRECADADO', card2X + 3, boxY + 6);
      doc.setFontSize(12);
      doc.setTextColor(21, 128, 61); // green-700
      doc.text(formatCurrency(totalArrecadado), card2X + 3, boxY + 14);

      // Card 3: Meios de Pagamento
      const card3X = card2X + boxWidth + 4;
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.roundedRect(card3X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text('FORMAS DE PAGAMENTO', card3X + 3, boxY + 6);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`PIX: ${statsForma.pix.qtd} | Dinheiro: ${statsForma.dinheiro.qtd} | Transf: ${statsForma.transf.qtd}`, card3X + 3, boxY + 13);

      const currentY = 74;

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`RELAÇÃO NOMINAL DOS MILITARES COM MENSALIDADE PAGA (${militaresPagos.length})`, 14, currentY);

      const tableRows = militaresPagos.map((p, idx) => [
        (idx + 1).toString().padStart(2, '0'),
        p.graduacao,
        p.nome.toUpperCase(),
        p.fone ? formatPhone(p.fone) : '-',
        p.dataPagamento || 'Confirmado',
        p.forma || 'PIX',
        formatCurrency(p.valor),
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        margin: { left: 14, right: 14 },
        head: [['Nº', 'GRAD.', 'NOME COMPLETO DO MILITAR', 'CONTATO', 'DATA PGTO', 'FORMA', 'VALOR (R$)']],
        body: tableRows,
        foot: [[
          'TOTAL',
          '',
          `${militaresPagos.length} militares quitados`,
          '',
          '',
          '',
          formatCurrency(totalArrecadado)
        ]],
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        footStyles: {
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'left',
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 16, fontStyle: 'bold' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 26 },
          4: { cellWidth: 22 },
          5: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [4, 120, 87] },
        },
        styles: {
          fontSize: 7.5,
          cellPadding: 2,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });

      // Assinaturas Oficiais
      let finalY = (doc as any).lastAutoTable.finalY || currentY + 50;

      if (finalY > 245) {
        doc.addPage();
        finalY = 30;
      }

      const sigY = finalY + 18;
      const sigLineWidth = 65;

      // Tesoureiro
      const sig1X = 25;
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.4);
      doc.line(sig1X, sigY, sig1X + sigLineWidth, sigY);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(config.responsavelTesouraria.toUpperCase(), sig1X + sigLineWidth / 2, sigY + 5, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Tesoureiro do Alojamento RP', sig1X + sigLineWidth / 2, sigY + 9, { align: 'center' });

      // Comandante
      const sig2X = pageWidth - 25 - sigLineWidth;
      doc.line(sig2X, sigY, sig2X + sigLineWidth, sigY);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('COMANDANTE DA RÁDIO PATRULHA', sig2X + sigLineWidth / 2, sigY + 5, { align: 'center' });
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('3º BPM / PMAL', sig2X + sigLineWidth / 2, sigY + 9, { align: 'center' });

      const filename = `Relatorio_Militares_Pagos_RP_${config.mesReferencia}_${config.anoReferencia}.pdf`
        .replace(/\s+/g, '_')
        .toLowerCase();

      doc.save(filename);
    } catch (error) {
      console.error('Erro ao gerar PDF de Pagos:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const getFormaBadge = (forma?: string) => {
    switch (forma) {
      case 'PIX':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
            <QrCode className="w-3 h-3 text-emerald-600" />
            PIX
          </span>
        );
      case 'Dinheiro':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
            <Banknote className="w-3 h-3 text-amber-600" />
            Dinheiro
          </span>
        );
      case 'Transferência':
      case 'Cartão':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold">
            <Building2 className="w-3 h-3 text-blue-600" />
            {forma}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold">
            PIX
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-200 rounded-3xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl relative text-slate-900 my-4 sm:my-8 max-h-[95vh] flex flex-col">
        
        {/* Header and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase font-['Chakra_Petch'] flex items-center gap-2">
                <span>Relatório dos Militares Pagos</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 font-sans">
                  {militaresPagos.length} quitados
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Quitações da mensalidade • {config.mesReferencia} / {config.anoReferencia} • {config.batalhao}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 py-3 no-print shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPdf || militaresPagos.length === 0}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleCopyTexto}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handleCompartilharWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
              <span>Enviar no WhatsApp</span>
            </button>
          </div>

          {/* Search within report */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar militar pago..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="overflow-y-auto space-y-4 pr-1 mt-1 flex-grow">
          
          {/* Printable Area Card */}
          <div id="print-area" className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header Documento Militar */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="flex justify-center items-center gap-3 mb-2">
                <RPLogo className="w-12 h-14" />
                <div className="text-left">
                  <h2 className="text-sm sm:text-base font-black tracking-wider uppercase font-['Chakra_Petch'] text-slate-950">
                    POLÍCIA MILITAR DE ALAGOAS
                  </h2>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {config.batalhao} — {config.alojamento}
                  </h3>
                  <p className="text-[11px] font-black text-emerald-700 uppercase">
                    Relatório Oficial de Quitação de Mensalidades
                  </p>
                </div>
              </div>
              <div className="bg-slate-950 text-amber-400 py-1 px-3 text-xs font-black uppercase tracking-widest mt-2 rounded-lg font-['Chakra_Petch'] inline-block">
                Mês de Referência: {config.mesReferencia} / {config.anoReferencia}
              </div>
            </div>

            {/* Summary Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Militares Quitados</p>
                <p className="text-xl font-black text-emerald-700 font-['Chakra_Petch']">
                  {militaresPagos.length} POLICIAIS
                </p>
                <p className="text-[10px] text-emerald-700/80 font-medium mt-0.5">
                  100% com baixa confirmada
                </p>
              </div>

              <div className="p-3.5 bg-green-50 border border-green-300 rounded-xl">
                <p className="text-[10px] font-black text-green-800 uppercase tracking-wider">Total Arrecadado</p>
                <p className="text-xl font-black text-green-700 font-['Chakra_Petch']">
                  {formatCurrency(totalArrecadado)}
                </p>
                <p className="text-[10px] text-green-700/80 font-medium mt-0.5">
                  Fundo operacional do alojamento
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Meios de Pagamento</p>
                <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-800">
                  <span className="text-emerald-700">PIX: {statsForma.pix.qtd}</span>
                  <span>•</span>
                  <span className="text-amber-700">Espécie: {statsForma.dinheiro.qtd}</span>
                  <span>•</span>
                  <span className="text-blue-700">Transf: {statsForma.transf.qtd}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Média: {formatCurrency(militaresPagos.length > 0 ? totalArrecadado / militaresPagos.length : 0)} / militar
                </p>
              </div>
            </div>

            {/* Filter by Payment Method */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 no-print">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-slate-400" /> Forma:
                </span>
                <button
                  onClick={() => setFilterForma('todos')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterForma === 'todos'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas ({militaresPagos.length})
                </button>
                <button
                  onClick={() => setFilterForma('PIX')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterForma === 'PIX'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  PIX ({statsForma.pix.qtd})
                </button>
                <button
                  onClick={() => setFilterForma('Dinheiro')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterForma === 'Dinheiro'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  Dinheiro ({statsForma.dinheiro.qtd})
                </button>
                <button
                  onClick={() => setFilterForma('Transferência')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    filterForma === 'Transferência'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  Transferência ({statsForma.transf.qtd})
                </button>
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Exibindo <strong>{listaFiltrada.length}</strong> de {militaresPagos.length} militares
              </span>
            </div>

            {/* Table of Paid Officers */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-2.5 text-center w-10">Nº</th>
                    <th className="p-2.5">Militar / Graduação</th>
                    <th className="p-2.5">Contato</th>
                    <th className="p-2.5 text-center">Data Pgto</th>
                    <th className="p-2.5 text-center">Forma</th>
                    <th className="p-2.5 text-right">Valor</th>
                    <th className="p-2.5 text-center no-print">Recibo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listaFiltrada.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                        Nenhum militar localizado com os filtros informados.
                      </td>
                    </tr>
                  ) : (
                    listaFiltrada.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 text-center font-mono font-bold text-slate-500">
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="p-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono text-xs">
                              {p.graduacao}
                            </span>
                            <span className="font-bold text-slate-900">
                              {p.nomeGuerra || p.nome}
                            </span>
                            {p.nomeGuerra && p.nome !== p.nomeGuerra && (
                              <span className="text-[10px] text-slate-400 font-normal hidden md:inline">
                                ({p.nome})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2.5 font-mono text-slate-600">
                          {p.fone ? formatPhone(p.fone) : '-'}
                        </td>
                        <td className="p-2.5 text-center font-mono text-slate-700">
                          {p.dataPagamento || 'Confirmado'}
                        </td>
                        <td className="p-2.5 text-center">
                          {getFormaBadge(p.forma)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                          {formatCurrency(p.valor)}
                        </td>
                        <td className="p-2.5 text-center no-print">
                          <button
                            type="button"
                            onClick={() => onGerarRecibo && onGerarRecibo(p)}
                            title={`Visualizar recibo de ${p.nome}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-400/20 hover:bg-amber-400/40 text-slate-900 rounded-lg text-[11px] font-bold border border-amber-300 transition-colors cursor-pointer"
                          >
                            <Receipt className="w-3 h-3 text-amber-700" />
                            <span>Recibo</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {listaFiltrada.length > 0 && (
                  <tfoot className="bg-slate-100 font-bold border-t border-slate-200 text-slate-900">
                    <tr>
                      <td colSpan={5} className="p-2.5 text-right uppercase tracking-wider text-[11px]">
                        Total dos Militares Listados ({listaFiltrada.length}):
                      </td>
                      <td className="p-2.5 text-right font-mono text-emerald-800 text-sm font-black">
                        {formatCurrency(listaFiltrada.reduce((acc, curr) => acc + curr.valor, 0))}
                      </td>
                      <td className="p-2.5 no-print"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Official Signatures Box */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="border-t border-slate-950 w-48 mx-auto pt-1">
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    {config.responsavelTesouraria}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Tesoureiro do Alojamento RP</p>
                </div>
              </div>

              <div>
                <div className="border-t border-slate-950 w-48 mx-auto pt-1">
                  <p className="text-xs font-bold text-slate-900 uppercase">
                    COMANDANTE DA RÁDIO PATRULHA
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">{config.batalhao} / PMAL</p>
                </div>
              </div>
            </div>

            {/* Document Footer Notice */}
            <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              Documento gerado eletronicamente pelo Sistema de Controle do Alojamento Rádio Patrulha (3º BPM) • {new Date().toLocaleDateString('pt-BR')}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
