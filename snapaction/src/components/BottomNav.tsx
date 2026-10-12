import React from 'react';
import { Home, Clock, Zap, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  historyCount: number;
  activeActionsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  historyCount,
  activeActionsCount,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'history' as ActiveTab,
      label: 'History',
      icon: Clock,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    {
      id: 'actions' as ActiveTab,
      label: 'Actions',
      icon: Zap,
      badge: activeActionsCount > 0 ? activeActionsCount : undefined,
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="shrink-0 bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#1A1A1A] safe-bottom w-full transition-all">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-200 group ${
                isActive ? 'text-blue-500' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      : 'group-hover:bg-[#1A1A1A] group-hover:text-[#EDEDED]'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform group-active:scale-95" />
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-1.5 min-w-[17px] h-[17px] flex items-center justify-center text-[9px] font-bold text-white px-1 rounded-full ${
                      tab.badgeColor || 'bg-blue-600'
                    } shadow-md ring-2 ring-[#0A0A0A]`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] mt-1 uppercase font-bold tracking-tight ${
                  isActive ? 'text-blue-500 font-bold' : 'text-[#555]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
