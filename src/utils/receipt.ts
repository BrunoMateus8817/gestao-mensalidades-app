import jsPDF from 'jspdf';
import { Policial, ConfiguracaoApp } from '../types';

export const gerarNumeroRecibo = (ano: number, seed?: string) => {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const num = Math.abs(hash % 9000) + 1000;
    return `#RP-${ano}-${num}`;
  }
  return `#RP-${ano}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const gerarAutenticacaoDigital = (policialId: string) => {
  let hash = 0;
  const str = policialId + 'RP_ALOJAMENTO_2026';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const code = Math.abs(hash).toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
  return `RP-${code}`;
};

export const formatWhatsAppPhone = (fone?: string, defaultDDD = '82'): string => {
  if (!fone) return '';
  let clean = fone.replace(/\D/g, '');
  if (!clean) return '';

  // Se começar com 0, remove (ex: 082999991234 -> 82999991234)
  if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  // Se já tiver DDI 55 e 12/13 dígitos (ex: 5582999991234)
  if (clean.startsWith('55') && (clean.length === 12 || clean.length === 13)) {
    return clean;
  }

  // Se tiver 8 ou 9 dígitos (número local sem DDD), adiciona o DDD padrão
  if (clean.length === 8 || clean.length === 9) {
    clean = defaultDDD + clean;
  }

  // Se tiver 10 ou 11 dígitos (DDD + número brasileiro), adiciona DDI 55
  if (clean.length === 10 || clean.length === 11) {
    clean = '55' + clean;
  }

  return clean;
};

export const gerarTextoRecibo = (
  policial: Policial,
  config: ConfiguracaoApp,
  numeroRecibo: string
): string => {
  const data = policial.dataPagamento || new Date().toLocaleDateString('pt-BR');
  const valorFormatado = policial.valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const forma = policial.forma || 'PIX';
  const autenticacao = gerarAutenticacaoDigital(policial.id);

  let msg = `📄 *COMPROVANTE DE PAGAMENTO — ALOJAMENTO RP*\n`;
  msg += `🏛️ *${config.batalhao.toUpperCase()}*\n`;
  msg += `🏢 *${config.alojamento.toUpperCase()}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🧾 *Recibo:* ${numeroRecibo}\n`;
  msg += `📅 *Data de Quitação:* ${data}\n`;
  msg += `👤 *Militar:* *${policial.graduacao} ${policial.nome.toUpperCase()}*\n`;
  msg += `📆 *Referência:* Mensalidade do Alojamento (${config.mesReferencia}/${config.anoReferencia})\n`;
  msg += `💰 *Valor Quitado:* *${valorFormatado}*\n`;
  msg += `💳 *Forma de Pagamento:* ${forma}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✅ *Situação:* QUITADO COM SUCESSO\n`;
  msg += `🔐 *Autenticação Digital:* \`${autenticacao}\`\n`;
  msg += `✍️ *Tesouraria:* ${config.responsavelTesouraria}\n\n`;
  msg += `_Comprovante emitido eletronicamente pelo Sistema de Gestão do Alojamento da Rádio Patrulha._`;

  return msg;
};

/**
 * Constrói o PDF vetorial em formato A5 idêntico ao modelo oficial
 */
export const gerarPDFReciboDocumento = (
  policial: Policial,
  config: ConfiguracaoApp,
  numeroRecibo: string
): { doc: jsPDF; filename: string; blob: Blob } => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // 148 x 210 mm
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const data = policial.dataPagamento || new Date().toLocaleDateString('pt-BR');
  const valorFormatado = policial.valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  const autenticacao = gerarAutenticacaoDigital(policial.id);
  const cleanName = (policial.nomeGuerra || policial.nome).replace(/\s+/g, '_');
  const filename = `Recibo_RP_${cleanName}_${config.mesReferencia}_${config.anoReferencia}.pdf`
    .replace(/[^\w.-]/g, '_');

  // Background light canvas
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Dark Header Band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Shield Emblem representation
  doc.setFillColor(2, 6, 23); // slate-950
  doc.roundedRect(pageWidth / 2 - 12, 4, 24, 20, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(0.6);
  doc.roundedRect(pageWidth / 2 - 12, 4, 24, 20, 2, 2, 'D');

  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('R P', pageWidth / 2, 13, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('3° BPM', pageWidth / 2, 18, { align: 'center' });

  // Main Document Header Titles
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('COMPROVANTE DE PAGAMENTO', pageWidth / 2, 38, { align: 'center' });

  doc.setTextColor(217, 119, 6); // amber-600
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${config.alojamento.toUpperCase()} — ${config.batalhao.toUpperCase()}`, pageWidth / 2, 44, { align: 'center' });

  // Meta Box (Recibo + Data)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(12, 50, pageWidth - 24, 12, 2, 2, 'FD');

  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Recibo:`, 16, 57.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${numeroRecibo}`, 28, 57.5);

  doc.setTextColor(71, 85, 105);
  doc.text(`Data:`, pageWidth - 42, 57.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data}`, pageWidth - 16, 57.5, { align: 'right' });

  // Value Card (Green Emerald Box)
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.setLineWidth(0.4);
  doc.roundedRect(12, 66, pageWidth - 24, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text('VALOR RECEBIDO & QUITADO', pageWidth / 2, 73, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text(valorFormatado, pageWidth / 2, 83, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text('(Taxa de Manutenção do Alojamento)', pageWidth / 2, 88.5, { align: 'center' });

  // Body Details Box
  const y = 96;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, y, pageWidth - 24, 52, 2, 2, 'FD');

  const printRow = (label: string, value: string, curY: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label, 16, curY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(value, pageWidth - 16, curY, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(16, curY + 2.5, pageWidth - 16, curY + 2.5);
  };

  printRow('Recebemos de:', `${policial.graduacao} ${policial.nome.toUpperCase()}`, y + 8);
  printRow('Referência:', `Mensalidade Alojamento RP (${config.mesReferencia}/${config.anoReferencia})`, y + 17);
  printRow('Forma de Pagamento:', policial.forma || 'PIX', y + 26);
  printRow('Unidade Beneficiária:', config.batalhao, y + 35);
  printRow('Status do Pagamento:', 'QUITADO COM SUCESSO', y + 44);

  // Signatures Section
  const sigY = y + 68;
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 35, sigY, pageWidth / 2 + 35, sigY);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(config.responsavelTesouraria.toUpperCase(), pageWidth / 2, sigY + 4.5, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tesouraria — Alojamento Rádio Patrulha 3º BPM', pageWidth / 2, sigY + 8.5, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Autenticação Digital: ${autenticacao}`, pageWidth / 2, sigY + 14, { align: 'center' });

  const blob = doc.output('blob');
  return { doc, filename, blob };
};

/**
 * Função principal para disparar o recibo via WhatsApp para contatos salvos OU NÃO salvos na agenda:
 * - Baixa o PDF oficial do comprovante no dispositivo.
 * - Abre diretamente a conversa com o número no WhatsApp (mesmo sem estar salvo na agenda) com o texto do comprovante pronto.
 */
export const dispararReciboWhatsAppComPDF = async (
  policial: Policial,
  config: ConfiguracaoApp,
  numeroRecibo?: string,
  telefoneDestino?: string
): Promise<{ success: boolean; method: 'direct_whatsapp' }> => {
  const numRecibo = numeroRecibo || gerarNumeroRecibo(config.anoReferencia, policial.id);
  const { doc, filename, blob } = gerarPDFReciboDocumento(policial, config, numRecibo);

  const phoneToUse = telefoneDestino || policial.fone;
  const cleanPhone = formatWhatsAppPhone(phoneToUse);
  const textoRecibo = gerarTextoRecibo(policial, config, numRecibo);

  // 1. Salva o arquivo PDF no dispositivo/celular
  doc.save(filename);

  // 2. Abre a conversa no WhatsApp para o número exato (funciona mesmo SEM o contato estar salvo na agenda)
  const waUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(textoRecibo)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(textoRecibo)}`;

  window.open(waUrl, '_blank');

  return { success: true, method: 'direct_whatsapp' };
};

/**
 * Compartilha o arquivo PDF usando o menu nativo de compartilhamento do aparelho (quando suportado)
 */
export const compartilharArquivoPDFNativo = async (
  policial: Policial,
  config: ConfiguracaoApp,
  numeroRecibo?: string
): Promise<boolean> => {
  const numRecibo = numeroRecibo || gerarNumeroRecibo(config.anoReferencia, policial.id);
  const { filename, blob } = gerarPDFReciboDocumento(policial, config, numRecibo);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function') {
    try {
      const file = new File([blob], filename, { type: 'application/pdf' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Recibo - ${policial.graduacao} ${policial.nome}`,
          text: `Comprovante oficial de quitação do Alojamento RP (${config.mesReferencia}/${config.anoReferencia}).`,
          files: [file],
        });
        return true;
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Erro ao compartilhar arquivo PDF:', err);
      }
    }
  }
  return false;
};

export const exportarPDFRecibo = (
  policial: Policial,
  config: ConfiguracaoApp,
  numeroRecibo?: string
) => {
  const numRecibo = numeroRecibo || gerarNumeroRecibo(config.anoReferencia, policial.id);
  const { doc, filename } = gerarPDFReciboDocumento(policial, config, numRecibo);
  doc.save(filename);
};
