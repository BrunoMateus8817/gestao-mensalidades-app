/**
 * Helper para upload, compressão e gerenciamento de comprovantes de despesas
 */

// Comprovante ilustrativo em SVG otimizado para Chuveiro Elétrico (Nota Fiscal / Cupom)
export const SAMPLE_COMPROVANTE_CHUVEIRO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420" fill="none">
  <rect width="300" height="420" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/>
  <rect x="15" y="15" width="270" height="50" rx="4" fill="%231e293b"/>
  <text x="150" y="38" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f8fafc" text-anchor="middle">CUPOM FISCAL / COMPROVANTE</text>
  <text x="150" y="53" font-family="sans-serif" font-size="10" fill="%2394a3b8" text-anchor="middle">LOJA DE MATERIAIS ELETRICOS LTDA</text>
  
  <line x1="20" y1="80" x2="280" y2="80" stroke="%2394a3b8" stroke-dasharray="4 4"/>
  <text x="25" y="105" font-family="monospace" font-size="11" fill="%23334155">DATA: 02/09/2026 - 10:42</text>
  <text x="25" y="125" font-family="monospace" font-size="11" fill="%23334155">RESPONSAVEL: SD RONIERY</text>
  <text x="25" y="145" font-family="monospace" font-size="11" fill="%23334155">DESTINO: ALOJAMENTO RP 3 BPM</text>

  <rect x="20" y="165" width="260" height="110" rx="4" fill="%23ffffff" stroke="%23e2e8f0"/>
  <text x="30" y="188" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">ITEM / DESCRICAO:</text>
  <text x="30" y="210" font-family="sans-serif" font-size="11" fill="%23334155">1x CHUVEIRO ELETRICO DUCHA 220V</text>
  <text x="30" y="228" font-family="sans-serif" font-size="11" fill="%23334155">1x CANO PROLONGADOR + FITA VEDA</text>
  <text x="30" y="250" font-family="sans-serif" font-size="11" fill="%2364748b">GARANTIA 12 MESES COM NOTA</text>

  <line x1="20" y1="290" x2="280" y2="290" stroke="%2394a3b8" stroke-dasharray="4 4"/>
  <text x="25" y="320" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230f172a">TOTAL PAGO:</text>
  <text x="275" y="320" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23dc2626" text-anchor="end">R$ 237,00</text>
  <text x="25" y="340" font-family="sans-serif" font-size="11" fill="%23059669">FORMA: PIX APROVADO</text>

  <rect x="25" y="365" width="250" height="30" rx="4" fill="%23f1f5f9"/>
  <text x="150" y="385" font-family="monospace" font-size="9" fill="%2364748b" text-anchor="middle">AUTENTICACAO: 9F4A.B72E.118C.55A0</text>
</svg>`;

// Comprovante ilustrativo para Garrafões de Água
export const SAMPLE_COMPROVANTE_AGUA = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420" fill="none">
  <rect width="300" height="420" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/>
  <rect x="15" y="15" width="270" height="50" rx="4" fill="%230284c7"/>
  <text x="150" y="38" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23f8fafc" text-anchor="middle">DISTRIBUIDORA DE AGUA MINERAL</text>
  <text x="150" y="53" font-family="sans-serif" font-size="10" fill="%23e0f2fe" text-anchor="middle">COMPROVANTE DE ENTREGA E PAGAMENTO</text>
  
  <line x1="20" y1="80" x2="280" y2="80" stroke="%2394a3b8" stroke-dasharray="4 4"/>
  <text x="25" y="105" font-family="monospace" font-size="11" fill="%23334155">DATA: 02/09/2026 - 15:10</text>
  <text x="25" y="125" font-family="monospace" font-size="11" fill="%23334155">RESPONSAVEL: SGT MATEUS</text>
  <text x="25" y="145" font-family="monospace" font-size="11" fill="%23334155">LOCAL: 3 BPM - ALOJAMENTO RP</text>

  <rect x="20" y="165" width="260" height="110" rx="4" fill="%23ffffff" stroke="%23e2e8f0"/>
  <text x="30" y="188" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">PRODUTOS:</text>
  <text x="30" y="210" font-family="sans-serif" font-size="11" fill="%23334155">19x GARRAFAO DE AGUA 20L</text>
  <text x="30" y="228" font-family="sans-serif" font-size="11" fill="%2364748b">VALOR UNITARIO: R$ 9,00</text>
  <text x="30" y="250" font-family="sans-serif" font-size="11" fill="%230284c7">ENTREGA REALIZADA NO ALOJAMENTO</text>

  <line x1="20" y1="290" x2="280" y2="290" stroke="%2394a3b8" stroke-dasharray="4 4"/>
  <text x="25" y="320" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230f172a">TOTAL PAGO:</text>
  <text x="275" y="320" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23dc2626" text-anchor="end">R$ 171,00</text>
  <text x="25" y="340" font-family="sans-serif" font-size="11" fill="%23059669">FORMA: PIX IMEDIATO</text>

  <rect x="25" y="365" width="250" height="30" rx="4" fill="%23f1f5f9"/>
  <text x="150" y="385" font-family="monospace" font-size="9" fill="%2364748b" text-anchor="middle">AUTENTICACAO: 3A81.D09F.8821.C14B</text>
</svg>`;

/**
 * Converte e otimiza um arquivo de imagem (ou documento) para Data URL Base64
 * Redimensiona imagens grandes para caber confortavelmente no LocalStorage
 */
export async function processarArquivoComprovante(file: File): Promise<{
  dataUrl: string;
  nome: string;
  tipo: 'imagem' | 'pdf' | 'arquivo';
}> {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  if (isImage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        // Comprimir imagem em canvas para não estourar limite do LocalStorage
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ dataUrl: rawUrl, nome: file.name, tipo: 'imagem' });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve({
            dataUrl: compressedDataUrl,
            nome: file.name,
            tipo: 'imagem'
          });
        };
        img.onerror = () => {
          resolve({ dataUrl: rawUrl, nome: file.name, tipo: 'imagem' });
        };
        img.src = rawUrl;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // Se for PDF ou outro arquivo
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        dataUrl: (e.target?.result as string) || '',
        nome: file.name,
        tipo: isPdf ? 'pdf' : 'arquivo'
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
