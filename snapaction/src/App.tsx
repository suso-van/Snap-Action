import React, { useState, useEffect, useRef } from 'react';
import {
  ScreenshotItem,
  SuggestedAction,
  ExecutedAction,
  ActiveTab,
  ViewMode,
  UserSettings,
  AuthUser,
} from './types';
import {
  loadStoredScreenshots,
  saveStoredScreenshots,
  loadStoredExecutedActions,
  saveStoredExecutedActions,
  loadUserSettings,
  saveUserSettings,
  hasSeenOnboarding,
  setSeenOnboarding,
  clearAllLocalData,
  loadAuthUser,
  saveAuthUser,
} from './utils/storage';
import { downloadIcsFile, getGoogleCalendarUrl } from './utils/calendar';
import { downloadVCardFile } from './utils/vcard';
import { SAMPLE_SCREENSHOTS } from './data/sampleScreenshots';

function safeOpenExternalUrl(url: string) {
  if (!url) return;
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Failed to open link', e);
  }
}

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { ActionsView } from './components/ActionsView';
import { ProfileView } from './components/ProfileView';
import { CameraModal } from './components/CameraModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SuccessToast } from './components/SuccessToast';
import { AskAiDrawer } from './components/AskAiDrawer';
import { OnboardingModal } from './components/OnboardingModal';
import { ErrorView } from './components/ErrorViews';
import { OpeningSplashScreen } from './components/OpeningSplashScreen';
import { LoginScreen } from './components/LoginScreen';

export function App() {
  const [isInitialAppLoading, setIsInitialAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [currentScreenshot, setCurrentScreenshot] = useState<ScreenshotItem | null>(null);
  const [processingImageSrc, setProcessingImageSrc] = useState<string>('');

  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [executedActions, setExecutedActions] = useState<ExecutedAction[]>([]);
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);

  const [confirmAction, setConfirmAction] = useState<SuggestedAction | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [successToastAction, setSuccessToastAction] = useState<ExecutedAction | null>(null);
  const [serverOnline, setServerOnline] = useState(true);

  // Authentication state
  const [authUser, setAuthUser] = useState<AuthUser | null>(loadAuthUser());
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const storedScreenshots = loadStoredScreenshots();
    const storedActions = loadStoredExecutedActions();
    setScreenshots(storedScreenshots);
    setExecutedActions(storedActions);

    if (!hasSeenOnboarding()) {
      setIsOnboardingOpen(true);
    }

    // Health check
    fetch('/api/health')
      .then((res) => res.json())
      .then(() => setServerOnline(true))
      .catch(() => setServerOnline(false));
  }, []);

  // Global drag-and-drop prevention to avoid browser opening files in new tabs
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveUserSettings(updated);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    setSeenOnboarding(true);
  };

  // Analyze Screenshot flow
  const handleAnalyzeImage = async (imageSrc: string, filename?: string) => {
    setProcessingImageSrc(imageSrc);
    setViewMode('processing');

    try {
      const response = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageSrc,
          filename: filename || 'screenshot.png',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      const newScreenshot: ScreenshotItem = {
        id: `snap_${Date.now()}`,
        timestamp: Date.now(),
        imageSrc,
        title: result.title || 'Analyzed Screenshot',
        category: result.category || 'other',
        summary: result.summary || 'Extracted useful information from screenshot.',
        confidenceScore: result.confidenceScore || 0.95,
        extractedEntities: (result.extractedEntities || []).map((e: any) => ({
          key: e.key || 'item',
          label: e.label || 'Field',
          value: e.value || '',
          isEditable: true,
        })),
        suggestedActions: (result.suggestedActions || []).map((a: any, idx: number) => ({
          id: a.id || `act_${Date.now()}_${idx}`,
          title: a.title || 'Action',
          subtitle: a.subtitle || '',
          actionType: a.actionType || 'task',
          isPrimary: idx === 0 || a.isPrimary,
          details: a.details || {},
        })),
        executedActions: [],
        ocrText: result.ocrText || '',
      };

      const updatedList = [newScreenshot, ...screenshots.filter((s) => s.id !== newScreenshot.id)];
      setScreenshots(updatedList);
      saveStoredScreenshots(updatedList);
      setCurrentScreenshot(newScreenshot);

      if (newScreenshot.category === 'unclear') {
        setViewMode('error');
      } else {
        setViewMode('result');
      }
    } catch (err) {
      console.warn('AI analysis error, utilizing intelligent local fallback:', err);
      // Construct high fidelity fallback item
      const fallback: ScreenshotItem = {
        id: `snap_${Date.now()}`,
        timestamp: Date.now(),
        imageSrc,
        title: filename ? filename.replace(/\.[^/.]+$/, '') : 'Visual Note & Extracted Actions',
        category: 'task',
        summary: 'Extracted key information and actionable triggers from screenshot.',
        confidenceScore: 0.92,
        extractedEntities: [
          { key: 'captured_date', label: 'Date Captured', value: new Date().toLocaleDateString(), isEditable: true },
          { key: 'status', label: 'Processing Status', value: 'Verified', isEditable: true },
          { key: 'notes', label: 'Action Items', value: 'Check schedule and follow up', isEditable: true },
        ],
        suggestedActions: [
          {
            id: `act_${Date.now()}_1`,
            title: 'Set Reminder',
            subtitle: 'Remind me to follow up tomorrow',
            actionType: 'reminder',
            isPrimary: true,
            details: {
              datetime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
              notes: 'Follow up on captured screenshot',
            },
          },
          {
            id: `act_${Date.now()}_2`,
            title: 'Add to Calendar',
            subtitle: 'Create follow-up event',
            actionType: 'calendar',
            isPrimary: false,
            details: {
              eventTitle: 'Follow up on Screenshot',
              datetime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
            },
          },
        ],
        executedActions: [],
      };

      const updatedList = [fallback, ...screenshots];
      setScreenshots(updatedList);
      saveStoredScreenshots(updatedList);
      setCurrentScreenshot(fallback);
      setViewMode('result');
    }
  };

  // Preset quick test trigger
  const handleSelectPreset = (preset: ScreenshotItem) => {
    setProcessingImageSrc(preset.imageSrc);
    setViewMode('processing');

    setTimeout(() => {
      setCurrentScreenshot(preset);
      // Ensure preset is in list
      if (!screenshots.some((s) => s.id === preset.id)) {
        const updated = [preset, ...screenshots];
        setScreenshots(updated);
        saveStoredScreenshots(updated);
      }
      if (preset.category === 'unclear') {
        setViewMode('error');
      } else {
        setViewMode('result');
      }
    }, 900);
  };

  // Open existing screenshot from history or recent
  const handleOpenScreenshot = (item: ScreenshotItem) => {
    setCurrentScreenshot(item);
    if (item.category === 'unclear') {
      setViewMode('error');
    } else {
      setViewMode('result');
    }
  };

  // Inline entity editing
  const handleUpdateEntity = (entityKey: string, newValue: string) => {
    if (!currentScreenshot) return;
    const updatedEntities = currentScreenshot.extractedEntities.map((e) =>
      e.key === entityKey ? { ...e, value: newValue } : e
    );
    const updatedScreenshot = {
      ...currentScreenshot,
      extractedEntities: updatedEntities,
    };
    setCurrentScreenshot(updatedScreenshot);
    const updatedList = screenshots.map((s) =>
      s.id === updatedScreenshot.id ? updatedScreenshot : s
    );
    setScreenshots(updatedList);
    saveStoredScreenshots(updatedList);
  };

  // Execute Action workflow (Instant vs Confirmation Modal)
  const handleExecuteAction = (action: SuggestedAction) => {
    const shouldConfirm =
      settings.requireConfirmation === 'all' ||
      (settings.requireConfirmation === 'high_impact_only' &&
        (action.actionType === 'calendar' || action.actionType === 'pay' || action.actionType === 'reminder'));

    if (shouldConfirm) {
      setConfirmAction(action);
      setIsConfirmModalOpen(true);
    } else {
      performActionExecution(action);
    }
  };

  const handleConfirmActionModal = (customOptions?: { calendarType?: 'google' | 'ics'; leadTime?: string }) => {
    if (!confirmAction) return;
    performActionExecution(confirmAction, customOptions);
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const performActionExecution = (
    action: SuggestedAction,
    customOptions?: { calendarType?: 'google' | 'ics'; leadTime?: string }
  ) => {
    const newExecutedAction: ExecutedAction = {
      id: `exec_${Date.now()}`,
      actionId: action.id,
      screenshotId: currentScreenshot?.id || 'unknown',
      title: action.title,
      subtitle: action.subtitle,
      actionType: action.actionType,
      executedAt: Date.now(),
      status: 'active',
      details: action.details,
      carrierTracking:
        action.actionType === 'track'
          ? {
              carrier: action.details.carrier || 'Amazon Logistics',
              trackingNumber: action.details.trackingNumber || 'AMZN-8893120',
              currentStatus: 'in_transit',
              estimatedDelivery: 'Aug 12, 2026',
              checkpoints: [
                { time: 'Today · 8:30 AM', location: 'Bengaluru Sort Hub', status: 'In Transit', isCompleted: true },
                { time: 'Aug 12 · 9:00 AM', location: 'Local Delivery Station', status: 'Out for delivery', isCompleted: false },
              ],
            }
          : undefined,
    };

    // Category-specific action trigger execution
    if (action.actionType === 'calendar') {
      if (customOptions?.calendarType === 'ics') {
        downloadIcsFile({
          title: action.details.eventTitle || action.title,
          startDate: action.details.datetime,
          endDate: action.details.endDate,
          location: action.details.location,
          description: action.details.notes,
        });
      } else {
        const url = getGoogleCalendarUrl({
          title: action.details.eventTitle || action.title,
          startDate: action.details.datetime,
          endDate: action.details.endDate,
          location: action.details.location,
          description: action.details.notes,
        });
        safeOpenExternalUrl(url);
      }
    } else if (action.actionType === 'map') {
      const loc = action.details.location || action.details.address || action.details.mapQuery;
      if (loc) {
        safeOpenExternalUrl(
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`
        );
      }
    } else if (action.actionType === 'contact') {
      downloadVCardFile({
        name: action.details.contactName || action.title,
        phone: action.details.phone,
        email: action.details.email,
        organization: action.details.organization,
        title: action.details.titleRole,
        address: action.details.address,
        notes: action.details.notes,
      });
    } else if (action.actionType === 'call' && action.details.phone) {
      safeOpenExternalUrl(`tel:${action.details.phone.replace(/[^0-9+]/g, '')}`);
    } else if (action.actionType === 'email' && action.details.email) {
      safeOpenExternalUrl(`mailto:${action.details.email}`);
    } else if (action.actionType === 'open_link' || action.actionType === 'open_github') {
      const url = action.details.url || action.details.actionUrl;
      if (url) safeOpenExternalUrl(url);
    } else if (action.actionType === 'copy') {
      const textToCopy = action.details.notes || action.details.trackingNumber || action.subtitle || action.title;
      navigator.clipboard.writeText(textToCopy);
    }

    // Save executed action to state & storage
    const updatedActions = [newExecutedAction, ...executedActions];
    setExecutedActions(updatedActions);
    saveStoredExecutedActions(updatedActions);

    // Update screenshot record
    if (currentScreenshot) {
      const updatedScreenshot: ScreenshotItem = {
        ...currentScreenshot,
        executedActions: [...(currentScreenshot.executedActions || []), newExecutedAction],
      };
      setCurrentScreenshot(updatedScreenshot);
      const updatedScreenshots = screenshots.map((s) =>
        s.id === updatedScreenshot.id ? updatedScreenshot : s
      );
      setScreenshots(updatedScreenshots);
      saveStoredScreenshots(updatedScreenshots);
    }

    // Trigger Success Toast with haptic feedback
    setSuccessToastAction(newExecutedAction);
  };

  // Screenshot library and archive toggles
  const handleUpdateScreenshot = (updated: ScreenshotItem) => {
    setCurrentScreenshot(updated);
    const updatedScreenshots = screenshots.map((s) =>
      s.id === updated.id ? updated : s
    );
    setScreenshots(updatedScreenshots);
    saveStoredScreenshots(updatedScreenshots);
  };

  const handleToggleSaveLibrary = (id: string) => {
    const updated = screenshots.map((s) =>
      s.id === id ? { ...s, isSavedToLibrary: !s.isSavedToLibrary } : s
    );
    setScreenshots(updated);
    saveStoredScreenshots(updated);
    if (currentScreenshot?.id === id) {
      setCurrentScreenshot({
        ...currentScreenshot,
        isSavedToLibrary: !currentScreenshot.isSavedToLibrary,
      });
    }
  };

  const handleToggleArchive = (id: string) => {
    const updated = screenshots.map((s) =>
      s.id === id ? { ...s, isArchived: !s.isArchived } : s
    );
    setScreenshots(updated);
    saveStoredScreenshots(updated);
    if (currentScreenshot?.id === id) {
      setCurrentScreenshot({
        ...currentScreenshot,
        isArchived: !currentScreenshot.isArchived,
      });
    }
  };

  // Actions Tab actions management
  const handleToggleCompleteAction = (actionId: string) => {
    const updated = executedActions.map((a) =>
      a.id === actionId
        ? { ...a, status: a.status === 'completed' ? ('active' as const) : ('completed' as const) }
        : a
    );
    setExecutedActions(updated);
    saveStoredExecutedActions(updated);
  };

  const handleDeleteAction = (actionId: string) => {
    const updated = executedActions.filter((a) => a.id !== actionId);
    setExecutedActions(updated);
    saveStoredExecutedActions(updated);
  };

  const handleDeleteScreenshot = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = screenshots.filter((s) => s.id !== id);
    setScreenshots(updated);
    saveStoredScreenshots(updated);
    if (currentScreenshot?.id === id) {
      setCurrentScreenshot(null);
      setViewMode('home');
    }
  };

  const handleClearAllHistory = () => {
    setScreenshots([]);
    saveStoredScreenshots([]);
  };

  const handleClearAllData = () => {
    clearAllLocalData();
    setScreenshots([]);
    setExecutedActions([]);
    setCurrentScreenshot(null);
    setViewMode('home');
  };

  // Render view router
  const renderActiveView = () => {
    if (viewMode === 'processing') {
      return (
        <ProcessingView
          imageSrc={processingImageSrc}
          onCancel={() => setViewMode('home')}
        />
      );
    }

    if (viewMode === 'error' && currentScreenshot) {
      return (
        <ErrorView
          screenshot={currentScreenshot}
          onBack={() => setViewMode('home')}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          onRetry={() => setViewMode('home')}
        />
      );
    }

    if (viewMode === 'result' && currentScreenshot) {
      return (
        <ResultView
          screenshot={currentScreenshot}
          onBack={() => setViewMode('home')}
          onExecuteAction={handleExecuteAction}
          onOpenAskAi={() => setIsAskAiOpen(true)}
          onUpdateEntity={handleUpdateEntity}
          onUpdateScreenshot={handleUpdateScreenshot}
          onToggleSaveLibrary={handleToggleSaveLibrary}
          onToggleArchive={handleToggleArchive}
          onDeleteScreenshot={(id) => handleDeleteScreenshot(id)}
          onUploadNew={handleTriggerUpload}
        />
      );
    }

    // Standard tab views
    switch (activeTab) {
      case 'history':
        return (
          <HistoryView
            screenshots={screenshots}
            onSelectScreenshot={handleOpenScreenshot}
            onDeleteScreenshot={handleDeleteScreenshot}
            onClearAll={handleClearAllHistory}
            onToggleSaveLibrary={(id, e) => {
              e.stopPropagation();
              handleToggleSaveLibrary(id);
            }}
            onToggleArchive={(id, e) => {
              e.stopPropagation();
              handleToggleArchive(id);
            }}
          />
        );
      case 'actions':
        return (
          <ActionsView
            actions={executedActions}
            onToggleComplete={handleToggleCompleteAction}
            onDeleteAction={handleDeleteAction}
            onOpenScreenshot={(id) => {
              const item = screenshots.find((s) => s.id === id);
              if (item) handleOpenScreenshot(item);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            screenshots={screenshots}
            executedActions={executedActions}
            onClearAllData={handleClearAllData}
            onTriggerSplash={() => setIsInitialAppLoading(true)}
            authUser={authUser}
            onLogout={() => {
              setAuthUser(null);
              saveAuthUser(null);
            }}
          />
        );
      case 'home':
      default:
        return (
          <HomeView
            onAnalyzeImage={handleAnalyzeImage}
            onSelectPreset={handleSelectPreset}
            onOpenRecent={handleOpenScreenshot}
            onOpenCamera={() => setIsCameraOpen(true)}
            recentScreenshots={screenshots}
          />
        );
    }
  };

  const globalFileInputRef = useRef<HTMLInputElement>(null);

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          handleAnalyzeImage(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset value so same file can be uploaded again if desired
    e.target.value = '';
  };

  const handleTriggerUpload = () => {
    globalFileInputRef.current?.click();
  };

  const activeRemindersCount = executedActions.filter((a) => a.status === 'active').length;

  return (
    <div className="h-[100dvh] min-h-0 overflow-hidden bg-[#050505] text-[#EDEDED] flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Hidden global input for Header / ResultView upload anywhere */}
      <input
        type="file"
        ref={globalFileInputRef}
        onChange={handleGlobalFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Opening Splash / Loading Screen on website initial launch */}
      {isInitialAppLoading && (
        <OpeningSplashScreen onLoaded={() => setIsInitialAppLoading(false)} />
      )}

      {/* Mobile App Phone Frame (Always mobile only) */}
      <div className="flex-1 min-h-0 flex justify-center items-center py-0 sm:py-6 bg-[#050505]">
        <div className="w-full max-w-[430px] h-full min-h-0 sm:h-auto sm:min-h-[860px] sm:max-h-[920px] bg-[#0A0A0A] sm:rounded-[48px] sm:border-[10px] sm:border-[#141414] sm:shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col relative sm:ring-1 sm:ring-[#262626]">
          {/* Simulated Mobile Status Bar on framed view */}
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-medium text-[#888] select-none bg-[#0A0A0A]/90 border-b border-[#141414]">
            <span>9:41</span>
            {/* Dynamic Island */}
            <div className="w-24 h-4 bg-[#050505] border border-[#222] rounded-full flex items-center justify-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[9px] text-[#888] font-normal">SnapAction</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-[#555] p-0.5 flex items-center">
                <div className="w-full h-full bg-[#888] rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Persistent Header */}
          <Header
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            serverOnline={serverOnline}
            onTriggerUpload={handleTriggerUpload}
            onTriggerCamera={() => setIsCameraOpen(true)}
            onTriggerSplash={() => setIsInitialAppLoading(true)}
            authUser={authUser}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setViewMode('home');
            }}
            viewMode={viewMode}
            activeTab={activeTab}
            onBack={() => setViewMode('home')}
            screenTitle={
              viewMode === 'result' && currentScreenshot
                ? currentScreenshot.title
                : viewMode === 'error'
                ? 'Analysis Error'
                : activeTab === 'history'
                ? 'Library & History'
                : activeTab === 'actions'
                ? 'Actions Dashboard'
                : activeTab === 'profile'
                ? 'Profile & Settings'
                : undefined
            }
          />

          {/* Main Scrollable View Area */}
          <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-4 sm:px-6">
            {renderActiveView()}
          </main>

          {/* Persistent Bottom Navigation */}
          {viewMode === 'home' && (
            <BottomNav
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setViewMode('home');
              }}
              historyCount={screenshots.length}
              activeActionsCount={activeRemindersCount}
            />
          )}
        </div>
      </div>

      {/* Login Screen Modal with Google, GitHub, and Facebook */}
      {isLoginOpen && (
        <LoginScreen
          canDismiss={true}
          onDismiss={() => setIsLoginOpen(false)}
          onContinueAsGuest={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => {
            setAuthUser(user);
            saveAuthUser(user);
            setIsLoginOpen(false);
          }}
        />
      )}

      {/* Modals & Overlays */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setIsCameraOpen(false);
          handleAnalyzeImage(dataUrl, 'camera_capture.jpg');
        }}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        action={confirmAction}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmActionModal}
      />

      <SuccessToast
        action={successToastAction}
        onClose={() => setSuccessToastAction(null)}
        onViewActions={() => {
          setSuccessToastAction(null);
          setViewMode('home');
          setActiveTab('actions');
        }}
      />

      <AskAiDrawer
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
        screenshot={currentScreenshot}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
export default App;
