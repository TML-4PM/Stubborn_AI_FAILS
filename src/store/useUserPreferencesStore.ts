
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    browser: boolean;
    email: boolean;
    newFails: boolean;
    comments: boolean;
    likes: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  performance: {
    autoPlayVideos: boolean;
    loadImages: boolean;
    enableAnimations: boolean;
    prefetchContent: boolean;
  };
}

interface UserPreferencesState {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    browser: true,
    email: true,
    newFails: true,
    comments: true,
    likes: false
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    fontSize: 'medium'
  },
  performance: {
    autoPlayVideos: true,
    loadImages: true,
    enableAnimations: true,
    prefetchContent: true
  }
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      
      updatePreferences: (newPrefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPrefs }
        })),
        
      resetPreferences: () =>
        set({ preferences: defaultPreferences })
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
