import React from 'react';
import { 
  Sparkles, 
  Wrench, 
  Fuel, 
  Coffee, 
  Tv, 
  ArrowDownLeft, 
  HelpCircle,
  Tag
} from 'lucide-react';

interface CategoriaBadgeProps {
  categoria: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

interface CategoryStyle {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  icon: React.ReactNode;
}

export const getCategoryConfig = (categoria: string): CategoryStyle => {
  const catLower = (categoria || '').toLowerCase().trim();

  if (catLower.includes('limpeza')) {
    return {
      label: categoria || 'Limpeza',
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200',
      dot: 'bg-cyan-500',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
    };
  }

  if (catLower.includes('manuten') || catLower.includes('reparo')) {
    return {
      label: categoria || 'Manutenção',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      icon: <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    };
  }

  if (catLower.includes('combust') || catLower.includes('gasolina') || catLower.includes('diesel')) {
    return {
      label: categoria || 'Combustível',
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
      icon: <Fuel className="w-3.5 h-3.5 text-orange-600 shrink-0" />
    };
  }

  if (catLower.includes('alimenta') || catLower.includes('café') || catLower.includes('agua') || catLower.includes('água') || catLower.includes('lanche')) {
    return {
      label: categoria || 'Alimentação & Café',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      icon: <Coffee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
    };
  }

  if (catLower.includes('conforto') || catLower.includes('eletro') || catLower.includes('ar-condicionado') || catLower.includes('tv')) {
    return {
      label: categoria || 'Conforto & Eletro',
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
      dot: 'bg-indigo-500',
      icon: <Tv className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
    };
  }

  if (catLower.includes('doaç') || catLower.includes('crédit') || catLower.includes('entrada') || catLower.includes('saldo')) {
    return {
      label: categoria || 'Doação / Crédito',
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200',
      dot: 'bg-teal-500',
      icon: <ArrowDownLeft className="w-3.5 h-3.5 text-teal-600 shrink-0" />
    };
  }

  return {
    label: categoria || 'Outros',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    icon: <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
  };
};

export const CategoriaBadge: React.FC<CategoriaBadgeProps> = ({
  categoria,
  size = 'md',
  showDot = true
}) => {
  const config = getCategoryConfig(categoria);

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-lg border shadow-2xs whitespace-nowrap transition-colors ${config.bg} ${config.text} ${config.border} ${
        isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
      title={`Categoria: ${categoria}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0 animate-pulse`} />
      )}
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
