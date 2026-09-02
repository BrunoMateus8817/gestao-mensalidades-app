import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Wifi, 
  Sparkles,
  Layers,
  FileDown,
  FileCode,
  Terminal,
  FolderArchive,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  gerarArquivoInstaladorHtml, 
  gerarAtalhoWindowsUrl, 
  gerarScriptIniciadorWindows 
} from '../utils/downloadAppFile';

interface ModalInstalarPWAProps {
  onClose: () => void;
  initialTab?: 'arquivos' | 'android' | 'ios' | 'desktop';
}

type TabType = 'arquivos' | 'android' | 'ios' | 'desktop';

export const ModalInstalarPWA: React.FC<ModalInstalarPWAProps> = ({ onClose, initialTab = 'arquivos' }) => {
  const { 
    isInstallable, 
    isIOS, 
    isAndroid, 
    isInIframe, 
    triggerNativeInstall 
  } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const handleDownloadFeedback = (msg: string) => {
    setDownloadFeedback(msg);
    setTimeout(() => setDownloadFeedback(null), 3500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  const handleDirectInstall = async () => {
    setInstalling(true);
    try {
      const success = await triggerNativeInstall();
      if (success) {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 animate-fade-in my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Identity */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-amber-400/40 flex items-center justify-center shadow-md flex-shrink-0">
            <img 
              src="/pwa-192x192.png" 
              alt="RP 3º BPM Logo" 
              className="w-9 h-9 object-contain"
              onError={(e) => {
                // Fallback to icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 font-['Chakra_Petch']">
                Instalar Aplicativo RP
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-200">
                PWA
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Alojamento Rádio Patrulha — 3º BPM / PMAL
            </p>
          </div>
        </div>

        {/* Feedback Alert for Downloads */}
        {downloadFeedback && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{downloadFeedback}</span>
          </div>
        )}

        {/* If inside iframe (AI Studio Preview), show Open in New Tab Notice */}
        {isInIframe && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Ambiente de Pré-visualização Detectado</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              No modo incorporado, você pode gerar os arquivos de instalação diretamente para o seu aparelho ou abrir em nova aba:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleOpenNewTab}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir App em Nova Aba</span>
              </button>
              <button
                onClick={() => {
                  gerarArquivoInstaladorHtml();
                  handleDownloadFeedback('Instalador Web (.html) baixado com sucesso!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Baixar Instalador (.html)</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-amber-300 text-slate-800 font-semibold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? 'Link Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Native 1-Click Install Button (When prompt is available) */}
        {isInstallable && (
          <div className="mb-5 p-4 rounded-2xl bg-slate-900 text-white shadow-lg space-y-2.5 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Instalação Direta Pronta
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300">
              Seu navegador suporta instalação instantânea com um toque:
            </p>
            <button
              onClick={handleDirectInstall}
              disabled={installing}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{installing ? 'Instalando...' : 'Instalar Agora no Aparelho'}</span>
            </button>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Opções de Download e Instalação:
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('arquivos')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'arquivos'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <FileDown className="w-3.5 h-3.5 text-slate-950" />
              <span>Baixar Arquivos</span>
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Android</span>
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'ios'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span>iPhone</span>
            </button>

            <button
              onClick={() => setActiveTab('desktop')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
              <span>PC</span>
            </button>
          </div>

          {/* Tab: Gerar Arquivos do App */}
          {activeTab === 'arquivos' && (
            <div className="space-y-3 animate-fade-in">
              {/* Card 1: Instalador Web HTML */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900">
                        Instalador Web Autônomo (.html)
                      </h4>
                      <span className="text-[10px] text-amber-800 font-bold">
                        Recomendado • Celular (Android/iOS) e PC
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                    Offline / Portátil
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Gera um arquivo de lançamento rápido que você pode salvar nos seus arquivos, enviar pelo WhatsApp ou pendrive. Ao abrir, ele carrega o sistema do Alojamento imediatamente.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    gerarArquivoInstaladorHtml();
                    handleDownloadFeedback('Instalador Web (.html) baixado com sucesso!');
                  }}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Baixar Arquivo Instalador (.html)</span>
                </button>
              </div>

              {/* Card 2: Atalho Windows .URL */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900">
                        Atalho para Área de Trabalho (.url)
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Computador • Windows
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px] font-bold">
                    Atalho PC
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Gera um atalho direto para colocar na Área de Trabalho do computador do alojamento ou da tesouraria do 3º BPM.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    gerarAtalhoWindowsUrl();
                    handleDownloadFeedback('Atalho Windows (.url) baixado!');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-amber-400" />
                  <span>Baixar Atalho de Área de Trabalho (.url)</span>
                </button>
              </div>

              {/* Card 3: Script Executável Windows .BAT */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-900">
                        Inicializador de Janela (.bat)
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Modo Aplicativo (Sem barras de navegador)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    1 Clique
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  Executável rápido para Windows que abre o sistema em uma janela limpa e dedicada como se fosse um software instalado.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    gerarScriptIniciadorWindows();
                    handleDownloadFeedback('Script Inicializador (.bat) baixado!');
                  }}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <FileDown className="w-4 h-4 text-emerald-600" />
                  <span>Baixar Inicializador de Janela (.bat)</span>
                </button>
              </div>

              {/* Card 4: Código Fonte ZIP */}
              <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200 flex items-start gap-2.5 text-[11px] text-slate-600">
                <FolderArchive className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Para baixar o código-fonte completo (.ZIP):</strong> no menu superior do Google AI Studio, clique nos três pontinhos ou no ícone de configurações e selecione <em>"Export to ZIP"</em>.
                </p>
              </div>
            </div>
          )}

          {/* Tab 1: Android Instructions */}
          {activeTab === 'android' && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-fade-in text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  1
                </span>
                <p>Abra o link do app no <strong>Google Chrome</strong> ou <strong>Samsung Internet</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Toque nos <strong>3 pontinhos</strong> <MoreVertical className="w-3.5 h-3.5 inline mx-0.5 text-slate-900" /> no canto superior direito do navegador.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: iOS Instructions */}
          {activeTab === 'ios' && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-fade-in text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  1
                </span>
                <p>Abra o link do app no navegador <strong>Safari</strong> do iPhone/iPad.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Toque no botão de <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline mx-0.5 text-sky-600" /> na barra inferior do Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-700" />.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  4
                </span>
                <p>Toque em <strong>"Adicionar"</strong> no canto superior direito.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Desktop Instructions */}
          {activeTab === 'desktop' && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 animate-fade-in text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  1
                </span>
                <p>Acesse o app pelo <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong> ou <strong>Brave</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Clique no ícone de <strong>Instalar</strong> <Download className="w-3.5 h-3.5 inline mx-0.5 text-indigo-600" /> na barra de endereço (à direita, próximo da estrela de favoritos) ou vá no Menu ⋮ &gt; <strong>"Instalar RP 3º BPM"</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Wifi className="w-4 h-4 mx-auto text-amber-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-700 block">Funciona Offline</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <Layers className="w-4 h-4 mx-auto text-sky-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-700 block">Tela Cheia</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <span className="text-[10px] font-bold text-slate-700 block">Acesso Rápido</span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
