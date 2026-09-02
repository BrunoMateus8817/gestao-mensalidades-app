export type StatusPagamento = 'Pago' | 'Pendente' | 'Isento';
export type TipoMovimentacao = 'Entrada' | 'Saída';
export type GraduacaoMilitar = 
  | 'CAP' 
  | '1º TEN' 
  | '2º TEN' 
  | 'SUB TEN' 
  | '1º SGT' 
  | '2º SGT' 
  | '3º SGT' 
  | 'CB' 
  | 'SD';

export interface Policial {
  id: string;
  linha?: number;
  nome: string;
  graduacao: GraduacaoMilitar;
  nomeGuerra: string;
  fone: string;
  status: StatusPagamento;
  valor: number;
  forma?: 'PIX' | 'Dinheiro' | 'Transferência' | 'Cartão';
  dataPagamento?: string;
  observacoes?: string;
}

export type CategoriaMovimentacao = 
  | 'Material de Limpeza'
  | 'Agua Mineral'
  | 'Doação / Crédito'
  | 'Internet'
  | 'Manutenção e Reparos'
  | 'Alimentos'
  | 'Combustível'
  | 'Outros'
  | string;

export interface MovimentacaoCaixa {
  id: string;
  linha?: number;
  data: string;
  tipo: TipoMovimentacao;
  desc: string;
  categoria: CategoriaMovimentacao;
  resp: string;
  valor: number;
  comprovanteUrl?: string;
  comprovanteNome?: string;
  comprovanteTipo?: 'imagem' | 'pdf' | 'arquivo';
  observacoes?: string;
}

export interface ConfiguracaoApp {
  pixChave: string;
  pixTipo: 'CPF' | 'CNPJ' | 'Telefone' | 'Email' | 'Aleatória';
  pixNome: string;
  pixBanco: string;
  valorMensalidadePadrao: number;
  googleAppsScriptUrl: string;
  batalhao: string;
  alojamento: string;
  responsavelTesouraria: string;
  mesReferencia: string;
  anoReferencia: number;
}

export interface ReciboInfo {
  id: string;
  numero: string;
  militarNome: string;
  graduacao: string;
  valor: number;
  data: string;
  forma: string;
  referente: string;
  emitidoPor: string;
}
