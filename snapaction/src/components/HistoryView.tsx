import React, { useState } from 'react';
import {
  Search,
  Plane,
  CreditCard,
  Package,
  MapPin,
  CheckSquare,
  Sparkles,
  Calendar,
  Trash2,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Bookmark,
  Archive,
  User,
  Link2,
  Github,
  FileText,
  Grid,
  List,
  Star,
} from 'lucide-react';
import { ScreenshotItem, HistoryFilter } from '../types';

interface HistoryViewProps {
  screenshots: ScreenshotItem[];
  onSelectScreenshot: (item: ScreenshotItem) => void;
  onDeleteScreenshot: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onToggleSaveLibrary?: (id: string, e: React.MouseEvent) => void;
  onToggleArchive?: (id: string, e: React.MouseEvent) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  screenshots,
  onSelectScreenshot,
  onDeleteScreenshot,
  onClearAll,
  onToggleSaveLibrary,
  onToggleArchive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');

  const filterCategories: { id: HistoryFilter; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'saved', label: 'Starred ★' },
    { id: 'ticket', label: 'Flights ✈️' },
    { id: 'payment', label: 'Bills 💳' },
    { id: 'package', label: 'Packages 📦' },
    { id: 'task', label: 'Tasks 📋' },
    { id: 'contact', label: 'Contacts 👤' },
    { id: 'event', label: 'Events 📅' },
    { id: 'archived', label: 'Archived 🗄️' },
  ];

  const filteredScreenshots = screenshots.filter((item) => {
    // Archived filter
    if (selectedFilter === 'archived') {
      if (!item.isArchived) return false;
    } else {
      // By default hide archived unless specifically in archived tab
      if (item.isArchived && selectedFilter !== 'all') return false;
    }

    // Library filter
    if (selectedFilter === 'saved') {
      if (!item.isSavedToLibrary) return false;
    } else if (selectedFilter !== 'all' && selectedFilter !== 'archived') {
      if (item.category !== selectedFilter && !(selectedFilter === 'ticket' && item.category === 'travel')) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      const matchEntities = item.extractedEntities.some(
        (e) => e.value.toLowerCase().includes(q) || e.label.toLowerCase().includes(q)
      );
      const matchOcr = item.ocrText?.toLowerCase().includes(q);
      return matchTitle || matchSummary || matchEntities || matchOcr;
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ticket':
      case 'travel':
        return <Plane className="w-3.5 h-3.5 text-rose-400" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      case 'receipt':
        return <span className="text-xs">🧾</span>;
      case 'package':
        return <Package className="w-3.5 h-3.5 text-amber-400" />;
      case 'address':
        return <MapPin className="w-3.5 h-3.5 text-sky-400" />;
      case 'task':
        return <CheckSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'event':
        return <span className="text-xs">📅</span>;
      case 'contact':
        return <span className="text-xs">👤</span>;
      case 'link':
        return <span className="text-xs">🔗</span>;
      case 'github':
        return <span className="text-xs">🐙</span>;
      case 'document':
        return <span className="text-xs">📄</span>;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4 pb-8 animate-fadeIn select-none">
      {/* Top Header & View Controls */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-semibold text-[#EDEDED] tracking-tight">Library &amp; History</h1>
          <p className="text-xs text-[#888]">
            {filteredScreenshots.length} resource{filteredScreenshots.length === 1 ? '' : 's'} available
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Layout Toggle (Grid vs List) */}
          <div className="flex items-center bg-[#141414] border border-[#262626] rounded-xl p-0.5">
            <button
              onClick={() => setLayoutMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[#777] hover:text-[#EDEDED]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-[#777] hover:text-[#EDEDED]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

          {screenshots.length > 0 && (
            <button
              onClick={onClearAll}
              title="Clear all saved history"
              className="p-2 rounded-xl bg-[#141414] border border-[#262626] text-[#777] hover:text-rose-400 hover:bg-[#1A1A1A] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search screenshots, flights, amounts, tracking #..."
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#111] border border-[#222] text-xs text-[#EDEDED] placeholder-[#555] focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterCategories.map((f) => {
          const isSelected = selectedFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-[#111] border-[#222] text-[#888] hover:text-[#EDEDED] hover:bg-[#161616]'
              }`}
            >
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Rendering: Empty State or Items */}
      {filteredScreenshots.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#111]/40 border border-[#222] text-center space-y-2.5 my-4">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#555] mx-auto">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#EDEDED]">No items match</h3>
            <p className="text-xs text-[#777] max-w-xs mx-auto mt-0.5">
              {searchQuery ? 'Try another search term' : 'No screenshots saved in this category yet'}
            </p>
          </div>
        </div>
      ) : layoutMode === 'grid' ? (
        /* Visual Photo Grid View */
        <div className="grid grid-cols-2 gap-2.5">
          {filteredScreenshots.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectScreenshot(item)}
              className="group relative rounded-2xl bg-[#111] border border-[#222] hover:border-[#383838] overflow-hidden cursor-pointer transition-all active:scale-[0.98] shadow-sm flex flex-col"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] bg-[#161616] overflow-hidden">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-[#0A0A0A]/80 backdrop-blur-md border border-[#262626] flex items-center space-x-1 text-[10px] text-[#EDEDED] font-medium capitalize">
                  {getCategoryIcon(item.category)}
                  <span>{item.category}</span>
                </div>
                {item.isSavedToLibrary && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                )}
              </div>

              {/* Bottom Card Title */}
              <div className="p-2.5">
                <div className="text-xs font-semibold text-[#EDEDED] truncate group-hover:text-blue-400">
                  {item.title}
                </div>
                <div className="text-[10px] text-[#777] truncate mt-0.5">
                  {item.extractedEntities[0]?.value || item.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed List View */
        <div className="space-y-2">
          {filteredScreenshots.map((item) => (
            <div
              key={item.id}
              id={`history-item-${item.id}`}
              onClick={() => onSelectScreenshot(item)}
              className="p-3 rounded-2xl bg-[#111] border border-[#222] hover:border-[#333] hover:bg-[#151515] transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* Thumbnail Preview */}
                <div className="relative w-12 h-12 rounded-xl bg-[#1A1A1A] overflow-hidden flex items-center justify-center flex-shrink-0 border border-[#262626]">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-[#0A0A0A]/35 flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-white truncate group-hover:text-blue-400">
                      {item.title}
                    </span>
                    {item.isSavedToLibrary && (
                      <span className="text-[9px] text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded font-bold">
                        ★
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#888] truncate mt-0.5">
                    {item.extractedEntities[0]?.value || item.summary}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-[#666] mt-1">
                    <span>{formatTimestamp(item.timestamp)}</span>
                    <span>•</span>
                    <span className="capitalize">{item.category}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 pl-2">
                {onToggleSaveLibrary && (
                  <button
                    onClick={(e) => onToggleSaveLibrary(item.id, e)}
                    title={item.isSavedToLibrary ? 'Starred' : 'Star item'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.isSavedToLibrary
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-[#555] hover:text-amber-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={(e) => onDeleteScreenshot(item.id, e)}
                  title="Delete"
                  className="p-1.5 rounded-lg text-[#555] hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-[#EDEDED] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
