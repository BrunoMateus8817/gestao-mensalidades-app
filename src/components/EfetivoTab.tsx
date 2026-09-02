import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Search, 
  ShieldCheck, 
  Phone,
  PhoneCall
} from 'lucide-react';
import { Policial, GraduacaoMilitar } from '../types';

interface EfetivoTabProps {
  policiais: Policial[];
  onOpenNovoPolicial: () => void;
  onEditarPolicial: (policial: Policial) => void;
  onRemoverPolicial: (id: string) => void;
}

export const EfetivoTab: React.FC<EfetivoTabProps> = ({
  policiais,
  onOpenNovoPolicial,
  onEditarPolicial,
  onRemoverPolicial
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradFilter, setGradFilter] = useState<string>('todos');

  const filteredPoliciais = policiais.filter((p) => {
    const matchesGrad = gradFilter === 'todos' || p.graduacao === gradFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.nome.toLowerCase().includes(searchLower) ||
      p.nomeGuerra.toLowerCase().includes(searchLower) ||
      p.fone.includes(searchLower);

    return matchesGrad && matchesSearch;
  });

  const formatPhone = (fone: string) => {
    if (!fone) return '-';
    const clean = fone.replace(/\D/g, '');
    if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    return fone;
  };

  const abrirConversaWhatsApp = (p: Policial) => {
    let clean = p.fone.replace(/\D/g, '');
    if (!clean) {
      alert('Telefone não informado.');
      return;
    }
    if (clean.length <= 11) clean = '55' + clean;
    window.open(`https://wa.me/${clean}`, '_blank');
  };

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-5 sm:p-7">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight font-['Chakra_Petch']">
                Efetivo de Policiais Militares Alojados
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cadastro e controle geral do efetivo da Rádio Patrulha - 3º BPM vinculado às despesas do alojamento.
            </p>
          </div>

          <button
            onClick={onOpenNovoPolicial}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span>Cadastrar Militar</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filtro:</span>
            {['todos', '1º TEN', '2º SGT', '3º SGT', 'CB', 'SD'].map((g) => (
              <button
                key={g}
                onClick={() => setGradFilter(g)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  gradFilter === g
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {g === 'todos' ? `Todos (${policiais.length})` : g}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou número..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Bento Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100/90 text-slate-700 uppercase font-bold text-xs border-b border-slate-200 font-['Chakra_Petch']">
              <tr>
                <th className="px-6 py-3.5">Graduação & Nome de Guerra</th>
                <th className="px-6 py-3.5">WhatsApp / Contato</th>
                <th className="px-6 py-3.5">Valor Padrão</th>
                <th className="px-6 py-3.5">Situação</th>
                <th className="px-6 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredPoliciais.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">Nenhum militar encontrado.</p>
                  </td>
                </tr>
              ) : (
                filteredPoliciais.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nome */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-xs font-['Chakra_Petch'] border border-slate-200 shadow-xs">
                          {p.graduacao}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                            {p.nome}
                          </p>
                          {p.observacoes && (
                            <p className="text-[11px] text-slate-500 italic">
                              {p.observacoes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Fone */}
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">
                      <button
                        onClick={() => abrirConversaWhatsApp(p)}
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-emerald-600 font-semibold cursor-pointer transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{formatPhone(p.fone)}</span>
                      </button>
                    </td>

                    {/* Valor Padrão */}
                    <td className="px-6 py-3.5 font-bold text-slate-900 font-['Chakra_Petch']">
                      {p.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Situação */}
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Ativo
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => abrirConversaWhatsApp(p)}
                          title="Conversar no WhatsApp"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditarPolicial(p)}
                          title="Editar Cadastro"
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onRemoverPolicial(p.id)}
                          title="Excluir Militar"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
