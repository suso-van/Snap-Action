import { ScreenshotItem, ExecutedAction, UserSettings, AuthUser } from '../types';
import { SAMPLE_SCREENSHOTS } from '../data/sampleScreenshots';

const STORAGE_KEYS = {
  SCREENSHOTS: 'snapaction_screenshots_v2',
  EXECUTED_ACTIONS: 'snapaction_executed_actions_v2',
  SETTINGS: 'snapaction_settings_v1',
  ONBOARDING_SEEN: 'snapaction_onboarding_seen_v1',
  AUTH_USER: 'snapaction_auth_user_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
  autoDetectActions: true,
  requireConfirmation: 'high_impact_only',
  defaultReminderOffset: '1h',
  defaultCalendar: 'google',
  storeScreenshotsLocally: true,
  cloudSync: false,
  hapticFeedback: true,
  theme: 'dark',
  deviceFrame: 'mobile',
};

export function loadStoredScreenshots(): ScreenshotItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCREENSHOTS);
    if (!raw) {
      // Check if user had custom screenshots in v1
      const oldRaw = localStorage.getItem('snapaction_screenshots_v1');
      let combined = SAMPLE_SCREENSHOTS;
      if (oldRaw) {
        try {
          const oldList = JSON.parse(oldRaw);
          if (Array.isArray(oldList)) {
            const userCustom = oldList.filter((s: ScreenshotItem) => !s.id.startsWith('sample-'));
            combined = [...userCustom, ...SAMPLE_SCREENSHOTS];
          }
        } catch (e) {}
      }
      localStorage.setItem(STORAGE_KEYS.SCREENSHOTS, JSON.stringify(combined));
      return combined;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_SCREENSHOTS;
  } catch (e) {
    console.error('Failed to load screenshots from localStorage', e);
    return SAMPLE_SCREENSHOTS;
  }
}

export function saveStoredScreenshots(items: ScreenshotItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCREENSHOTS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save screenshots to localStorage', e);
  }
}

export function loadStoredExecutedActions(): ExecutedAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXECUTED_ACTIONS);
    if (!raw) {
      // Gather initial executed actions from sample screenshots
      const initial = SAMPLE_SCREENSHOTS.flatMap((s) => s.executedActions || []);
      localStorage.setItem(STORAGE_KEYS.EXECUTED_ACTIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredExecutedActions(actions: ExecutedAction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXECUTED_ACTIONS, JSON.stringify(actions));
  } catch (e) {
    console.error('Failed to save executed actions', e);
  }
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save user settings', e);
  }
}

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN) === 'true';
}

export function setSeenOnboarding(val: boolean): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, val ? 'true' : 'false');
}

export function clearAllLocalData(): void {
  localStorage.removeItem(STORAGE_KEYS.SCREENSHOTS);
  localStorage.removeItem(STORAGE_KEYS.EXECUTED_ACTIONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_SEEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}

export function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveAuthUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save auth user', e);
  }
}

