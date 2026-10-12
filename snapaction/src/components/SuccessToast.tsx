import React, { useEffect } from 'react';
import { Check, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExecutedAction } from '../types';

interface SuccessToastProps {
  action: ExecutedAction | null;
  onClose: () => void;
  onViewActions: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  action,
  onClose,
  onViewActions,
}) => {
  useEffect(() => {
    if (action) {
      // Gentle micro confetti burst
      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.85 },
          colors: ['#6366f1', '#3b82f6', '#10b981', '#38bdf8'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        // Safe fallback
      }

      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [action]);

  if (!action) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto animate-slideUp">
      <div className="bg-[#0A0A0A] backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#EDEDED] flex items-center space-x-1.5 truncate">
              <span>{action.title}</span>
            </h4>
            <p className="text-[11px] text-[#888] truncate mt-0.5">
              {action.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onViewActions}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#888] hover:text-[#EDEDED]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
