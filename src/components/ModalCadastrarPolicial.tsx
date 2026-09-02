import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield } from 'lucide-react';
import { Policial, GraduacaoMilitar, StatusPagamento } from '../types';

interface ModalCadastrarPolicialProps {
  policialEditar?: Policial | null;
  valorPadrao: number;
  onSalvar: (policial: Omit<Policial, 'id'>, idEditar?: string) => void;
  onClose: () => void;
}

const GRADUACOES: GraduacaoMilitar[] = [
  'CAP',
  '1º TEN',
  '2º TEN',
  'SUB TEN',
  '1º SGT',
  '2º SGT',
  '3º SGT',
  'CB',
  'SD'
];

export const ModalCadastrarPolicial: React.FC<ModalCadastrarPolicialProps> = ({
  policialEditar,
  valorPadrao,
  onSalvar,
  onClose
}) => {
  const [graduacao, setGraduacao] = useState<GraduacaoMilitar>('SD');
  const [nomeGuerra, setNomeGuerra] = useState('');
  const [fone, setFone] = useState('');
  const [valor, setValor] = useState(valorPadrao.toString());
  const [status, setStatus] = useState<StatusPagamento>('Pendente');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (policialEditar) {
      setGraduacao(policialEditar.graduacao);
      setNomeGuerra(policialEditar.nomeGuerra || policialEditar.nome.replace(policialEditar.graduacao, '').trim());
      setFone(policialEditar.fone);
      setValor(policialEditar.valor.toString());
      setStatus(policialEditar.status);
      setObservacoes(policialEditar.observacoes || '');
    } else {
      setGraduacao('SD');
      setNomeGuerra('');
      setFone('');
      setValor(valorPadrao.toString());
      setStatus('Pendente');
      setObservacoes('');
    }
  }, [policialEditar, valorPadrao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeGuerra.trim()) {
      alert('Informe o nome de guerra do militar.');
      return;
    }

    const nomeFormatado = `${graduacao} ${nomeGuerra.trim().toUpperCase()}`;
    const numValor = parseFloat(valor.replace(',', '.')) || valorPadrao;

    onSalvar(
      {
        nome: nomeFormatado,
        graduacao,
        nomeGuerra: nomeGuerra.trim().toUpperCase(),
        fone: fone.replace(/\D/g, ''),
        status,
        valor: numValor,
        observacoes: observacoes.trim() || undefined
      },
      policialEditar?.id
    );

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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
              {policialEditar ? 'Editar Militar' : 'Cadastrar Policial Militar'}
            </h3>
            <p className="text-xs text-slate-500">
              Efetivo vinculado ao Alojamento Rádio Patrulha - 3º BPM.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Posto / Graduação */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Posto / Graduação *
            </label>
            <select
              value={graduacao}
              onChange={(e) => setGraduacao(e.target.value as GraduacaoMilitar)}
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
            >
              {GRADUACOES.map((g) => (
                <option key={g} value={g} className="bg-white text-slate-900">{g}</option>
              ))}
            </select>
          </div>

          {/* Nome de Guerra */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nome de Guerra *
            </label>
            <input
              type="text"
              required
              value={nomeGuerra}
              onChange={(e) => setNomeGuerra(e.target.value)}
              placeholder="Ex: MATEUS, SILVA, RONIERY"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 uppercase font-bold tracking-wider focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* WhatsApp / Telefone */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              WhatsApp / Celular com DDD
            </label>
            <input
              type="text"
              value={fone}
              onChange={(e) => setFone(e.target.value)}
              placeholder="Ex: 82991234567"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder-slate-400 shadow-xs"
            />
          </div>

          {/* Valor da Mensalidade & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Valor Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 font-bold font-['Chakra_Petch'] focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Situação Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusPagamento)}
                className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
              >
                <option value="Pendente" className="bg-white">Pendente</option>
                <option value="Pago" className="bg-white">Pago</option>
                <option value="Isento" className="bg-white">Isento</option>
              </select>
            </div>
          </div>

          {/* Observações / Função */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Observações / Função (opcional)
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Tesoureiro, Comandante, Afastado"
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
              {policialEditar ? 'Atualizar Militar' : 'Salvar Militar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
