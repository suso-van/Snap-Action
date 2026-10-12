import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface ImageLightboxModalProps {
  imageSrc: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  imageSrc,
  title,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
    >
      {/* Top Floating Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl flex items-center justify-between py-2 px-4 rounded-2xl bg-[#141414]/90 border border-[#2E2E2E] mb-3 text-white"
      >
        <span className="text-xs font-semibold truncate max-w-xs">{title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="p-1.5 rounded-lg hover:bg-[#222] text-[#AAA] hover:text-white"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-[#777]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="p-1.5 rounded-lg hover:bg-[#222] text-[#AAA] hover:text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset zoom"
            className="p-1.5 rounded-lg hover:bg-[#222] text-[#AAA] hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-[#AAA] hover:text-rose-400 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-full max-h-[82vh] overflow-auto rounded-2xl border border-[#222] bg-[#0A0A0A] p-2 flex items-center justify-center shadow-2xl"
      >
        <img
          src={imageSrc}
          alt={title}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="max-h-[75vh] w-auto object-contain transition-transform duration-150 select-none"
        />
      </div>
    </div>
  );
};
