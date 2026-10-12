import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  CalendarPlus,
  Bell,
  Navigation,
  CreditCard,
  Package,
  CheckSquare,
  PhoneCall,
  Copy,
  Share2,
  ZoomIn,
  Mail,
  ExternalLink,
  Github,
  Bookmark,
  Archive,
  Trash2,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { ScreenshotItem, SuggestedAction, ExtractedEntity } from '../types';
import { ResourceCard } from './cards/ResourceCard';
import { EditExtractionModal } from './EditExtractionModal';
import { ImageLightboxModal } from './ImageLightboxModal';
import { ProvenanceBadge } from './cards/ProvenanceBadge';

interface ResultViewProps {
  screenshot: ScreenshotItem;
  onBack: () => void;
  onExecuteAction: (action: SuggestedAction) => void;
  onOpenAskAi: () => void;
  onUpdateEntity: (entityKey: string, newValue: string) => void;
  onUpdateScreenshot?: (updated: ScreenshotItem) => void;
  onToggleSaveLibrary?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onDeleteScreenshot?: (id: string) => void;
  onUploadNew?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  screenshot,
  onBack,
  onExecuteAction,
  onOpenAskAi,
  onUpdateEntity,
  onUpdateScreenshot,
  onToggleSaveLibrary,
  onToggleArchive,
  onDeleteScreenshot,
  onUploadNew,
}) => {
  const [isScreenshotCollapsed, setIsScreenshotCollapsed] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleStartEdit = (entity: ExtractedEntity) => {
    setEditingKey(entity.key);
    setEditValue(entity.value);
  };

  const handleSaveEdit = (key: string) => {
    onUpdateEntity(key, editValue);
    setEditingKey(null);
  };

  const handleCopyText = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'calendar':
        return <CalendarPlus className="w-5 h-5 text-blue-400" />;
      case 'reminder':
        return <Bell className="w-5 h-5 text-amber-400" />;
      case 'map':
        return <Navigation className="w-5 h-5 text-sky-400" />;
      case 'pay':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      case 'track':
        return <Package className="w-5 h-5 text-amber-400" />;
      case 'task':
        return <CheckSquare className="w-5 h-5 text-blue-400" />;
      case 'call':
        return <PhoneCall className="w-5 h-5 text-teal-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-teal-400" />;
      case 'contact':
        return <Check className="w-5 h-5 text-teal-400" />;
      case 'open_github':
        return <Github className="w-5 h-5 text-purple-400" />;
      case 'open_link':
        return <ExternalLink className="w-5 h-5 text-sky-400" />;
      case 'copy':
        return <Copy className="w-5 h-5 text-[#EDEDED]" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Top Bar with Back, Ask AI, and Edit Modal buttons */}
      <div className="flex items-center justify-between">
        <button
          id="btn-result-back"
          onClick={onBack}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-[#EDEDED] hover:bg-[#1A1A1A] text-xs font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onUploadNew && (
            <button
              id="btn-result-upload-new"
              onClick={onUploadNew}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all shadow-sm"
              title="Upload another screenshot"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          )}

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-[#BBB] hover:text-white hover:bg-[#1E1E1E] text-xs font-semibold transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Edit Fields</span>
            <span className="xs:hidden">Edit</span>
          </button>

          <button
            id="btn-ask-ai-screenshot"
            onClick={onOpenAskAi}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#141414] border border-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Main Result Header */}
      <div className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-light text-[#EDEDED] tracking-tight">
          {screenshot.title}
        </h1>
        <p className="text-[#888] text-xs sm:text-sm">
          {screenshot.summary}
        </p>
      </div>

      {/* FEATURE ONE: Structured AI Resource Card (Category Specific) */}
      <ResourceCard
        screenshot={screenshot}
        onExecuteAction={onExecuteAction}
        onOpenEditModal={() => setIsEditModalOpen(true)}
        onToggleSaveLibrary={onToggleSaveLibrary}
        onToggleArchive={onToggleArchive}
        onDelete={onDeleteScreenshot}
        onViewScreenshot={() => setIsLightboxOpen(true)}
      />

      {/* Collapsible Original Screenshot Card with Lightbox Zoom */}
      <div className="rounded-2xl bg-[#111] border border-[#222] overflow-hidden shadow-lg">
        <button
          onClick={() => setIsScreenshotCollapsed(!isScreenshotCollapsed)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-[#EDEDED] hover:bg-[#161616] transition-colors"
        >
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#555] uppercase tracking-widest font-bold">
              Original Screenshot
            </span>
            <span className="text-[9px] text-blue-400 uppercase font-bold tracking-widest bg-[#1A1A1A] px-2 py-0.5 rounded-full border border-blue-900/30">
              OCR Verified
            </span>
          </div>
          <div className="flex items-center space-x-1 text-[#888]">
            <span>{isScreenshotCollapsed ? 'Show' : 'Hide'}</span>
            {isScreenshotCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {!isScreenshotCollapsed && (
          <div className="relative p-3 bg-[#050505] border-t border-[#1A1A1A] flex flex-col items-center">
            <div className="relative max-h-64 sm:max-h-72 rounded-xl overflow-hidden shadow-inner border border-[#222] group">
              <img
                src={screenshot.imageSrc}
                alt="Analyzed Screenshot"
                className="max-h-64 sm:max-h-72 w-auto object-contain cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-[10px] font-semibold border border-white/20 flex items-center space-x-1 transition-all"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Zoom / Inspect</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FEATURE THREE: Context-Aware Action Engine */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
            Recommended Actions
          </h2>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
            Review &amp; Execute
          </span>
        </div>

        <div className="space-y-2.5">
          {screenshot.suggestedActions.map((action) => {
            const isExecuted = screenshot.executedActions?.some(
              (ea) => ea.actionId === action.id
            );

            return (
              <div
                key={action.id}
                id={`action-card-${action.id}`}
                className={`relative rounded-2xl p-4 transition-all duration-200 border ${
                  action.isPrimary
                    ? 'bg-[#111] border-blue-600/50 shadow-xl shadow-blue-950/20'
                    : 'bg-[#111] border-[#222] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        action.isPrimary
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-600/30'
                          : 'bg-[#1A1A1A] text-[#EDEDED] border border-[#262626]'
                      }`}
                    >
                      {getActionIcon(action.actionType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-[#EDEDED]">
                          {action.title}
                        </span>
                        {action.isPrimary && (
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#888] truncate mt-0.5">
                        {action.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Action Execution Button */}
                  <div className="pl-3">
                    {isExecuted ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-800/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <button
                        id={`btn-exec-${action.id}`}
                        onClick={() => onExecuteAction(action)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md active:scale-95 flex items-center space-x-1.5 ${
                          action.isPrimary
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                            : 'bg-[#1A1A1A] hover:bg-[#222] text-[#EDEDED] border border-[#262626]'
                        }`}
                      >
                        <span>Execute</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURE TWO: Editable AI Extraction Results with Provenance Badges */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
              Extracted Entities &amp; Provenance
            </h2>
            <span className="text-[10px] text-[#555]">
              Distinguishes direct OCR vs AI inferred vs verified data
            </span>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[10px] text-blue-400 hover:underline font-bold uppercase tracking-wider"
          >
            Edit All Fields
          </button>
        </div>

        <div className="rounded-2xl bg-[#111] border border-[#222] divide-y divide-[#1A1A1A] overflow-hidden">
          {screenshot.extractedEntities.map((entity) => {
            const isEditing = editingKey === entity.key;

            return (
              <div
                key={entity.key}
                className="p-3.5 flex items-center justify-between hover:bg-[#161616] transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-[#666] uppercase tracking-wider">
                      {entity.label}
                    </span>
                    <ProvenanceBadge
                      provenance={entity.provenance || 'extracted'}
                      confidence={entity.confidence}
                      compact
                    />
                    {entity.isWarning && (
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        Needs Check
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        className="w-full text-xs font-medium bg-[#050505] border border-blue-500 rounded-lg px-2.5 py-1 text-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveEdit(entity.key)}
                        className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#EDEDED] block mt-0.5 break-words font-mono">
                      {entity.value}
                    </span>
                  )}
                </div>

                {/* Edit & Copy actions */}
                {!isEditing && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleCopyText(entity.key, entity.value)}
                      title="Copy value"
                      className="p-1.5 rounded-lg text-[#888] hover:text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors"
                    >
                      {copiedKey === entity.key ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {entity.isEditable && (
                      <button
                        onClick={() => handleStartEdit(entity)}
                        title="Edit value"
                        className="p-1.5 rounded-lg text-[#888] hover:text-blue-400 hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Extraction Modal */}
      <EditExtractionModal
        screenshot={screenshot}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => {
          if (onUpdateScreenshot) {
            onUpdateScreenshot(updated);
          }
        }}
      />

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        imageSrc={screenshot.imageSrc}
        title={screenshot.title}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
};
