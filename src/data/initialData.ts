import { Policial, MovimentacaoCaixa, ConfiguracaoApp } from '../types';
import { SAMPLE_COMPROVANTE_CHUVEIRO, SAMPLE_COMPROVANTE_AGUA } from '../utils/comprovanteHelper';

export const DEFAULT_CONFIG: ConfiguracaoApp = {
  pixChave: "3bpm.radiopatrulha@pm.gov.br",
  pixTipo: "Email",
  pixNome: "Tesouraria Alojamento RP - 3° BPM",
  pixBanco: "Banco do Brasil / Nubank",
  valorMensalidadePadrao: 50.00,
  googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbxm1l4WvI9xWJcHgPu9-hX3-CiJz2ZyMlxb3_NntQoDo1qvzKm_Ogi5nS7AdQdMHQO5/exec",
  batalhao: "3° Batalhão de Polícia Militar",
  alojamento: "Alojamento da Rádio Patrulha (RP)",
  responsavelTesouraria: "3° SGT MATEUS / SD RONIERY",
  mesReferencia: "Setembro",
  anoReferencia: 2026,
};

export const INITIAL_POLICIAIS: Policial[] = [
  {
    id: "p-1",
    linha: 2,
    graduacao: "3º SGT",
    nomeGuerra: "MATEUS",
    nome: "3º SGT MATEUS",
    fone: "82991234567",
    status: "Pago",
    valor: 50.00,
    forma: "PIX",
    dataPagamento: "01/09/2026",
    observacoes: "Tesoureiro"
  },
  {
    id: "p-2",
    linha: 3,
    graduacao: "2º SGT",
    nomeGuerra: "OLIVEIRA",
    nome: "2º SGT OLIVEIRA",
    fone: "82998765432",
    status: "Pago",
    valor: 50.00,
    forma: "PIX",
    dataPagamento: "02/09/2026",
  },
  {
    id: "p-3",
    linha: 4,
    graduacao: "CB",
    nomeGuerra: "SILVA",
    nome: "CB SILVA",
    fone: "82993456789",
    status: "Pendente",
    valor: 50.00,
    forma: "PIX"
  },
  {
    id: "p-4",
    linha: 5,
    graduacao: "SD",
    nomeGuerra: "RONIERY",
    nome: "SD RONIERY",
    fone: "82988112233",
    status: "Pago",
    valor: 50.00,
    forma: "PIX",
    dataPagamento: "01/09/2026"
  },
  {
    id: "p-5",
    linha: 6,
    graduacao: "SD",
    nomeGuerra: "ALBUQUERQUE",
    nome: "SD ALBUQUERQUE",
    fone: "82987554433",
    status: "Pendente",
    valor: 50.00,
    forma: "PIX"
  },
  {
    id: "p-6",
    linha: 7,
    graduacao: "CB",
    nomeGuerra: "FERREIRA",
    nome: "CB FERREIRA",
    fone: "82996321458",
    status: "Pago",
    valor: 50.00,
    forma: "PIX",
    dataPagamento: "03/09/2026"
  },
  {
    id: "p-7",
    linha: 8,
    graduacao: "SD",
    nomeGuerra: "CAVALCANTE",
    nome: "SD CAVALCANTE",
    fone: "82991472583",
    status: "Pendente",
    valor: 50.00,
    forma: "PIX"
  },
  {
    id: "p-8",
    linha: 9,
    graduacao: "1º TEN",
    nomeGuerra: "EDUARDO",
    nome: "1º TEN EDUARDO",
    fone: "82999887766",
    status: "Pago",
    valor: 50.00,
    forma: "PIX",
    dataPagamento: "01/09/2026",
    observacoes: "Comandante do Pelotão"
  },
  {
    id: "p-9",
    linha: 10,
    graduacao: "CB",
    nomeGuerra: "LIMA",
    nome: "CB LIMA",
    fone: "82993216549",
    status: "Pendente",
    valor: 50.00,
    forma: "PIX"
  },
  {
    id: "p-10",
    linha: 11,
    graduacao: "SD",
    nomeGuerra: "NASCIMENTO",
    nome: "SD NASCIMENTO",
    fone: "82988774411",
    status: "Pago",
    valor: 50.00,
    forma: "Dinheiro",
    dataPagamento: "02/09/2026"
  },
  {
    id: "p-11",
    linha: 12,
    graduacao: "3º SGT",
    nomeGuerra: "BARBOSA",
    nome: "3º SGT BARBOSA",
    fone: "82991122334",
    status: "Isento",
    valor: 0.00,
    forma: "PIX",
    observacoes: "Em missão especial / afastado"
  },
  {
    id: "p-12",
    linha: 13,
    graduacao: "SD",
    nomeGuerra: "GOMES",
    nome: "SD GOMES",
    fone: "82996543210",
    status: "Pendente",
    valor: 50.00,
    forma: "PIX"
  }
];

export const INITIAL_CAIXA: MovimentacaoCaixa[] = [
  {
    id: "cx-1",
    linha: 2,
    data: "01/09/2026",
    tipo: "Entrada",
    desc: "Mensalidades",
    categoria: "Doação / Crédito",
    resp: "SALDO DO MÊS DE AGOSTO",
    valor: 40.00
  },
  {
    id: "cx-2",
    linha: 3,
    data: "02/09/2026",
    tipo: "Saída",
    desc: "Chuveiro Elétrico",
    categoria: "Material de Limpeza",
    resp: "SD RONIERY",
    valor: 237.00,
    comprovanteUrl: SAMPLE_COMPROVANTE_CHUVEIRO,
    comprovanteNome: "comprovante_chuveiro_eletrico_nf.svg",
    comprovanteTipo: "imagem",
    observacoes: "Instalação no alojamento RP"
  },
  {
    id: "cx-3",
    linha: 4,
    data: "02/09/2026",
    tipo: "Saída",
    desc: "19 garrafões de água/ referentes ao mês de agosto",
    categoria: "Material de Limpeza",
    resp: "SGT MATEUS",
    valor: 171.00,
    comprovanteUrl: SAMPLE_COMPROVANTE_AGUA,
    comprovanteNome: "recibo_19_garrafoes_agua.svg",
    comprovanteTipo: "imagem",
    observacoes: "Consumo do mês de agosto"
  }
];
