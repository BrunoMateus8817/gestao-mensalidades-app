import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KPISummary } from './components/KPISummary';
import { MensalidadesTab } from './components/MensalidadesTab';
import { CaixaTab } from './components/CaixaTab';
import { EfetivoTab } from './components/EfetivoTab';
import { ModalRecibo } from './components/ModalRecibo';
import { ModalCobrancaGrupo } from './components/ModalCobrancaGrupo';
import { ModalLancamentoCaixa } from './components/ModalLancamentoCaixa';
import { ModalCadastrarPolicial } from './components/ModalCadastrarPolicial';
import { ModalConfiguracoes } from './components/ModalConfiguracoes';
import { ModalRelatorioBalancete } from './components/ModalRelatorioBalancete';
import { ModalRelatorioPagos } from './components/ModalRelatorioPagos';
import { ModalInstalarPWA } from './components/ModalInstalarPWA';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RPLogo } from './components/RPLogo';

import { Policial, MovimentacaoCaixa, ConfiguracaoApp, StatusPagamento } from './types';
import { INITIAL_POLICIAIS, INITIAL_CAIXA, DEFAULT_CONFIG } from './data/initialData';
import { 
  salvarMensalidadeGoogleSheets, 
  salvarCaixaGoogleSheets, 
  formatarMesAnoReferencia, 
  formatarValorMoedaSheets 
} from './services/sheetsApi';

const LOCAL_STORAGE_KEY_POLICIAIS = 'rp_3bpm_policiais_v1';
const LOCAL_STORAGE_KEY_CAIXA = 'rp_3bpm_caixa_v3';
const LOCAL_STORAGE_KEY_CONFIG = 'rp_3bpm_config_v1';

export default function App() {
  // Load State from LocalStorage or default initial data
  const [policiais, setPoliciais] = useState<Policial[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_POLICIAIS);
      return saved ? JSON.parse(saved) : INITIAL_POLICIAIS;
    } catch {
      return INITIAL_POLICIAIS;
    }
  });

  const [caixa, setCaixa] = useState<MovimentacaoCaixa[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CAIXA);
      return saved ? JSON.parse(saved) : INITIAL_CAIXA;
    } catch {
      return INITIAL_CAIXA;
    }
  });

  const [config, setConfig] = useState<ConfiguracaoApp>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.googleAppsScriptUrl || parsed.googleAppsScriptUrl.includes('AKfycbyFrshc')) {
          parsed.googleAppsScriptUrl = DEFAULT_CONFIG.googleAppsScriptUrl;
        }
        return parsed;
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState<'mensalidades' | 'caixa' | 'cadastro'>('caixa');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [reciboPolicial, setReciboPolicial] = useState<Policial | null>(null);
  const [showGrupoWhatsApp, setShowGrupoWhatsApp] = useState<boolean>(false);
  const [showNovoGasto, setShowNovoGasto] = useState<boolean>(false);
  const [gastoParaEditar, setGastoParaEditar] = useState<MovimentacaoCaixa | null>(null);
  const [showNovoPolicial, setShowNovoPolicial] = useState<boolean>(false);
  const [policialParaEditar, setPolicialParaEditar] = useState<Policial | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showBalancete, setShowBalancete] = useState<boolean>(false);
  const [showRelatorioPagos, setShowRelatorioPagos] = useState<boolean>(false);
  const [showModalInstalarPWA, setShowModalInstalarPWA] = useState<boolean>(false);

  // Save to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_POLICIAIS, JSON.stringify(policiais));
  }, [policiais]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CAIXA, JSON.stringify(caixa));
  }, [caixa]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
  }, [config]);

  // Show quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize with Google Apps Script Sheet
  const handleSyncGoogleSheets = async () => {
    if (!config.googleAppsScriptUrl) {
      showToast('⚠️ URL do Google Apps Script não configurada.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${config.googleAppsScriptUrl}?acao=obterDados`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Falha na resposta do Google Apps Script');

      const dados = await response.json();

      if (dados.policiais && Array.isArray(dados.policiais)) {
        const policiaisAtualizados: Policial[] = dados.policiais.map((item: any, idx: number) => ({
          id: `p-sync-${item.linha || idx}`,
          linha: item.linha,
          nome: item.nome || `Militar ${idx + 1}`,
          graduacao: item.nome?.split(' ')[0] || 'SD',
          nomeGuerra: item.nome?.split(' ').slice(1).join(' ') || item.nome || '',
          fone: (item.telefone || item.fone || '').toString().replace(/\D/g, ''),
          status: (item.status === 'Pago' || item.status === 'Isento' ? item.status : 'Pendente') as StatusPagamento,
          valor: typeof item.valor === 'number' ? item.valor : parseFloat(item.valor) || config.valorMensalidadePadrao,
          forma: item.forma || 'PIX',
          dataPagamento: item.dataPagamento || (item.status === 'Pago' ? new Date().toLocaleDateString('pt-BR') : undefined)
        }));

        setPoliciais(policiaisAtualizados);
      }

      if (dados.caixa && Array.isArray(dados.caixa)) {
        const caixaAtualizado: MovimentacaoCaixa[] = dados.caixa.map((item: any, idx: number) => ({
          id: `cx-sync-${item.linha || idx}`,
          linha: item.linha,
          data: item.data || new Date().toLocaleDateString('pt-BR'),
          tipo: item.tipo === 'Entrada' ? 'Entrada' : 'Saída',
          desc: item.desc || item.descricao || 'Despesa/Entrada',
          categoria: item.categoria || (item.tipo === 'Entrada' ? 'Doação / Crédito' : 'Material de Limpeza'),
          resp: item.resp || item.responsavel || 'Tesouraria RP',
          valor: typeof item.valor === 'number' ? item.valor : parseFloat(item.valor) || 0
        }));

        setCaixa(caixaAtualizado);
      }

      setSyncStatus('success');
      showToast('✅ Dados sincronizados com sucesso da Planilha!');
    } catch (err) {
      console.warn('Google Apps Script offline ou CORS restrito. Operando em modo de dados local/persistente.', err);
      setSyncStatus('error');
      showToast('ℹ️ Modo Local Ativo. Dados salvos com segurança no navegador.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Dar Baixa em Mensalidade / Salvar Pagamento
  const handleDarBaixa = async (id: string, forma: 'PIX' | 'Dinheiro' | 'Transferência' = 'PIX') => {
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    
    // Update local state immediately
    const alvo = policiais.find(p => p.id === id);
    if (!alvo) return;

    setPoliciais(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'Pago',
          forma,
          dataPagamento: dataHoje
        };
      }
      return p;
    }));

    showToast(`✅ Baixa confirmada para ${alvo.nome}!`);

    // Enviar requisição HTTP POST para a planilha Google Sheets no formato JSON solicitado:
    // { "aba": "Mensalidades", "valores": ["09/2026", "NOME_DO_POLICIAL", "R$ 50,00", "PIX", "Pago"] }
    const mesAno = formatarMesAnoReferencia(config.mesReferencia, config.anoReferencia);
    const valorFormatado = formatarValorMoedaSheets(alvo.valor);

    try {
      const res = await salvarMensalidadeGoogleSheets({
        mesAno,
        nomePolicial: alvo.nome,
        valor: valorFormatado,
        forma,
        status: 'Pago',
        url: config.googleAppsScriptUrl
      });
      if (res.success) {
        showToast(`✅ Pagamento de ${alvo.nome} salvo na planilha Google Sheets!`);
      }
    } catch (e) {
      console.warn('Erro ao atualizar na planilha remota:', e);
    }
  };

  // Reverter status para Pendente ou Isento
  const handleReverterStatus = async (id: string, novoStatus: StatusPagamento) => {
    setPoliciais(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: novoStatus,
          dataPagamento: undefined
        };
      }
      return p;
    }));

    showToast(`Status alterado para ${novoStatus}.`);
  };

  // Salvar ou Editar Movimentação no Caixa
  const handleSalvarGasto = async (novoGasto: Omit<MovimentacaoCaixa, 'id'>) => {
    if (gastoParaEditar) {
      const movAtualizada: MovimentacaoCaixa = {
        ...gastoParaEditar,
        ...novoGasto
      };
      setCaixa(prev => prev.map(c => c.id === gastoParaEditar.id ? movAtualizada : c));
      setGastoParaEditar(null);
      showToast(`✅ Movimentação atualizada com sucesso!`);
      return;
    }

    const novaMov: MovimentacaoCaixa = {
      ...novoGasto,
      id: `cx-${Date.now()}`
    };

    setCaixa(prev => [novaMov, ...prev]);
    showToast(`✅ Movimentação de ${novaMov.tipo.toLowerCase()} registrada com sucesso!`);

    if (config.googleAppsScriptUrl) {
      try {
        await salvarCaixaGoogleSheets({
          data: novaMov.data,
          tipo: novaMov.tipo,
          desc: novaMov.desc,
          categoria: novaMov.categoria,
          resp: novaMov.resp,
          valor: novaMov.valor,
          url: config.googleAppsScriptUrl
        });
      } catch (e) {
        console.warn('Erro ao salvar no Google Apps Script:', e);
      }
    }
  };

  // Atualizar comprovante ou dados diretamente de uma movimentação
  const handleAtualizarGasto = (movAtualizada: MovimentacaoCaixa) => {
    setCaixa(prev => prev.map(c => c.id === movAtualizada.id ? movAtualizada : c));
    showToast('✅ Comprovante anexado à despesa com sucesso!');
  };

  // Remover Movimentação do Caixa
  const handleRemoverGasto = async (id: string) => {
    const item = caixa.find(c => c.id === id);
    if (!item) return;

    if (!confirm(`Deseja realmente remover o registro "${item.desc}"?`)) return;

    setCaixa(prev => prev.filter(c => c.id !== id));
    showToast('Registro removido do caixa.');

    if (config.googleAppsScriptUrl && item.linha) {
      try {
        await fetch(config.googleAppsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            acao: 'removerCaixa',
            linha: item.linha
          })
        });
      } catch (e) {
        console.warn('Erro ao remover no Google Apps Script:', e);
      }
    }
  };

  // Salvar Militar (Novo ou Editado)
  const handleSalvarPolicial = async (dados: Omit<Policial, 'id'>, idEditar?: string) => {
    const mesAno = formatarMesAnoReferencia(config.mesReferencia, config.anoReferencia);
    const valorFormatado = formatarValorMoedaSheets(dados.valor);

    if (idEditar) {
      setPoliciais(prev => prev.map(p => {
        if (p.id === idEditar) {
          return {
            ...p,
            ...dados
          };
        }
        return p;
      }));
      showToast(`Cadastro de ${dados.nome} atualizado!`);
    } else {
      const novoPolicial: Policial = {
        ...dados,
        id: `p-${Date.now()}`
      };
      setPoliciais(prev => [...prev, novoPolicial]);
      showToast(`Militar ${novoPolicial.nome} adicionado ao efetivo!`);
    }

    // Sincronizar novo cadastro/mensalidade com a aba Mensalidades do Google Sheets
    try {
      const res = await salvarMensalidadeGoogleSheets({
        mesAno,
        nomePolicial: dados.nome,
        valor: valorFormatado,
        forma: dados.forma || 'PIX',
        status: dados.status || 'Pendente',
        url: config.googleAppsScriptUrl
      });
      if (res.success) {
        showToast(`✅ ${dados.nome} registrado na planilha Google Sheets!`);
      }
    } catch (e) {
      console.warn('Erro ao salvar no Google Sheets:', e);
    }
  };

  // Atualizar telefone do militar
  const handleAtualizarTelefonePolicial = (id: string, novoFone: string) => {
    setPoliciais(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          fone: novoFone
        };
      }
      return p;
    }));
  };

  // Remover Militar
  const handleRemoverPolicial = (id: string) => {
    const p = policiais.find(x => x.id === id);
    if (!p) return;

    if (!confirm(`Deseja remover ${p.nome} do efetivo do alojamento?`)) return;

    setPoliciais(prev => prev.filter(x => x.id !== id));
    showToast(`Militar removido do efetivo.`);
  };

  // Exportar Backup JSON
  const handleExportarBackup = () => {
    const backupData = {
      versao: "1.0",
      dataExportacao: new Date().toISOString(),
      config,
      policiais,
      caixa
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_alojamento_rp_3bpm_${config.mesReferencia}_${config.anoReferencia}.json`;
    a.click();
    showToast('💾 Backup exportado com sucesso!');
  };

  // Importar Backup JSON
  const handleImportarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.policiais && parsed.caixa && parsed.config) {
          setPoliciais(parsed.policiais);
          setCaixa(parsed.caixa);
          setConfig(parsed.config);
          showToast('✅ Dados restaurados com sucesso a partir do backup!');
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch {
        alert('Erro ao ler arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  // Restaurar dados de fábrica
  const handleRestaurarPadroes = () => {
    if (!confirm('Deseja restaurar os dados padrões originais do Alojamento RP?')) return;
    setPoliciais(INITIAL_POLICIAIS);
    setCaixa(INITIAL_CAIXA);
    setConfig(DEFAULT_CONFIG);
    showToast('🔄 Dados padrão restaurados.');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* AMBIENT BENTO GLOW ACCENTS */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-1/2 right-10 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* BACKGROUND WATERMARK RP 3° BPM */}
      <div 
        aria-hidden="true" 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[550px] opacity-[0.035] pointer-events-none z-0 select-none drop-shadow-sm flex items-center justify-center grayscale"
      >
        <RPLogo className="w-full h-auto" />
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenSettings={() => setShowSettings(true)}
        onOpenBalancete={() => setShowBalancete(true)}
        onOpenRelatorioPagos={() => setShowRelatorioPagos(true)}
        isSyncing={isSyncing}
        onSync={handleSyncGoogleSheets}
        syncStatus={syncStatus}
        onMonthChange={(mes) => {
          setConfig(prev => ({ ...prev, mesReferencia: mes }));
          showToast(`Período alterado para ${mes}/${config.anoReferencia}`);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full relative z-10">
        
        {/* KPI Summary Bento Strip */}
        <KPISummary 
          policiais={policiais} 
          caixa={caixa}
          config={config}
          onOpenBalancete={() => setShowBalancete(true)}
          onOpenGrupoWhatsApp={() => setShowGrupoWhatsApp(true)}
          onOpenRelatorioPagos={() => setShowRelatorioPagos(true)}
          onOpenBaixarApp={() => setShowModalInstalarPWA(true)}
        />

        {/* Tab 1: Mensalidades */}
        {activeTab === 'mensalidades' && (
          <MensalidadesTab
            policiais={policiais}
            config={config}
            onDarBaixa={handleDarBaixa}
            onReverterStatus={handleReverterStatus}
            onGerarRecibo={(p) => setReciboPolicial(p)}
            onOpenGrupoWhatsApp={() => setShowGrupoWhatsApp(true)}
            onOpenNovoPolicial={() => {
              setPolicialParaEditar(null);
              setShowNovoPolicial(true);
            }}
            onOpenRelatorioPagos={() => setShowRelatorioPagos(true)}
            onAtualizarTelefone={handleAtualizarTelefonePolicial}
          />
        )}

        {/* Tab 2: Caixa & Gastos */}
        {activeTab === 'caixa' && (
          <CaixaTab
            caixa={caixa}
            onOpenNovoGasto={() => {
              setGastoParaEditar(null);
              setShowNovoGasto(true);
            }}
            onRemoverGasto={handleRemoverGasto}
            onAtualizarGasto={handleAtualizarGasto}
            onEditarGasto={(mov) => {
              setGastoParaEditar(mov);
              setShowNovoGasto(true);
            }}
          />
        )}

        {/* Tab 3: Efetivo */}
        {activeTab === 'cadastro' && (
          <EfetivoTab
            policiais={policiais}
            onOpenNovoPolicial={() => {
              setPolicialParaEditar(null);
              setShowNovoPolicial(true);
            }}
            onEditarPolicial={(p) => {
              setPolicialParaEditar(p);
              setShowNovoPolicial(true);
            }}
            onRemoverPolicial={handleRemoverPolicial}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200/80 backdrop-blur-md text-slate-500 py-4 text-center text-xs no-print relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <RPLogo className="w-5 h-6" />
            <span className="font-['Chakra_Petch'] font-bold text-slate-800 uppercase tracking-wider">
              {config.alojamento} — {config.batalhao}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Operacional Online
            </span>
            <span>•</span>
            <span>Controle de Mensalidades & Tesouraria • 2026</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fade-in no-print">
          <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      {reciboPolicial && (
        <ModalRecibo
          policial={reciboPolicial}
          config={config}
          onClose={() => setReciboPolicial(null)}
          onSalvarTelefone={handleAtualizarTelefonePolicial}
        />
      )}

      {showGrupoWhatsApp && (
        <ModalCobrancaGrupo
          policiais={policiais}
          config={config}
          onClose={() => setShowGrupoWhatsApp(false)}
        />
      )}

      {showNovoGasto && (
        <ModalLancamentoCaixa
          onSalvar={handleSalvarGasto}
          movimentacaoParaEditar={gastoParaEditar}
          onClose={() => {
            setShowNovoGasto(false);
            setGastoParaEditar(null);
          }}
        />
      )}

      {showNovoPolicial && (
        <ModalCadastrarPolicial
          policialEditar={policialParaEditar}
          valorPadrao={config.valorMensalidadePadrao}
          onSalvar={handleSalvarPolicial}
          onClose={() => {
            setShowNovoPolicial(false);
            setPolicialParaEditar(null);
          }}
        />
      )}

      {showSettings && (
        <ModalConfiguracoes
          config={config}
          onSalvarConfig={(novaConfig) => {
            setConfig(novaConfig);
            showToast('Configurações salvas!');
          }}
          onExportarBackup={handleExportarBackup}
          onImportarBackup={handleImportarBackup}
          onRestaurarPadroes={handleRestaurarPadroes}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showBalancete && (
        <ModalRelatorioBalancete
          policiais={policiais}
          caixa={caixa}
          config={config}
          onClose={() => setShowBalancete(false)}
        />
      )}

      {showRelatorioPagos && (
        <ModalRelatorioPagos
          policiais={policiais}
          config={config}
          onClose={() => setShowRelatorioPagos(false)}
        />
      )}

      {showModalInstalarPWA && (
        <ModalInstalarPWA
          onClose={() => setShowModalInstalarPWA(false)}
          initialTab="arquivos"
        />
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />

    </div>
  );
}
