import React, { useState } from 'react';
import { X, Printer, Shield, CheckCircle2, AlertCircle, FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RPLogo } from './RPLogo';
import { CategoriaBadge } from './CategoriaBadge';
import { Policial, MovimentacaoCaixa, ConfiguracaoApp } from '../types';

interface ModalRelatorioBalanceteProps {
  policiais: Policial[];
  caixa: MovimentacaoCaixa[];
  config: ConfiguracaoApp;
  onClose: () => void;
}

export const ModalRelatorioBalancete: React.FC<ModalRelatorioBalanceteProps> = ({
  policiais,
  caixa,
  config,
  onClose
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pagos = policiais.filter(p => p.status === 'Pago');
  const pendentes = policiais.filter(p => p.status === 'Pendente');
  const isentos = policiais.filter(p => p.status === 'Isento');

  const totalArrecadadoMensalidades = pagos.reduce((acc, curr) => acc + curr.valor, 0);
  const entradasCaixa = caixa.filter(c => c.tipo === 'Entrada').reduce((acc, curr) => acc + curr.valor, 0);
  const saidasCaixa = caixa.filter(c => c.tipo === 'Saída').reduce((acc, curr) => acc + curr.valor, 0);

  const totalReceitas = totalArrecadadoMensalidades + entradasCaixa;
  const saldoFinal = totalReceitas - saidasCaixa;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const formatCurrency = (val: number) =>
        val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      const dataEmissao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      // Military Header Top Bar
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
      doc.text('BALANCETE FINANCEIRO & PRESTAÇÃO DE CONTAS', pageWidth / 2, 23, { align: 'center' });

      // Subheader Info Box
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

      // Summary Cards (3 Boxes)
      const boxWidth = (pageWidth - 28 - 8) / 3;
      const boxY = 51;
      const boxHeight = 18;

      // Card 1: Receitas
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(110, 231, 183); // emerald-300
      doc.roundedRect(14, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(6, 95, 70); // emerald-800
      doc.text('TOTAL DE ENTRADAS', 17, boxY + 6);
      doc.setFontSize(11);
      doc.setTextColor(4, 120, 87); // emerald-700
      doc.text(formatCurrency(totalReceitas), 17, boxY + 14);

      // Card 2: Despesas
      const card2X = 14 + boxWidth + 4;
      doc.setFillColor(255, 241, 242); // rose-50
      doc.setDrawColor(253, 164, 175); // rose-300
      doc.roundedRect(card2X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(159, 18, 57); // rose-800
      doc.text('TOTAL DE SAÍDAS (GASTOS)', card2X + 3, boxY + 6);
      doc.setFontSize(11);
      doc.setTextColor(190, 18, 60); // rose-700
      doc.text(formatCurrency(saidasCaixa), card2X + 3, boxY + 14);

      // Card 3: Saldo
      const card3X = card2X + boxWidth + 4;
      doc.setFillColor(241, 245, 249); // slate-100
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.roundedRect(card3X, boxY, boxWidth, boxHeight, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text('SALDO DISPONÍVEL EM CAIXA', card3X + 3, boxY + 6);
      doc.setFontSize(11);
      doc.setTextColor(saldoFinal >= 0 ? 15 : 190, saldoFinal >= 0 ? 23 : 18, saldoFinal >= 0 ? 42 : 60);
      doc.text(formatCurrency(saldoFinal), card3X + 3, boxY + 14);

      let currentY = 74;

      // Section 1: Discriminativo de Despesas
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DISCRIMINATIVO DE GASTOS E MATERIAIS ADQUIRIDOS', 14, currentY);

      const despesas = caixa.filter(c => c.tipo === 'Saída');
      const despesasTableRows = despesas.length > 0 
        ? despesas.map(d => [
            d.data,
            d.desc,
            d.categoria || 'Outros',
            d.resp.toUpperCase(),
            formatCurrency(d.valor),
          ])
        : [['-', 'Nenhum gasto registrado neste período.', '-', '-', 'R$ 0,00']];

      autoTable(doc, {
        startY: currentY + 3,
        margin: { left: 14, right: 14 },
        head: [['DATA', 'MATERIAL / FINALIDADE', 'CATEGORIA', 'RESPONSÁVEL', 'VALOR (R$)']],
        body: despesasTableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'left',
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 38 },
          3: { cellWidth: 32 },
          4: { cellWidth: 28, halign: 'right', fontStyle: 'bold', textColor: [190, 18, 60] },
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

      // Section 2: Efetivo Policial Militar
      const finalYDespesas = (doc as any).lastAutoTable.finalY || currentY + 30;
      currentY = finalYDespesas + 8;

      // Check if we need a new page for Efetivo Table
      if (currentY > 210) {
        doc.addPage();
        currentY = 20;
      }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`2. CONTROLE DO EFETIVO E MENSALIDADES (${policiais.length} MILITARES)`, 14, currentY);

      const efetivoTableRows = policiais.map(p => [
        p.graduacao,
        p.nome.toUpperCase(),
        p.contato || '-',
        p.status.toUpperCase(),
        p.status === 'Pago' ? (p.dataPagamento || 'Sim') : '-',
        formatCurrency(p.valor),
      ]);

      autoTable(doc, {
        startY: currentY + 3,
        margin: { left: 14, right: 14 },
        head: [['GRAD.', 'NOME DE GUERRA', 'CONTATO', 'STATUS', 'PAGO EM', 'VALOR']],
        body: efetivoTableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 30 },
          3: { cellWidth: 24, fontStyle: 'bold' },
          4: { cellWidth: 24 },
          5: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
        },
        styles: {
          fontSize: 7,
          cellPadding: 1.8,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            const val = data.cell.raw;
            if (val === 'PAGO') {
              data.cell.styles.textColor = [4, 120, 87]; // emerald-700
            } else if (val === 'PENDENTE') {
              data.cell.styles.textColor = [190, 18, 60]; // rose-700
            } else {
              data.cell.styles.textColor = [100, 116, 139]; // slate-500
            }
          }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
      });

      // Section 3: Assinaturas Oficiais
      let finalYEfetivo = (doc as any).lastAutoTable.finalY || currentY + 40;
      
      // If not enough room for signatures (need ~40mm), add page
      if (finalYEfetivo > 245) {
        doc.addPage();
        finalYEfetivo = 30;
      }

      const sigY = finalYEfetivo + 18;
      const sigLineWidth = 65;

      // Tesoureiro Signature
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

      // Comandante Signature
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

      // Save PDF File
      const filename = `Balancete_RP_3BPM_${config.mesReferencia}_${config.anoReferencia}.pdf`
        .replace(/\s+/g, '_')
        .toLowerCase();
      doc.save(filename);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-100 border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-900 my-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors cursor-pointer no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Section */}
        <div id="print-area" className="space-y-6 bg-white text-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          {/* Official Military Header */}
          <div className="text-center border-b-2 border-slate-950 pb-4">
            <div className="flex justify-center items-center gap-3 mb-2">
              <RPLogo className="w-14 h-16" />
              <div className="text-left">
                <h2 className="text-base font-black tracking-wider uppercase font-['Chakra_Petch'] text-slate-950">
                  POLÍCIA MILITAR DE ALAGOAS
                </h2>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {config.batalhao} — {config.alojamento}
                </h3>
                <p className="text-[11px] font-black text-amber-600 uppercase">
                  Boletim de Prestação de Contas e Balancete Financeiro
                </p>
              </div>
            </div>
            <div className="bg-slate-950 text-amber-400 py-1 px-3 text-xs font-black uppercase tracking-widest mt-2 rounded-lg font-['Chakra_Petch']">
              Mês de Referência: {config.mesReferencia} / {config.anoReferencia}
            </div>
          </div>

          {/* 3 Columns: Receitas, Despesas, Saldo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Total de Entradas</p>
              <p className="text-xl font-black text-emerald-700 font-['Chakra_Petch']">
                {totalReceitas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-emerald-700/80 font-medium mt-0.5">
                {pagos.length} mensalidades + {caixa.filter(c => c.tipo === 'Entrada').length} doações
              </p>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl">
              <p className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Total de Saídas / Gastos</p>
              <p className="text-xl font-black text-rose-700 font-['Chakra_Petch']">
                {saidasCaixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-rose-700/80 font-medium mt-0.5">
                {caixa.filter(c => c.tipo === 'Saída').length} despesas registradas
              </p>
            </div>

            <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Saldo em Caixa</p>
              <p className={`text-xl font-black font-['Chakra_Petch'] ${saldoFinal >= 0 ? 'text-slate-950' : 'text-rose-700'}`}>
                {saldoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-[10px] text-slate-600 font-medium mt-0.5">
                Saldo líquido disponível
              </p>
            </div>
          </div>

          {/* Discriminativo de Despesas */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2 font-['Chakra_Petch']">
              1. Discriminativo de Gastos e Materiais Adquiridos
            </h4>
            <table className="w-full text-left text-xs border border-slate-200 divide-y divide-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white font-black text-[10px] uppercase font-['Chakra_Petch']">
                <tr>
                  <th className="p-2.5">Data</th>
                  <th className="p-2.5">Material / Finalidade</th>
                  <th className="p-2.5">Categoria</th>
                  <th className="p-2.5">Responsável</th>
                  <th className="p-2.5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {caixa.filter(c => c.tipo === 'Saída').length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-slate-500 italic">
                      Nenhum gasto registrado neste período.
                    </td>
                  </tr>
                ) : (
                  caixa.filter(c => c.tipo === 'Saída').map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-600">{g.data}</td>
                      <td className="p-2.5 font-bold text-slate-900">{g.desc}</td>
                      <td className="p-2.5">
                        <CategoriaBadge categoria={g.categoria} size="sm" />
                      </td>
                      <td className="p-2.5 uppercase font-medium text-slate-700">{g.resp}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-rose-700">
                        - {g.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Relação Nominal do Efetivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pagos */}
            <div className="border border-emerald-300 rounded-xl p-3 bg-emerald-50/50">
              <h5 className="text-[11px] font-black uppercase text-emerald-800 flex items-center gap-1.5 mb-2 font-['Chakra_Petch']">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Militares Quitado(s) ({pagos.length})
              </h5>
              <div className="space-y-1 max-h-48 overflow-y-auto text-xs pr-1">
                {pagos.map((p) => (
                  <div key={p.id} className="flex justify-between items-center py-1 border-b border-emerald-100 text-[11px]">
                    <span className="font-bold uppercase text-slate-900">{p.nome}</span>
                    <span className="font-mono text-emerald-800 font-black">{p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pendentes & Isentos */}
            <div className="border border-rose-300 rounded-xl p-3 bg-rose-50/50">
              <h5 className="text-[11px] font-black uppercase text-rose-800 flex items-center gap-1.5 mb-2 font-['Chakra_Petch']">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Militares Pendente(s) ({pendentes.length})
              </h5>
              <div className="space-y-1 max-h-48 overflow-y-auto text-xs pr-1">
                {pendentes.length === 0 ? (
                  <p className="text-[11px] text-emerald-700 font-semibold italic">Nenhuma pendência.</p>
                ) : (
                  pendentes.map((p) => (
                    <div key={p.id} className="flex justify-between items-center py-1 border-b border-rose-100 text-[11px]">
                      <span className="font-bold uppercase text-rose-900">{p.nome}</span>
                      <span className="font-mono text-rose-700 font-black">{p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Assinaturas formais */}
          <div className="pt-8 border-t-2 border-slate-950 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="w-48 mx-auto border-b border-slate-950 mb-1"></div>
              <p className="text-xs font-bold uppercase text-slate-950">{config.responsavelTesouraria}</p>
              <p className="text-[10px] text-slate-600 uppercase font-semibold">Tesoureiro do Alojamento</p>
            </div>

            <div>
              <div className="w-48 mx-auto border-b border-slate-950 mb-1"></div>
              <p className="text-xs font-bold uppercase text-slate-950">Comandante da Rádio Patrulha</p>
              <p className="text-[10px] text-slate-600 uppercase font-semibold">3º BPM / PMAL</p>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="sm:w-32 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
          
          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isGeneratingPdf}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Gerando PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                <span>Exportar PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Imprimir Balancete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

