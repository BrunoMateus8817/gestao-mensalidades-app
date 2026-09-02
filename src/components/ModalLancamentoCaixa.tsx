import React, { useState } from 'react';
import { X, PlusCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { MovimentacaoCaixa, TipoMovimentacao } from '../types';

interface ModalLancamentoCaixaProps {
  onSalvar: (mov: Omit<MovimentacaoCaixa, 'id'>) => void;
  onClose: () => void;
}

const CATEGORIAS = [
  'Material de Limpeza',
  'Manutenção & Reparos',
  'Combustível',
  'Alimentação & Café',
  'Conforto & Eletro',
  'Doação / Crédito',
  'Outros'
] as const;

export const ModalLancamentoCaixa: React.FC<ModalLancamentoCaixaProps> = ({
  onSalvar,
  onClose
}) => {
  const [tipo, setTipo] = useState<TipoMovimentacao>('Saída');
  const [categoria, setCategoria] = useState<typeof CATEGORIAS[number]>('Material de Limpeza');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [resp, setResp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValor = parseFloat(valor.replace(',', '.'));
    if (isNaN(numValor) || numValor <= 0) {
      alert('Por favor, informe um valor válido.');
      return;
    }

    if (!desc.trim()) {
      alert('Por favor, informe a descrição ou material.');
      return;
    }

    onSalvar({
      data: new Date().toLocaleDateString('pt-BR'),
      tipo,
      categoria,
      desc: desc.trim(),
      resp: resp.trim() || 'Tesouraria RP',
      valor: numValor
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
              Lançar Movimentação de Caixa
            </h3>
            <p className="text-xs text-slate-500">
              Controle de receitas e despesas do alojamento RP.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Tipo de Movimentação (Toggle) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTipo('Saída');
                  if (categoria === 'Doação / Crédito') setCategoria('Material de Limpeza');
                }}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'Saída'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>Saída / Compra</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('Entrada');
                  setCategoria('Doação / Crédito');
                }}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  tipo === 'Entrada'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Entrada / Doação</span>
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat} className="bg-white text-slate-900">{cat}</option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Descrição / Material / Finalidade *
            </label>
            <input
              type="text"
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ex: Compra de 4 galões de água 20L + Pó de Café"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* Valor */}
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
              placeholder="Ex: 65.00"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-bold font-['Chakra_Petch'] focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* Responsável / Doador */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Responsável pela compra ou Doador
            </label>
            <input
              type="text"
              value={resp}
              onChange={(e) => setResp(e.target.value)}
              placeholder="Ex: SD RONIERY ou 3º SGT MATEUS"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer border border-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              Salvar Registro
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
