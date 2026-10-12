import React, { useState } from 'react';
import { X, Plus, Trash2, Check, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { ScreenshotItem, ExtractedEntity, CategoryType, EntityProvenance } from '../types';

interface EditExtractionModalProps {
  screenshot: ScreenshotItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ScreenshotItem) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'ticket', label: 'Ticket / Flight' },
  { id: 'payment', label: 'Payment / Bill' },
  { id: 'receipt', label: 'Receipt / Warranty' },
  { id: 'package', label: 'Package Delivery' },
  { id: 'address', label: 'Address / Place' },
  { id: 'task', label: 'Task / Deadline' },
  { id: 'event', label: 'Event / Meeting' },
  { id: 'contact', label: 'Contact / vCard' },
  { id: 'link', label: 'Web Link' },
  { id: 'github', label: 'GitHub Repository' },
  { id: 'document', label: 'Document' },
];

export const EditExtractionModal: React.FC<EditExtractionModalProps> = ({
  screenshot,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(screenshot.title);
  const [category, setCategory] = useState<CategoryType>(screenshot.category);
  const [summary, setSummary] = useState(screenshot.summary);
  const [entities, setEntities] = useState<ExtractedEntity[]>([...screenshot.extractedEntities]);

  // New entity input
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleEntityChange = (index: number, field: keyof ExtractedEntity, val: any) => {
    const updated = [...entities];
    updated[index] = { ...updated[index], [field]: val };
    setEntities(updated);
  };

  const handleRemoveEntity = (index: number) => {
    setEntities(entities.filter((_, i) => i !== index));
  };

  const handleAddEntity = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    const newEntity: ExtractedEntity = {
      key: newLabel.toLowerCase().replace(/\s+/g, '_'),
      label: newLabel.trim(),
      value: newValue.trim(),
      type: 'text',
      isEditable: true,
      provenance: 'extracted',
    };
    setEntities([...entities, newEntity]);
    setNewLabel('');
    setNewValue('');
  };

  const handleSaveAll = () => {
    const updated: ScreenshotItem = {
      ...screenshot,
      title: title.trim() || screenshot.title,
      category,
      summary: summary.trim() || screenshot.summary,
      extractedEntities: entities,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#141414] border border-[#2A2A2A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#222] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Edit Extracted Information</h3>
            <p className="text-xs text-[#888]">Correct fields before saving or executing actions</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#888] hover:text-white hover:bg-[#222] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title & Category Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777] block mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777] block mb-1">
                Detected Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#777] block mb-1">
              Summary / Notes
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Entities List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#777]">
                Extracted Entities &amp; Values
              </span>
              <span className="text-[10px] text-[#555]">{entities.length} fields</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {entities.map((entity, idx) => (
                <div
                  key={entity.key + idx}
                  className="p-3 rounded-2xl bg-[#0D0D0D] border border-[#222] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{entity.label}</span>
                    <div className="flex items-center space-x-2">
                      <select
                        value={entity.provenance || 'extracted'}
                        onChange={(e) =>
                          handleEntityChange(idx, 'provenance', e.target.value as EntityProvenance)
                        }
                        className="text-[10px] bg-[#161616] text-[#AAA] border border-[#333] rounded-lg px-2 py-0.5 focus:outline-none"
                      >
                        <option value="extracted">Extracted</option>
                        <option value="inferred">AI Inferred</option>
                        <option value="verified">Verified</option>
                      </select>
                      <button
                        onClick={() => handleRemoveEntity(idx)}
                        className="p-1 rounded-lg text-[#666] hover:text-rose-400 hover:bg-[#1A1A1A] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={entity.value}
                    onChange={(e) => handleEntityChange(idx, 'value', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add New Custom Field */}
          <div className="p-3 rounded-2xl bg-[#090909] border border-dashed border-[#2A2A2A] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block">
              + Add Custom Field
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Field label (e.g. Gate, Seat)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-white placeholder-[#555] focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Value (e.g. 14B)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs text-white placeholder-[#555] focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleAddEntity}
              disabled={!newLabel.trim() || !newValue.trim()}
              className="w-full py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222] disabled:opacity-40 text-xs text-white font-medium flex items-center justify-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#222] bg-[#0E0E0E] flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
