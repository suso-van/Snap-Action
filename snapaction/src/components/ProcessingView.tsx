import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { SnapActionLogo } from './SnapActionLogo';

interface ProcessingViewProps {
  imageSrc: string;
  onCancel: () => void;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ imageSrc, onCancel }) => {
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(15);

  useEffect(() => {
    const pTimer = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.floor(Math.random() * 8) + 4 : prev));
    }, 140);

    const timer1 = setTimeout(() => setStep(1), 700);
    const timer2 = setTimeout(() => setStep(2), 1500);

    return () => {
      clearInterval(pTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    'Scanning text & visual structure',
    'Extracting entities & dates',
    'Synthesizing contextual actions',
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] max-w-sm mx-auto px-4 py-8 space-y-6 animate-fadeIn select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-2.5 opacity-90">
        <SnapActionLogo size="sm" withGlow={true} />
        <span className="font-bold tracking-tight text-base text-[#EDEDED] font-sans">
          SnapAction
        </span>
      </div>

      {/* Screenshot Preview Card */}
      <div className="relative w-full max-w-[260px] aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#1C1C1C] shadow-2xl">
        <img
          src={imageSrc}
          alt="Processing screenshot"
          className="w-full h-full object-cover opacity-75 filter contrast-105"
        />

        {/* Minimalist Scan Light */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EDEDED] to-transparent shadow-[0_0_12px_rgba(255,255,255,0.6)] animate-scanner" />

        {/* Subtle dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60 pointer-events-none" />
      </div>

      {/* Minimalist Loading Details */}
      <div className="w-full max-w-[260px] space-y-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="w-3.5 h-3.5 text-[#888] animate-spin" />
            <span className="font-semibold tracking-tight text-sm text-[#EDEDED]">
              Analyzing Screenshot
            </span>
          </div>
          <p className="text-xs text-[#777] font-light">
            {steps[step] || 'Finalizing results...'}
          </p>
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-full h-[2px] bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-[#EDEDED] rounded-full transition-all duration-150 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="pt-2 text-xs text-[#666] hover:text-[#EDEDED] transition-colors flex items-center justify-center space-x-1.5 mx-auto"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};
