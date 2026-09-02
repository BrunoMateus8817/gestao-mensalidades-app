import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { ModalInstalarPWA } from './ModalInstalarPWA';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInIframe, triggerNativeInstall } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleClick = async () => {
    // If we have native prompt ready and not in an iframe, trigger direct install
    if (isInstallable && !isInIframe) {
      setInstalling(true);
      try {
        const installed = await triggerNativeInstall();
        if (!installed) {
          // If prompt was dismissed or failed, show modal guide
          setShowModal(true);
        }
      } catch {
        setShowModal(true);
      } finally {
        setInstalling(false);
      }
    } else {
      // Otherwise open the visual install & download guide modal
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        onClick={handleClick}
        disabled={installing}
        title="Gerar arquivo para baixar o aplicativo ou instalar no celular / computador"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-xs cursor-pointer active:scale-95 border border-amber-500/20"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">Baixar / Instalar App</span>
        <span className="sm:hidden">Baixar App</span>
      </button>

      {showModal && (
        <ModalInstalarPWA onClose={() => setShowModal(false)} initialTab="arquivos" />
      )}
    </>
  );
};
