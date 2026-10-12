import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Plane,
  CreditCard,
  Package,
  MapPin,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Clipboard,
  FileQuestion,
  ChevronRight,
  ShieldCheck,
  FileUp,
  AlertCircle,
  X,
  Layers,
  Clock,
  Zap,
} from 'lucide-react';
import { ScreenshotItem } from '../types';
import { SAMPLE_SCREENSHOTS } from '../data/sampleScreenshots';

interface HomeViewProps {
  onAnalyzeImage: (imageSrc: string, filename?: string) => void;
  onSelectPreset: (preset: ScreenshotItem) => void;
  onOpenRecent: (item: ScreenshotItem) => void;
  onOpenCamera: () => void;
  recentScreenshots: ScreenshotItem[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onAnalyzeImage,
  onSelectPreset,
  onOpenRecent,
  onOpenCamera,
  recentScreenshots,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);
  const windowDragCounterRef = useRef<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showError('Please select or drop a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAnalyzeImage(result, file.name);
      }
    };
    reader.onerror = () => {
      showError('Failed to read the selected image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Window-level drag-and-drop listener
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      const types = e.dataTransfer?.types;
      if (types && (Array.from(types).includes('Files') || Array.from(types).includes('public.file-url'))) {
        windowDragCounterRef.current += 1;
        setIsDraggingOverWindow(true);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      windowDragCounterRef.current -= 1;
      if (windowDragCounterRef.current <= 0) {
        windowDragCounterRef.current = 0;
        setIsDraggingOverWindow(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      windowDragCounterRef.current = 0;
      setIsDraggingOverWindow(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        let imageFile: File | null = null;
        for (let i = 0; i < files.length; i++) {
          if (files[i].type.startsWith('image/')) {
            imageFile = files[i];
            break;
          }
        }

        if (imageFile) {
          processFile(imageFile);
        } else {
          showError('No valid image found in dropped items. Please drop a PNG, JPG, or WebP screenshot.');
        }
      }
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              onAnalyzeImage(e.target.result as string, 'clipboard_screenshot.png');
            }
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      showError('No image found on your clipboard. Take a screenshot or copy an image first.');
    } catch {
      showError('Clipboard access denied or empty. Please use Camera or Browse.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ticket':
      case 'travel':
        return <Plane className="w-4 h-4 text-rose-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'receipt':
        return <span className="text-sm">🧾</span>;
      case 'package':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'address':
        return <MapPin className="w-4 h-4 text-sky-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-blue-400" />;
      case 'event':
        return <span className="text-sm">📅</span>;
      case 'contact':
        return <span className="text-sm">👤</span>;
      case 'link':
        return <span className="text-sm">🔗</span>;
      case 'github':
        return <span className="text-sm">🐙</span>;
      case 'document':
        return <span className="text-sm">📄</span>;
      default:
        return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  const categoryChips = [
    { id: 'all', label: 'All Samples' },
    { id: 'ticket', label: 'Flights & Passes', icon: '✈️' },
    { id: 'payment', label: 'Bills & Pay', icon: '💳' },
    { id: 'package', label: 'Tracking', icon: '📦' },
    { id: 'task', label: 'Tasks', icon: '📋' },
    { id: 'contact', label: 'Contacts', icon: '👤' },
    { id: 'event', label: 'Events', icon: '📅' },
  ];

  const filteredPresets = (() => {
    if (selectedCategoryTab !== 'all') {
      return SAMPLE_SCREENSHOTS.filter(
        (s) => s.category === selectedCategoryTab || (selectedCategoryTab === 'ticket' && s.category === 'travel')
      );
    }
    // Balanced layout for 11 cases:
    // 4 items on top (2 pairs across left and right)
    // Consulting Document in the middle spanning both columns
    // 6 items below (3 pairs across left and right)
    // Results in equal cards on both sides with the document centered in the middle
    const firstFour = SAMPLE_SCREENSHOTS.slice(0, 4);
    const consultingDoc = SAMPLE_SCREENSHOTS.find((s) => s.id === 'sample-document-11');
    const remaining = SAMPLE_SCREENSHOTS.slice(4, 10);
    return consultingDoc ? [...firstFour, consultingDoc, ...remaining] : SAMPLE_SCREENSHOTS.slice(0, 11);
  })();

  return (
    <div className="space-y-5 pb-8 animate-fadeIn select-none">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* App Greeting & Headline */}
      <div className="pt-1 text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#EDEDED]">
          Turn screenshots into instant actions
        </h1>
        <p className="text-[#888888] text-xs max-w-sm mx-auto">
          Capture flights, bills, packages, tasks &amp; contacts. We extract and structure them automatically.
        </p>
      </div>

      {/* Optional In-App Error Notification */}
      {errorMessage && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/60 border border-rose-800/50 text-rose-200 text-xs shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 text-rose-400 hover:text-rose-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary Capture Card & Dropzone */}
      <div
        id="dropzone-screenshot"
        className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 text-center overflow-hidden border ${
          isDraggingOverWindow
            ? 'border-2 border-dashed border-blue-400 bg-blue-950/40 shadow-2xl shadow-blue-500/30 ring-4 ring-blue-500/20 scale-[1.01]'
            : 'border-[#222] bg-[#0E0E0E] hover:border-[#333] shadow-xl'
        }`}
      >
        {/* Visual Drag-and-Drop Indicator (when file dragged over window) */}
        {isDraggingOverWindow && (
          <div
            id="drag-and-drop-window-indicator"
            className="absolute inset-0 z-30 rounded-3xl border-2 border-dashed border-blue-400 bg-[#070F1E]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center shadow-2xl animate-fadeIn pointer-events-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-dashed border-blue-400/80 flex items-center justify-center text-blue-300 shadow-xl mb-3 animate-bounce">
              <FileUp className="w-8 h-8 text-blue-300" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Drop screenshot to analyze</h3>
            <p className="text-xs text-blue-200 mt-1">Instant multimodal AI extraction</p>
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Action Dock: 3 Prominent Mobile App Buttons */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm">
            {/* 1. Camera Scan */}
            <button
              id="btn-action-camera"
              onClick={onOpenCamera}
              className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#222] hover:border-blue-500/40 text-[#EDEDED] transition-all group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform mb-1.5">
                <Camera className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-white">Camera</span>
              <span className="text-[10px] text-[#777]">Live Scan</span>
            </button>

            {/* 2. Photo Gallery / Upload */}
            <button
              id="btn-action-gallery"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#222] hover:border-blue-500/40 text-[#EDEDED] transition-all group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform mb-1.5">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-white">Photos</span>
              <span className="text-[10px] text-[#777]">Upload File</span>
            </button>

            {/* 3. Paste Clipboard */}
            <button
              id="btn-action-paste"
              onClick={handlePasteFromClipboard}
              className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#222] hover:border-emerald-500/40 text-[#EDEDED] transition-all group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform mb-1.5">
                <Clipboard className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-white">Paste</span>
              <span className="text-[10px] text-[#777]">Clipboard</span>
            </button>
          </div>

          {/* Quick Drop Area Prompt */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm py-2.5 px-4 rounded-xl border border-dashed border-[#262626] hover:border-[#383838] bg-[#0A0A0A]/50 text-center cursor-pointer transition-colors"
          >
            <p className="text-[11px] text-[#888]">
              or drag &amp; drop screenshot anywhere here
            </p>
          </div>
        </div>
      </div>

      {/* Preset Category Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Demo Cases</span>
          </span>
          <span className="text-[10px] text-blue-400 font-medium">
            Tap to test instant AI
          </span>
        </div>

        {/* Horizontal Category Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryChips.map((chip) => {
            const isSelected = selectedCategoryTab === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategoryTab(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                    : 'bg-[#121212] border-[#222] text-[#888] hover:text-[#EDEDED] hover:bg-[#181818]'
                }`}
              >
                {chip.icon && <span className="mr-1">{chip.icon}</span>}
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Demo Cards - Balanced Mobile App Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredPresets.map((sample) => {
            const isMiddleDoc = sample.id === 'sample-document-11' && selectedCategoryTab === 'all';
            return (
              <button
                key={sample.id}
                id={`btn-sample-${sample.id}`}
                onClick={() => onSelectPreset(sample)}
                className={`flex items-center space-x-2.5 p-2.5 rounded-2xl bg-[#121212] border border-[#222] hover:border-blue-500/40 hover:bg-[#181818] text-left transition-all group active:scale-[0.98] shadow-sm relative overflow-hidden ${
                  isMiddleDoc
                    ? 'col-span-2 bg-[#13151D] border-blue-500/30 hover:border-blue-400/50 py-3'
                    : ''
                }`}
              >
                {/* Thumbnail / Image Preview */}
                <div className="relative w-11 h-11 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                  <img
                    src={sample.imageSrc}
                    alt={sample.title}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-[#000]/25 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      {getCategoryIcon(sample.category)}
                    </div>
                  </div>
                </div>

                {/* Info & Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-md border border-blue-500/20">
                      {sample.category}
                    </span>
                    {sample.presetBadge && (
                      <span className="text-[9px] text-[#888] truncate">
                        {sample.presetBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#EDEDED] truncate group-hover:text-blue-400">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-[#777] truncate mt-0.5">
                    {sample.extractedEntities?.[0]?.value || sample.summary || 'Tap to test actions'}
                  </div>
                </div>

                {/* Action indicator arrow */}
                <div className="w-6 h-6 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#555] group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors flex-shrink-0">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Analyzed Screenshots Section */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold text-[#666] uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recent Library</span>
          </span>
          <span className="text-[11px] text-[#888]">{recentScreenshots.length} total</span>
        </div>

        {recentScreenshots.length === 0 ? (
          <div className="p-5 rounded-2xl bg-[#111] border border-[#222] text-center space-y-1">
            <p className="text-xs text-[#EDEDED] font-medium">No screenshots yet</p>
            <p className="text-[11px] text-[#777]">
              Scan with camera or pick a demo case above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentScreenshots.slice(0, 3).map((item) => (
              <div
                key={item.id}
                id={`card-recent-${item.id}`}
                onClick={() => onOpenRecent(item)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#111] border border-[#222] hover:border-[#333] hover:bg-[#151515] cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {/* Thumbnail / Category Icon */}
                  <div className="relative w-11 h-11 rounded-xl bg-[#1A1A1A] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#262626]">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/35 flex items-center justify-center">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[#EDEDED] truncate group-hover:text-blue-400">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#888] truncate mt-0.5">
                      {item.extractedEntities[0]?.value || item.summary}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center space-x-2 pl-2">
                  <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 font-semibold">
                    {item.suggestedActions.length} Actions
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#EDEDED] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice Card */}
      <div className="p-3 rounded-2xl bg-[#101010] border border-[#202020] flex items-center space-x-2.5 text-[#888] text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span className="text-[11px]">Secure in-app vision processing with local vault storage.</span>
      </div>
    </div>
  );
};
