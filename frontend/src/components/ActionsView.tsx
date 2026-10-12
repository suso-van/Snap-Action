import React, { useState } from 'react';
import {
  Zap,
  Calendar,
  Bell,
  Package,
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  Download,
  Trash2,
  Check,
  ChevronRight,
  Truck,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { ExecutedAction, ActionType } from '../types';
import { downloadIcsFile, getGoogleCalendarUrl } from '../utils/calendar';

interface ActionsViewProps {
  actions: ExecutedAction[];
  onToggleComplete: (actionId: string) => void;
  onDeleteAction: (actionId: string) => void;
  onOpenScreenshot: (screenshotId: string) => void;
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  actions,
  onToggleComplete,
  onDeleteAction,
  onOpenScreenshot,
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'tasks' | 'calendar' | 'packages' | 'completed'>('all');

  const upcomingTasks = actions.filter(
    (a) => (a.actionType === 'reminder' || a.actionType === 'task' || a.actionType === 'pay') && a.status === 'active'
  );

  const calendarEvents = actions.filter((a) => a.actionType === 'calendar');
  const packagesList = actions.filter((a) => a.actionType === 'track');
  const completedActions = actions.filter((a) => a.status === 'completed');

  const getFilteredList = () => {
    switch (activeSection) {
      case 'tasks':
        return upcomingTasks;
      case 'calendar':
        return calendarEvents;
      case 'packages':
        return packagesList;
      case 'completed':
        return completedActions;
      default:
        return actions;
    }
  };

  const handleDownloadCalendar = (action: ExecutedAction) => {
    downloadIcsFile({
      title: action.details.eventTitle || action.title,
      startDate: action.details.datetime,
      endDate: action.details.endDate,
      location: action.details.location,
      description: action.details.notes,
    });
  };

  const handleOpenGoogleCalendar = (action: ExecutedAction) => {
    const url = getGoogleCalendarUrl({
      title: action.details.eventTitle || action.title,
      startDate: action.details.datetime,
      endDate: action.details.endDate,
      location: action.details.location,
      description: action.details.notes,
    });
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = getFilteredList();

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-blue-400" />;
      case 'track':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'pay':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-8 animate-fadeIn select-none">
      {/* App Header & Title */}
      <div className="pt-1">
        <h1 className="text-xl font-semibold text-[#EDEDED] tracking-tight">Actions &amp; Automations</h1>
        <p className="text-xs text-[#888]">
          Calendar events, reminders &amp; delivery trackers created from screenshots
        </p>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-[#111] border border-[#222] text-center">
          <div className="text-lg font-bold text-blue-400">{upcomingTasks.length}</div>
          <div className="text-[10px] text-[#777] font-medium">Pending Tasks</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#111] border border-[#222] text-center">
          <div className="text-lg font-bold text-cyan-400">{calendarEvents.length}</div>
          <div className="text-[10px] text-[#777] font-medium">Calendar Invites</div>
        </div>
        <div className="p-3 rounded-2xl bg-[#111] border border-[#222] text-center">
          <div className="text-lg font-bold text-amber-400">{packagesList.length}</div>
          <div className="text-[10px] text-[#777] font-medium">Packages</div>
        </div>
      </div>

      {/* Segmented Control Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: `All (${actions.length})` },
          { id: 'tasks', label: `Tasks (${upcomingTasks.length})` },
          { id: 'calendar', label: `Calendar (${calendarEvents.length})` },
          { id: 'packages', label: `Packages (${packagesList.length})` },
          { id: 'completed', label: `Completed (${completedActions.length})` },
        ].map((tab) => {
          const isSelected = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                  : 'bg-[#111] border-[#222] text-[#888] hover:text-[#EDEDED] hover:bg-[#161616]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action Items List */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#111]/40 border border-[#222] text-center space-y-2 my-3">
          <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#262626] flex items-center justify-center text-[#555] mx-auto">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#EDEDED]">No items in this section</h3>
            <p className="text-xs text-[#777] mt-0.5">
              Actions will appear here when you execute them from your screenshots.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((action) => {
            const isCompleted = action.status === 'completed';
            return (
              <div
                key={action.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#0E0E0E] border-[#1C1C1C] opacity-75'
                    : 'bg-[#121212] border-[#222] hover:border-[#333]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Checkbox to toggle completed */}
                  <button
                    onClick={() => onToggleComplete(action.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-[#333] bg-[#1A1A1A] hover:border-blue-500'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Body Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-semibold ${
                          isCompleted ? 'line-through text-[#777]' : 'text-white'
                        }`}
                      >
                        {action.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1C1C1C] text-[#888] font-medium capitalize">
                        {action.actionType}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#888] mt-1">
                      {action.description}
                    </p>

                    {/* Details Pill (date, location, tracking #) */}
                    {(action.details.datetime || action.details.trackingNumber || action.details.amount) && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-[#AAA]">
                        {action.details.datetime && (
                          <span className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626]">
                            🕒 {action.details.datetime}
                          </span>
                        )}
                        {action.details.trackingNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626]">
                            📦 #{action.details.trackingNumber}
                          </span>
                        )}
                        {action.details.amount && (
                          <span className="px-2 py-0.5 rounded-md bg-[#181818] border border-[#262626] text-emerald-400">
                            💰 {action.details.amount}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Execution Triggers */}
                    <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-[#1E1E1E]">
                      {action.actionType === 'calendar' && (
                        <>
                          <button
                            onClick={() => handleOpenGoogleCalendar(action)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[10px] font-semibold transition-colors"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Google Calendar</span>
                          </button>
                          <button
                            onClick={() => handleDownloadCalendar(action)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-[#CCC] text-[10px] font-semibold transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>.ICS File</span>
                          </button>
                        </>
                      )}

                      {action.details.url && (
                        <a
                          href={action.details.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[10px] font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Link</span>
                        </a>
                      )}

                      {/* Jump to screenshot source */}
                      {action.screenshotId && (
                        <button
                          onClick={() => onOpenScreenshot(action.screenshotId)}
                          className="text-[10px] text-[#777] hover:text-blue-400 transition-colors ml-auto flex items-center space-x-1"
                        >
                          <span>View Screenshot</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteAction(action.id)}
                    className="p-1.5 text-[#555] hover:text-rose-400 transition-colors"
                    title="Delete action"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
