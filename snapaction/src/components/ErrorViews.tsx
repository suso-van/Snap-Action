import React from 'react';
import { AlertCircle, HelpCircle, RefreshCw, MessageSquare, ArrowLeft } from 'lucide-react';
import { ScreenshotItem } from '../types';

interface ErrorViewProps {
  screenshot: ScreenshotItem;
  onBack: () => void;
  onOpenAskAi: () => void;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  screenshot,
  onBack,
  onOpenAskAi,
  onRetry,
}) => {
  const isUnclear = screenshot.category === 'unclear';

  return (
    <div className="space-y-6 max-w-md mx-auto py-8 text-center animate-fadeIn pb-24">
      {/* Top back button */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111] border border-[#222] text-[#888] hover:text-[#EDEDED] text-xs font-semibold hover:bg-[#1A1A1A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Screenshot Thumbnail */}
      <div className="w-48 aspect-[3/4] mx-auto rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222] shadow-xl opacity-75">
        <img
          src={screenshot.imageSrc}
          alt="Analyzed image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Status & Messages */}
      {isUnclear ? (
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/40 text-rose-400 border border-rose-900/40 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-light text-[#EDEDED] tracking-tight">
            We couldn't understand this screenshot
          </h2>
          <p className="text-xs text-[#888] max-w-xs mx-auto leading-relaxed">
            The text appears blurry, low resolution, or too faint to reliably extract dates, flight numbers, or bills.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-900/40 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-light text-[#EDEDED] tracking-tight">
            Nothing actionable found
          </h2>
          <p className="text-xs text-[#888] max-w-xs mx-auto leading-relaxed">
            This image doesn't appear to contain upcoming flights, bills, delivery tracking IDs, or deadlines. You can still ask questions about it below!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 max-w-xs mx-auto pt-2">
        <button
          onClick={onOpenAskAi}
          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI About This Image</span>
        </button>

        <button
          onClick={onRetry}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#EDEDED] font-semibold text-xs border border-[#262626] transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Another Screenshot</span>
        </button>
      </div>
    </div>
  );
};
