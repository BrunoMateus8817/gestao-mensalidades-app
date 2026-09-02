import React, { useState, useRef } from 'react';
import { 
  X, 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  UploadCloud, 
  Camera, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { MovimentacaoCaixa, TipoMovimentacao } from '../types';
import { processarArquivoComprovante } from '../utils/comprovanteHelper';

interface ModalLancamentoCaixaProps {
  onSalvar: (mov: Omit<MovimentacaoCaixa, 'id'>) => void;
  onClose: () => void;
  movimentacaoParaEditar?: MovimentacaoCaixa | null;
}

const CATEGORIAS_SUGESTO = [
  'Material de Limpeza',
  'Agua Mineral',
  'Doação / Crédito',
  'Internet',
  'Manutenção e Reparos',
  'Alimentos',
  'Combustível',
  'Outros'
];

export const ModalLancamentoCaixa: React.FC<ModalLancamentoCaixaProps> = ({
  onSalvar,
  onClose,
  movimentacaoParaEditar
}) => {
  const [data, setData] = useState(movimentacaoParaEditar?.data || new Date().toLocaleDateString('pt-BR'));
  const [tipo, setTipo] = useState<TipoMovimentacao>(movimentacaoParaEditar?.tipo || 'Saída');
  const [categoria, setCategoria] = useState(movimentacaoParaEditar?.categoria || 'Chuveiro Elétrico');
  const [desc, setDesc] = useState(movimentacaoParaEditar?.desc || '');
  const [valor, setValor] = useState(movimentacaoParaEditar ? movimentacaoParaEditar.valor.toString() : '');
  const [resp, setResp] = useState(movimentacaoParaEditar?.resp || '');
  const [observacoes, setObservacoes] = useState(movimentacaoParaEditar?.observacoes || '');

  // Comprovante state
  const [comprovanteUrl, setComprovanteUrl] = useState<string | undefined>(movimentacaoParaEditar?.comprovanteUrl);
  const [comprovanteNome, setComprovanteNome] = useState<string | undefined>(movimentacaoParaEditar?.comprovanteNome);
  const [comprovanteTipo, setComprovanteTipo] = useState<'imagem' | 'pdf' | 'arquivo' | undefined>(movimentacaoParaEditar?.comprovanteTipo);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      setIsProcessingFile(true);
      const res = await processarArquivoComprovante(file);
      setComprovanteUrl(res.dataUrl);
      setComprovanteNome(res.nome);
      setComprovanteTipo(res.tipo);
    } catch (err) {
      console.error('Erro ao processar comprovante:', err);
      alert('Não foi possível carregar o arquivo. Tente outra imagem.');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveComprovante = () => {
    setComprovanteUrl(undefined);
    setComprovanteNome(undefined);
    setComprovanteTipo(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValor = parseFloat(valor.replace(',', '.'));
    if (isNaN(numValor) || numValor <= 0) {
      alert('Por favor, informe um valor numérico válido.');
      return;
    }

    if (!desc.trim()) {
      alert('Por favor, informe a descrição / item.');
      return;
    }

    onSalvar({
      data: data.trim() || new Date().toLocaleDateString('pt-BR'),
      tipo,
      categoria: categoria.trim() || (tipo === 'Entrada' ? 'Mensalidades' : 'Outros'),
      desc: desc.trim(),
      resp: resp.trim() || 'SD CLAUDONIO',
      valor: numValor,
      comprovanteUrl,
      comprovanteNome,
      comprovanteTipo,
      observacoes: observacoes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl relative text-slate-900 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
              {movimentacaoParaEditar ? 'Editar Movimentação / Comprovante' : 'Lançar no Fluxo de Caixa'}
            </h3>
            <p className="text-xs text-slate-500">
              Padrão do Alojamento — Envie a nota fiscal ou comprovante da despesa.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tipo de Movimentação (Toggle) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Tipo de Movimentação *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTipo('Saída');
                  if (categoria === 'Mensalidades' || categoria === 'Doação / Crédito') {
                    setCategoria('Chuveiro Elétrico');
                  }
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'Saída'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>Saída / Despesa</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('Entrada');
                  setCategoria('Mensalidades');
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'Entrada'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Entrada / Mensalidade</span>
              </button>
            </div>
          </div>

          {/* Grid: Data e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Data *
              </label>
              <input
                type="text"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Categoria *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs font-semibold cursor-pointer"
              >
                {CATEGORIAS_SUGESTO.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick pills for categories */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {CATEGORIAS_SUGESTO.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoria(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                  categoria === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Descrição / Item */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Descrição / Item *
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ex: SD Roniery ou SALDO DO MÊS DE AGOSTO"
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* Grid: Valor e Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 237.00"
                className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-bold font-['Chakra_Petch'] focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Responsável *
              </label>
              <input
                type="text"
                required
                value={resp}
                onChange={(e) => setResp(e.target.value)}
                placeholder="Ex: SD CLAUDONIO, SD Roniery..."
                className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
              />
            </div>
          </div>

          {/* COMPROVANTE DA DESPESA (UPLOAD / FOTO) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>Comprovante / Nota Fiscal / Cupom</span>
              </label>
              <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                {tipo === 'Saída' ? 'Recomendado para Saídas' : 'Opcional'}
              </span>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {comprovanteUrl ? (
              /* Preview of attached comprovante */
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {comprovanteTipo === 'imagem' || comprovanteUrl.startsWith('data:image') ? (
                    <img
                      src={comprovanteUrl}
                      alt="Miniatura Comprovante"
                      className="w-12 h-12 object-cover rounded-xl border border-slate-300 shadow-2xs flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {comprovanteNome || 'Comprovante anexado'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Arquivo pronto
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer transition-colors"
                  >
                    Trocar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveComprovante}
                    title="Remover comprovante"
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Drag & Drop Area */
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                  dragActive 
                    ? 'border-amber-500 bg-amber-50/50' 
                    : 'border-slate-300 hover:border-amber-400 bg-slate-50/50'
                }`}
              >
                {isProcessingFile ? (
                  <div className="flex flex-col items-center py-2 text-slate-600">
                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin mb-1" />
                    <span className="text-xs font-semibold">Otimizando comprovante...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-amber-500 mb-1.5" />
                    <p className="text-xs font-bold text-slate-700 mb-1">
                      Arraste ou envie a foto da nota fiscal / comprovante
                    </p>
                    <p className="text-[10px] text-slate-500 mb-3">
                      Suporta fotos (JPG, PNG) ou documento PDF
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                        <span>Escolher Arquivo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tirar Foto</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Observações Opcionais */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Observações Adicionais (Opcional)
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Instalação no banheiro principal, pago via PIX"
              className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* Submit Actions */}
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
              disabled={isProcessingFile}
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {movimentacaoParaEditar ? 'Salvar Alterações' : 'Salvar no Caixa'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
