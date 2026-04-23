import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  // --- 1. STATE (The current filter values) ---
  selectedRegion: 'Global',
  selectedYearRange: [2010, 2026], // Array for range slider
  selectedSpecies: [],             // Array for multi-select taxa
  selectedDepth: [0, 5000],        // Depth range in meters
  elNinoActive: false,             // Toggle switch for ENSO events

  // --- 2. ACTIONS (Functions to update the state) ---
  setRegion: (region) => set({ selectedRegion: region }),
  
  setYearRange: (range) => set({ selectedYearRange: range }),
  
  setSpecies: (speciesArray) => set({ selectedSpecies: speciesArray }),
  
  setDepth: (depthRange) => set({ selectedDepth: depthRange }),
  
  toggleElNino: (isActive) => set({ elNinoActive: isActive }),
  selectedSpeciesId: null, // null means "All Species"
  setSpeciesId: (id) => set({ selectedSpeciesId: id }),
  // --- 3. UTILITY (A quick way to clear the board) ---
  resetFilters: () => set({
    selectedRegion: 'Global',
    selectedYearRange: [2010, 2026],
    selectedSpecies: [],
    selectedDepth: [0, 5000],
    elNinoActive: false,
  })
}));