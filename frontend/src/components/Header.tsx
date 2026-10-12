import React from 'react';
import { UserSettings, AuthUser, ActiveTab, ViewMode } from '../types';
import { SnapActionLogo } from './SnapActionLogo';
import { LogIn, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  settings?: UserSettings;
  onUpdateSettings?: (newSettings: Partial<UserSettings>) => void;
  onOpenOnboarding?: () => void;
  serverOnline?: boolean;
  onTriggerUpload?: () => void;
  onTriggerCamera?: () => void;
  onTriggerSplash?: () => void;
  authUser?: AuthUser | null;
  onOpenLogin?: () => void;
  onSelectTab?: (tab: ActiveTab) => void;
  viewMode?: ViewMode;
  activeTab?: ActiveTab;
  onBack?: () => void;
  screenTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onTriggerCamera,
  onTriggerSplash,
  authUser,
  onOpenLogin,
  onSelectTab,
  viewMode = 'home',
  onBack,
  screenTitle,
}) => {
  const isDetailView = viewMode === 'result' || viewMode === 'error';

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0A0A0A]/90 border-b border-[#1A1A1A] transition-colors select-none">
      <div className="w-full px-4 h-14 flex items-center justify-between">
        {/* Left Section: Back Button (if detail view) OR Brand Logo */}
        {isDetailView ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              id="btn-header-back"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#262626] text-xs font-semibold text-[#EDEDED] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Back</span>
            </button>
            <span className="text-xs font-bold text-[#888] truncate max-w-[140px] sm:max-w-xs">
              {screenTitle || 'Screenshot Details'}
            </span>
          </div>
        ) : (
          <button
            onClick={() => {
              if (onSelectTab) onSelectTab('home');
              if (onTriggerSplash) onTriggerSplash();
            }}
            title="SnapAction App"
            className="flex items-center space-x-2.5 group cursor-pointer text-left focus:outline-none"
          >
            <SnapActionLogo size="sm" withGlow={true} className="group-hover:scale-105 transition-transform" />
            <span className="font-bold tracking-tight text-base sm:text-lg text-[#EDEDED] group-hover:text-white transition-colors">
              SnapAction
            </span>
          </button>
        )}

        {/* Right Section: Auth / Profile */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Auth Button / Profile Avatar */}
          {authUser ? (
            <button
              onClick={() => onSelectTab && onSelectTab('profile')}
              title={`Logged in as ${authUser.name}`}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full bg-[#111726] border border-[#1E293B] hover:border-cyan-500/40 text-xs text-[#E2E8F0] hover:text-white transition-all cursor-pointer"
            >
              {authUser.avatarUrl ? (
                <img
                  src={authUser.avatarUrl}
                  alt={authUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-cyan-400/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-cyan-600/30 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="max-w-[80px] sm:max-w-[100px] truncate font-medium hidden sm:inline">
                {authUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              id="btn-header-login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
