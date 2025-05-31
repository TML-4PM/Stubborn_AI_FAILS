
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GalleryFilters {
  searchTerm: string;
  selectedCategories: string[];
  selectedTags: string[];
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface SavedSearch {
  id: string;
  name: string;
  filters: GalleryFilters;
  createdAt: Date;
}

interface GalleryState {
  // Filters
  filters: GalleryFilters;
  savedSearches: SavedSearch[];
  
  // UI State
  viewMode: 'grid' | 'list' | 'masonry';
  showFilters: boolean;
  isLoading: boolean;
  
  // Performance
  virtualizationEnabled: boolean;
  prefetchEnabled: boolean;
  
  // Actions
  setFilters: (filters: Partial<GalleryFilters>) => void;
  resetFilters: () => void;
  saveSearch: (name: string) => void;
  deleteSavedSearch: (id: string) => void;
  loadSavedSearch: (id: string) => void;
  setViewMode: (mode: 'grid' | 'list' | 'masonry') => void;
  toggleFilters: () => void;
  setLoading: (loading: boolean) => void;
  toggleVirtualization: () => void;
  togglePrefetch: () => void;
}

const defaultFilters: GalleryFilters = {
  searchTerm: '',
  selectedCategories: [],
  selectedTags: [],
  sortBy: 'newest'
};

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: defaultFilters,
      savedSearches: [],
      viewMode: 'grid',
      showFilters: false,
      isLoading: false,
      virtualizationEnabled: true,
      prefetchEnabled: true,
      
      // Actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
        
      resetFilters: () =>
        set({ filters: defaultFilters }),
        
      saveSearch: (name) =>
        set((state) => {
          const newSearch: SavedSearch = {
            id: crypto.randomUUID(),
            name,
            filters: { ...state.filters },
            createdAt: new Date()
          };
          return {
            savedSearches: [...state.savedSearches, newSearch]
          };
        }),
        
      deleteSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter(search => search.id !== id)
        })),
        
      loadSavedSearch: (id) =>
        set((state) => {
          const search = state.savedSearches.find(s => s.id === id);
          return search ? { filters: { ...search.filters } } : state;
        }),
        
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
      setLoading: (loading) => set({ isLoading: loading }),
      toggleVirtualization: () => set((state) => ({ virtualizationEnabled: !state.virtualizationEnabled })),
      togglePrefetch: () => set((state) => ({ prefetchEnabled: !state.prefetchEnabled }))
    }),
    {
      name: 'gallery-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        filters: state.filters,
        savedSearches: state.savedSearches,
        viewMode: state.viewMode,
        virtualizationEnabled: state.virtualizationEnabled,
        prefetchEnabled: state.prefetchEnabled
      })
    }
  )
);
