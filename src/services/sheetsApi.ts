/**
 * Serviço de Integração Direta com a Planilha Google Sheets via Google Apps Script Web App
 */

export const GOOGLE_SHEETS_SCRIPT_URL = 
  "https://script.google.com/macros/s/AKfycbxm1l4WvI9xWJcHgPu9-hX3-CiJz2ZyMlxb3_NntQoDo1qvzKm_Ogi5nS7AdQdMHQO5/exec";

/**
 * Converte o nome do mês e ano em formato "MM/AAAA" (ex: "09/2026")
 */
export function formatarMesAnoReferencia(mesRef?: string, anoRef?: number): string {
  const mapaMeses: Record<string, string> = {
    'janeiro': '01',
    'fevereiro': '02',
    'março': '03',
    'marco': '03',
    'abril': '04',
    'maio': '05',
    'junho': '06',
    'julho': '07',
    'agosto': '08',
    'setembro': '09',
    'outubro': '10',
    'novembro': '11',
    'dezembro': '12'
  };

  const ano = anoRef || new Date().getFullYear();
  if (mesRef) {
    const limpo = mesRef.toLowerCase().trim();
    if (mapaMeses[limpo]) {
      return `${mapaMeses[limpo]}/${ano}`;
    }
    if (/^\d{1,2}$/.test(limpo)) {
      return `${limpo.padStart(2, '0')}/${ano}`;
    }
  }

  const m = String(new Date().getMonth() + 1).padStart(2, '0');
  return `${m}/${ano}`;
}

/**
 * Formata um valor numérico para o padrão de moeda da planilha: "R$ 50,00"
 */
export function formatarValorMoedaSheets(valor: number | string): string {
  if (typeof valor === 'number') {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
  const limpo = valor.toString().trim();
  if (limpo.startsWith('R$')) return limpo;
  const num = parseFloat(limpo.replace(/\./g, '').replace(',', '.')) || 0;
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}

export interface PayloadSheets {
  aba: string;
  valores: (string | number)[];
}

/**
 * Envia dados formatados para a planilha Google Sheets via HTTP POST
 * 
 * Formato padrão:
 * {
 *   "aba": "Mensalidades",
 *   "valores": ["09/2026", "NOME_DO_POLICIAL", "R$ 50,00", "PIX", "Pago"]
 * }
 */
export async function enviarParaGoogleSheets(
  aba: string,
  valores: (string | number)[],
  endpointUrl?: string
): Promise<{ success: boolean; error?: string }> {
  const url = (endpointUrl && endpointUrl.trim()) || GOOGLE_SHEETS_SCRIPT_URL;

  const payload: PayloadSheets = {
    aba,
    valores
  };

  const bodyText = JSON.stringify(payload);

  try {
    // 1ª tentativa: Envio padrão com Content-Type text/plain para evitar bloqueios de CORS preflight (OPTIONS)
    await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: bodyText
    });

    console.info(`[Google Sheets] Dados enviados com sucesso para a aba "${aba}":`, valores);
    return { success: true };
  } catch (primaryErr: any) {
    console.warn('[Google Sheets] Tentando fallback com no-cors...', primaryErr);

    try {
      // 2ª tentativa: modo no-cors garante que o navegador despache a requisição HTTP POST para o Apps Script
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: bodyText
      });

      console.info(`[Google Sheets (no-cors)] Requisição despachada para "${aba}":`, valores);
      return { success: true };
    } catch (fallbackErr: any) {
      console.error('[Google Sheets] Erro final ao despachar requisição para o Google Apps Script:', fallbackErr);
      return { success: false, error: fallbackErr?.message || 'Falha na conexão com Google Sheets' };
    }
  }
}

/**
 * Registra ou atualiza um pagamento de mensalidade na planilha
 */
export async function salvarMensalidadeGoogleSheets(params: {
  mesAno?: string;
  nomePolicial: string;
  valor: number | string;
  forma?: string;
  status?: string;
  url?: string;
}): Promise<{ success: boolean; error?: string }> {
  const mesAno = params.mesAno || "09/2026";
  const valorFormatado = formatarValorMoedaSheets(params.valor);
  const forma = params.forma || "PIX";
  const status = params.status || "Pago";

  const valores = [
    mesAno,
    params.nomePolicial,
    valorFormatado,
    forma,
    status
  ];

  return enviarParaGoogleSheets("Mensalidades", valores, params.url);
}

/**
 * Registra movimentação de despesa ou entrada do caixa na planilha
 */
export async function salvarCaixaGoogleSheets(params: {
  data: string;
  tipo: string;
  desc: string;
  categoria: string;
  resp: string;
  valor: number | string;
  url?: string;
}): Promise<{ success: boolean; error?: string }> {
  const valorFormatado = formatarValorMoedaSheets(params.valor);

  const valores = [
    params.data,
    params.tipo,
    params.desc,
    params.categoria,
    params.resp,
    valorFormatado
  ];

  return enviarParaGoogleSheets("Caixa", valores, params.url);
}
