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

export interface MovimentacaoCaixa {
  id: string;
  linha?: number;
  data: string;
  tipo: TipoMovimentacao;
  desc: string;
  categoria: 'Material de Limpeza' | 'Manutenção & Reparos' | 'Combustível' | 'Alimentação & Café' | 'Conforto & Eletro' | 'Doação / Crédito' | 'Outros' | string;
  resp: string;
  valor: number;
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
