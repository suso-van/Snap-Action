import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Calendar,
  MapPin,
  Package,
  Trash2,
  Download,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  EyeOff,
  Cpu,
  Play,
} from 'lucide-react';
import { UserSettings, ScreenshotItem, ExecutedAction, AuthUser } from '../types';
import { SnapActionLogo } from './SnapActionLogo';
import { LogOut } from 'lucide-react';

interface ProfileViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  screenshots: ScreenshotItem[];
  executedActions: ExecutedAction[];
  onClearAllData: () => void;
  onTriggerSplash?: () => void;
  authUser?: AuthUser | null;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onUpdateSettings,
  screenshots,
  executedActions,
  onClearAllData,
  onTriggerSplash,
  authUser,
  onLogout,
}) => {
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      app: 'SnapAction',
      version: '1.0.0',
      settings,
      screenshots: screenshots.map((s) => ({
        id: s.id,
        timestamp: s.timestamp,
        title: s.title,
        category: s.category,
        summary: s.summary,
        confidenceScore: s.confidenceScore,
        extractedEntities: s.extractedEntities,
        executedActions: s.executedActions,
      })),
      executedActions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapaction-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportMessage('Data exported successfully!');
    setTimeout(() => setExportMessage(null), 3000);
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn select-none">
      {/* Screen Title */}
      <div className="pt-1">
        <h1 className="text-xl font-semibold text-[#EDEDED] tracking-tight">Profile &amp; Settings</h1>
        <p className="text-xs text-[#888]">
          Manage your account, device interface, and automation settings
        </p>
      </div>

      {/* Account Section Card */}
      <div className="p-4 rounded-3xl bg-[#111] border border-[#222] shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3.5 min-w-0">
          {authUser?.avatarUrl ? (
            <img
              src={authUser.avatarUrl}
              alt={authUser.name}
              className="w-12 h-12 rounded-2xl object-cover border border-cyan-400/40 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-blue-600/30 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-base flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white truncate">
                {authUser ? authUser.name : 'Guest User'}
              </span>
              {authUser && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                  {authUser.provider}
                </span>
              )}
            </div>
            <p className="text-xs text-[#888] truncate mt-0.5">
              {authUser ? authUser.email : 'Sign in to sync screenshots & actions across devices'}
            </p>
          </div>
        </div>

        <div>
          {authUser && (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222] text-[#888] hover:text-white border border-[#262626] text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Automation Preferences */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#666] px-1">
          AI Automations &amp; Actions
        </h2>
        <div className="p-3.5 rounded-2xl bg-[#111] border border-[#222] space-y-3">
          {/* Auto detect */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Auto-Detect Triggers</div>
              <div className="text-[10px] text-[#777]">Synthesize calendar, bills &amp; deliveries automatically</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoDetectActions}
              onChange={(e) => onUpdateSettings({ autoDetectActions: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 accent-blue-600"
            />
          </div>

          <div className="h-px bg-[#1C1C1C]" />

          {/* Default Calendar */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Default Calendar</div>
              <div className="text-[10px] text-[#777]">Service used for event invites</div>
            </div>
            <select
              value={settings.defaultCalendar}
              onChange={(e) => onUpdateSettings({ defaultCalendar: e.target.value as any })}
              className="bg-[#181818] border border-[#262626] rounded-xl px-2.5 py-1 text-xs text-[#EDEDED] focus:outline-none"
            >
              <option value="google">Google Calendar</option>
              <option value="apple">Apple / .ICS File</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Vault & Storage */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#666] px-1">
          Storage Vault &amp; Backup
        </h2>
        <div className="p-3.5 rounded-2xl bg-[#111] border border-[#222] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888]">Saved Screenshots</span>
            <span className="font-semibold text-white">{screenshots.length} items</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888]">Executed Actions</span>
            <span className="font-semibold text-white">{executedActions.length} actions</span>
          </div>

          <div className="h-px bg-[#1C1C1C]" />

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleExportData}
              className="flex-1 py-2 rounded-xl bg-[#181818] hover:bg-[#202020] border border-[#262626] text-xs font-semibold text-[#EDEDED] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            <button
              onClick={onClearAllData}
              className="py-2 px-3 rounded-xl bg-[#181818] hover:bg-rose-950/40 border border-[#262626] hover:border-rose-800/40 text-xs font-semibold text-[#888] hover:text-rose-300 transition-colors"
              title="Reset data"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {exportMessage && (
            <p className="text-[11px] text-emerald-400 text-center font-medium">
              {exportMessage}
            </p>
          )}
        </div>
      </div>

      {/* App Info */}
      <div className="p-3.5 rounded-2xl bg-[#101010] border border-[#202020] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <SnapActionLogo size="sm" withGlow={false} />
          <div>
            <div className="text-xs font-semibold text-white">SnapAction v1.0.0</div>
            <div className="text-[10px] text-[#777]">Multimodal Screenshot Intelligence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
