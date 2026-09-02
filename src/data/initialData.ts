import { Policial, MovimentacaoCaixa, ConfiguracaoApp } from '../types';

export const DEFAULT_CONFIG: ConfiguracaoApp = {
  pixChave: "3bpm.radiopatrulha@pm.gov.br",
  pixTipo: "Email",
  pixNome: "Tesouraria Alojamento RP - 3° BPM",
  pixBanco: "Banco do Brasil / Nubank",
  valorMensalidadePadrao: 50.00,
  googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycbyFrshcFhvHSYSzY_Z2biqNbH8fguls7odrnl9Zizd4MP4S1sZ3iSJsfhavxkDK8LO2/exec",
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
    desc: "Saldo remanescente do mês anterior (Agosto/2026)",
    categoria: "Doação / Crédito",
    resp: "Tesouraria RP",
    valor: 245.00
  },
  {
    id: "cx-2",
    linha: 3,
    data: "02/09/2026",
    tipo: "Saída",
    desc: "Compra de produtos de limpeza (Desinfetante, Sabão em pó, Água sanitária)",
    categoria: "Material de Limpeza",
    resp: "SD RONIERY",
    valor: 86.50
  },
  {
    id: "cx-3",
    linha: 4,
    data: "02/09/2026",
    tipo: "Saída",
    desc: "Compra de 4 garrafões de água mineral 20L + Café torrado",
    categoria: "Alimentação & Café",
    resp: "CB SILVA",
    valor: 64.00
  },
  {
    id: "cx-4",
    linha: 5,
    data: "03/09/2026",
    tipo: "Saída",
    desc: "Troca de 2 lâmpadas LED tubulares do alojamento e fita isolante",
    categoria: "Manutenção & Reparos",
    resp: "3º SGT MATEUS",
    valor: 48.00
  },
  {
    id: "cx-5",
    linha: 6,
    data: "03/09/2026",
    tipo: "Saída",
    desc: "Abastecimento extraordinário / gasolina gerador e apoio à logística",
    categoria: "Combustível",
    resp: "CB MOURA",
    valor: 75.00
  },
  {
    id: "cx-6",
    linha: 7,
    data: "04/09/2026",
    tipo: "Entrada",
    desc: "Doação avulsa para melhorias no Ar-Condicionado",
    categoria: "Doação / Crédito",
    resp: "1º TEN EDUARDO",
    valor: 100.00
  }
];
