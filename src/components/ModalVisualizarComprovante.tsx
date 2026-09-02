import React from 'react';
import { X, Download, Printer, Trash2, FileText, Calendar, Tag, User, DollarSign, ExternalLink } from 'lucide-react';
import { MovimentacaoCaixa } from '../types';

interface ModalVisualizarComprovanteProps {
  movimentacao: MovimentacaoCaixa;
  onClose: () => void;
  onRemoverComprovante?: (id: string) => void;
}

export const ModalVisualizarComprovante: React.FC<ModalVisualizarComprovanteProps> = ({
  movimentacao,
  onClose,
  onRemoverComprovante
}) => {
  const isImage = movimentacao.comprovanteTipo === 'imagem' || 
    movimentacao.comprovanteUrl?.startsWith('data:image') || 
    movimentacao.comprovanteUrl?.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i);

  const isPdf = movimentacao.comprovanteTipo === 'pdf' || 
    movimentacao.comprovanteUrl?.includes('application/pdf') || 
    movimentacao.comprovanteNome?.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    if (!movimentacao.comprovanteUrl) return;
    const link = document.createElement('a');
    link.href = movimentacao.comprovanteUrl;
    link.download = movimentacao.comprovanteNome || `comprovante_${movimentacao.data.replace(/\//g, '-')}_${movimentacao.categoria.toLowerCase().replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Comprovante de Despesa - ${movimentacao.desc}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #1e293b; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 14px; }
            .img-container { text-align: center; margin-top: 20px; }
            img { max-width: 100%; height: auto; max-height: 800px; border: 1px solid #cbd5e1; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0;">COMPROVANTE DE DESPESA — ALOJAMENTO RP 3º BPM</h2>
            <p style="margin:4px 0 0 0; color:#64748b;">Fluxo de Caixa e Prestação de Contas</p>
          </div>
          <div class="info-grid">
            <div><strong>Data:</strong> ${movimentacao.data}</div>
            <div><strong>Tipo:</strong> ${movimentacao.tipo}</div>
            <div><strong>Categoria:</strong> ${movimentacao.categoria}</div>
            <div><strong>Descrição/Item:</strong> ${movimentacao.desc}</div>
            <div><strong>Responsável:</strong> ${movimentacao.resp}</div>
            <div><strong>Valor:</strong> ${movimentacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>
          <div class="img-container">
            ${isImage ? `<img src="${movimentacao.comprovanteUrl}" alt="Comprovante" />` : '<p>Documento Anexo</p>'}
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-tight text-white font-['Chakra_Petch']">
                Comprovante de Despesa / Nota Fiscal
              </h3>
              <p className="text-[11px] text-slate-300">
                {movimentacao.categoria} • {movimentacao.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              title="Imprimir Comprovante"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              title="Baixar Arquivo do Comprovante"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            {onRemoverComprovante && (
              <button
                onClick={() => {
                  if (confirm('Deseja remover este comprovante da despesa?')) {
                    onRemoverComprovante(movimentacao.id);
                    onClose();
                  }
                }}
                title="Remover Comprovante"
                className="p-2 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Fechar"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Data:</span>
            <span className="font-semibold text-slate-800">{movimentacao.data}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Valor:</span>
            <span className="font-black text-rose-600 font-['Chakra_Petch']">
              {movimentacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Responsável:</span>
            <span className="font-semibold text-slate-800 uppercase">{movimentacao.resp}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Arquivo:</span>
            <span className="font-medium text-slate-600 truncate block" title={movimentacao.comprovanteNome || 'comprovante'}>
              {movimentacao.comprovanteNome || 'Comprovante'}
            </span>
          </div>
        </div>

        {/* Main Content (Preview) */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100 flex items-center justify-center min-h-[300px]">
          {movimentacao.comprovanteUrl ? (
            isImage ? (
              <div className="bg-white p-2 rounded-2xl shadow-md border border-slate-300 max-w-full">
                <img
                  src={movimentacao.comprovanteUrl}
                  alt={`Comprovante ${movimentacao.desc}`}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl mx-auto"
                />
              </div>
            ) : isPdf ? (
              <div className="w-full h-[60vh] bg-white rounded-2xl overflow-hidden shadow-md border border-slate-300 flex flex-col items-center justify-center p-6 text-center">
                <FileText className="w-16 h-16 text-rose-500 mb-3" />
                <h4 className="text-sm font-bold text-slate-800 mb-1">{movimentacao.comprovanteNome || 'Documento PDF'}</h4>
                <p className="text-xs text-slate-500 mb-4">Visualização de PDF protegida</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-4 h-4" /> Baixar PDF
                </button>
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">{movimentacao.comprovanteNome || 'Arquivo Anexado'}</p>
                <button
                  onClick={handleDownload}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Baixar Arquivo
                </button>
              </div>
            )
          ) : (
            <div className="text-center text-slate-400 p-8">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Nenhum comprovante anexado a esta movimentação.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Alojamento RP • 3º Batalhão de Polícia Militar
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fechar Visualização
          </button>
        </div>

      </div>
    </div>
  );
};
