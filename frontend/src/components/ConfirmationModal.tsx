import React, { useState } from 'react';
import {
  Calendar,
  Bell,
  Navigation,
  CreditCard,
  Package,
  CheckSquare,
  X,
  Sparkles,
  ExternalLink,
  Download,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';
import { SuggestedAction } from '../types';

interface ConfirmationModalProps {
  action: SuggestedAction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customOptions?: { calendarType?: 'google' | 'ics'; leadTime?: string }) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  action,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [calendarType, setCalendarType] = useState<'google' | 'ics'>('google');
  const [leadTime, setLeadTime] = useState<string>('1h');

  if (!isOpen || !action) return null;

  const getActionIcon = () => {
    switch (action.actionType) {
      case 'calendar':
        return <Calendar className="w-6 h-6 text-blue-400" />;
      case 'reminder':
        return <Bell className="w-6 h-6 text-amber-400" />;
      case 'map':
        return <Navigation className="w-6 h-6 text-sky-400" />;
      case 'pay':
        return <CreditCard className="w-6 h-6 text-emerald-400" />;
      case 'track':
        return <Package className="w-6 h-6 text-blue-400" />;
      case 'task':
        return <CheckSquare className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#222] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#262626] flex items-center justify-center">
              {getActionIcon()}
            </div>
            <div>
              <h3 className="text-base font-light text-[#EDEDED]">
                {action.title}?
              </h3>
              <p className="text-xs text-[#888]">{action.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Specific Details Preview */}
        <div className="bg-[#111] rounded-2xl p-4 border border-[#222] space-y-2.5 text-xs">
          {action.details.eventTitle && (
            <div className="flex items-center space-x-2 text-[#EDEDED] font-semibold">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>{action.details.eventTitle}</span>
            </div>
          )}

          {action.details.datetime && (
            <div className="flex items-center space-x-2 text-[#888]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{action.details.datetime.replace('T', ' · ')}</span>
            </div>
          )}

          {action.details.location && (
            <div className="flex items-center space-x-2 text-[#888]">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate">{action.details.location}</span>
            </div>
          )}

          {action.details.amount && (
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Amount: {action.details.amount}</span>
            </div>
          )}

          {action.details.trackingNumber && (
            <div className="flex items-center space-x-2 text-blue-400 font-mono">
              <Package className="w-3.5 h-3.5 text-blue-400" />
              <span>Tracking: {action.details.trackingNumber}</span>
            </div>
          )}

          {action.details.notes && (
            <p className="text-[11px] text-[#888] pt-1 border-t border-[#1A1A1A] leading-relaxed">
              {action.details.notes}
            </p>
          )}
        </div>

        {/* Configurable Option for Calendar */}
        {action.actionType === 'calendar' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest block">
              Destination Calendar
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCalendarType('google')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                  calendarType === 'google'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-[#111] border-[#222] text-[#888] hover:text-[#EDEDED]'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setCalendarType('ics')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all ${
                  calendarType === 'ics'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-[#111] border-[#222] text-[#888] hover:text-[#EDEDED]'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Apple / iCal (.ics)</span>
              </button>
            </div>
          </div>
        )}

        {/* Configurable Option for Reminder lead time */}
        {action.actionType === 'reminder' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest block">
              Alert Me Before
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '15m', label: '15 mins' },
                { id: '1h', label: '1 hour' },
                { id: '1d', label: '1 day' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLeadTime(opt.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    leadTime === opt.id
                      ? 'bg-amber-950/40 border-amber-500 text-amber-400'
                      : 'bg-[#111] border-[#222] text-[#888] hover:text-[#EDEDED]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Confirm & Cancel Buttons */}
        <div className="space-y-2 pt-1">
          <button
            id="btn-confirm-action-modal"
            onClick={() => onConfirm({ calendarType, leadTime })}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>Confirm &amp; Execute</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-[#888] hover:text-[#EDEDED] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
