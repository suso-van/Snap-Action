import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { EntityProvenance } from '../../types';

interface ProvenanceBadgeProps {
  provenance?: EntityProvenance;
  confidence?: number;
  compact?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  provenance = 'extracted',
  confidence,
  compact = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getConfig = () => {
    switch (provenance) {
      case 'extracted':
        return {
          label: 'Directly Extracted',
          shortLabel: 'Extracted',
          desc: 'Directly captured from text or visual pixels in the screenshot.',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          icon: CheckCircle2,
        };
      case 'inferred':
        return {
          label: 'AI Inferred',
          shortLabel: 'Inferred',
          desc: 'Intelligently deduced or estimated by AI (not explicitly stated in text).',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          icon: Sparkles,
        };
      case 'verified':
        return {
          label: 'Verified Source',
          shortLabel: 'Verified',
          desc: 'Cross-checked and validated against standard formats or external registry.',
          color: 'text-sky-400',
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/30',
          icon: ShieldCheck,
        };
      default:
        return {
          label: 'Extracted',
          shortLabel: 'Extracted',
          desc: 'Captured from screenshot.',
          color: 'text-slate-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          icon: CheckCircle2,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border transition-all ${config.bg} ${config.color} ${config.border} hover:brightness-125`}
        title={config.desc}
      >
        <Icon className="w-2.5 h-2.5 flex-shrink-0" />
        <span>{compact ? config.shortLabel : config.label}</span>
        {confidence !== undefined && (
          <span className="opacity-75 font-mono text-[9px]">
            {Math.round(confidence * 100)}%
          </span>
        )}
      </button>

      {/* Floating tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-0 mb-1.5 w-48 p-2 rounded-lg bg-[#181818] border border-[#333] text-[10px] text-[#D4D4D4] shadow-xl pointer-events-none"
        >
          <div className="flex items-center space-x-1 font-bold text-white mb-0.5">
            <Icon className={`w-3 h-3 ${config.color}`} />
            <span>{config.label}</span>
          </div>
          <p className="leading-tight text-[#AAA]">{config.desc}</p>
        </div>
      )}
    </div>
  );
};
