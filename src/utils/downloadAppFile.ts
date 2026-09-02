/**
 * Utilitários para gerar e baixar arquivos de instalação e atalhos do aplicativo
 * Alojamento Rádio Patrulha - 3º BPM / PMAL
 */

export function getAppDirectUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin || window.location.href;
}

/**
 * Gera e faz o download de um arquivo HTML autônomo (Instalador Web do App)
 * Pode ser compartilhado via WhatsApp, pendrive ou salvo na memória do celular/computador.
 */
export function gerarArquivoInstaladorHtml(appName: string = 'Alojamento Rádio Patrulha - 3º BPM'): void {
  const appUrl = getAppDirectUrl();
  const dataGeracao = new Date().toLocaleDateString('pt-BR');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${appName} - Inicializador Oficial</title>
  <meta name="theme-color" content="#020617">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #020617;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #0f172a;
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 24px;
      max-width: 480px;
      width: 100%;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 999px;
      margin-bottom: 16px;
    }
    .logo-circle {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: #1e293b;
      border: 2px solid #f59e0b;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
      font-size: 32px;
      font-weight: 900;
      color: #fbbf24;
      box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2);
    }
    h1 {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: #ffffff;
      text-transform: uppercase;
    }
    p.subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 24px;
      line-height: 1.5;
    }
    .btn-main {
      display: block;
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
      color: #020617;
      font-size: 15px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-radius: 16px;
      text-decoration: none;
      box-shadow: 0 10px 20px rgba(217, 119, 6, 0.3);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
      border: none;
    }
    .btn-main:active {
      transform: scale(0.98);
    }
    .instructions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #1e293b;
      text-align: left;
    }
    .instructions h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #fbbf24;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .step {
      font-size: 12px;
      color: #cbd5e1;
      margin-bottom: 8px;
      display: flex;
      gap: 10px;
      line-height: 1.4;
    }
    .step-num {
      background: #334155;
      color: #f8fafc;
      font-weight: 800;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 10px;
    }
    .footer-info {
      margin-top: 20px;
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">POLÍCIA MILITAR DE ALAGOAS</div>
    <div class="logo-circle">RP</div>
    <h1>${appName}</h1>
    <p class="subtitle">
      Sistema de Gestão de Mensalidades, Efetivo Militar e Prestação de Contas do Alojamento da Rádio Patrulha — 3º BPM.
    </p>

    <a href="${appUrl}" id="launchBtn" class="btn-main">
      ABRIR APLICATIVO AGORA ➔
    </a>

    <div class="instructions">
      <h3>Como Adicionar à Tela Inicial do Celular:</h3>
      <div class="step">
        <span class="step-num">1</span>
        <span>Toque no botão acima para abrir o sistema no seu navegador (Chrome ou Safari).</span>
      </div>
      <div class="step">
        <span class="step-num">2</span>
        <span><strong>Android:</strong> Toque no menu (3 pontinhos) e selecione <em>"Instalar aplicativo"</em> ou <em>"Adicionar à tela inicial"</em>.</span>
      </div>
      <div class="step">
        <span class="step-num">3</span>
        <span><strong>iPhone (iOS):</strong> Toque no ícone de <em>Compartilhar</em> e selecione <em>"Adicionar à Tela de Início"</em>.</span>
      </div>
    </div>

    <div class="footer-info">
      Arquivo gerado em ${dataGeracao} • Acesso Direto: <br/>
      <span style="color: #94a3b8; word-break: break-all;">${appUrl}</span>
    </div>
  </div>

  <script>
    // Auto-redirecionamento opcional após 2 segundos
    setTimeout(function() {
      try {
        var btn = document.getElementById('launchBtn');
        if (btn) {
          btn.style.boxShadow = '0 0 25px rgba(251, 191, 36, 0.6)';
        }
      } catch(e) {}
    }, 1500);
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Instalador_App_Alojamento_RP_3BPM.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera e baixa um atalho de Área de Trabalho para Windows (.url)
 */
export function gerarAtalhoWindowsUrl(appName: string = 'Alojamento RP 3 BPM'): void {
  const appUrl = getAppDirectUrl();
  const urlContent = `[InternetShortcut]
URL=${appUrl}
IconIndex=0
HotKey=0
Comment=${appName} - Sistema de Gestão
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11
`;

  const blob = new Blob([urlContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Alojamento_RP_3BPM.url';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera e baixa um script executável (.bat) para Windows que abre o app em modo de janela limpa (Chrome/Edge App Mode)
 */
export function gerarScriptIniciadorWindows(): void {
  const appUrl = getAppDirectUrl();
  const batContent = `@echo off
rem ========================================================
rem Inicializador Oficial - Alojamento RP 3º BPM / PMAL
rem ========================================================
title Alojamento Radio Patrulha - 3 BPM

echo Iniciando o aplicativo em modo de tela cheia...

rem Tenta abrir no Microsoft Edge em modo app
start msedge --app="${appUrl}"
if %errorlevel% equ 0 exit

rem Se o Edge nao abrir, tenta Google Chrome
start chrome --app="${appUrl}"
if %errorlevel% equ 0 exit

rem Fallback: navegador padrao do sistema
start "" "${appUrl}"
exit
`;

  const blob = new Blob([batContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Iniciar_App_RP_3BPM.bat';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
