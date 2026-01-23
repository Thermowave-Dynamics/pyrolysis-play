import { create } from 'zustand';

export type Level = 'input' | 'heating' | 'sorting' | 'cooling' | 'results';

interface GameState {
  currentLevel: Level;
  plasticRatio: number; // 0-100
  biomassRatio: number; // 0-100
  
  // Performance metrics
  heatingScore: number; // 0-1
  sortingScore: number; // 0-1
  coolingScore: number; // 0-1
  
  // Setters
  setCurrentLevel: (level: Level) => void;
  setRatios: (plastic: number) => void;
  setHeatingScore: (score: number) => void;
  setSortingScore: (score: number) => void;
  setCoolingScore: (score: number) => void;
  
  resetGame: () => void;
}

export const useGameState = create<GameState>((set) => ({
  currentLevel: 'input',
  plasticRatio: 50,
  biomassRatio: 50,
  heatingScore: 0,
  sortingScore: 0,
  coolingScore: 0,

  setCurrentLevel: (level) => set({ currentLevel: level }),
  
  setRatios: (plastic) => set({ 
    plasticRatio: plastic, 
    biomassRatio: 100 - plastic 
  }),
  
  setHeatingScore: (score) => set({ heatingScore: score }),
  setSortingScore: (score) => set({ sortingScore: score }),
  setCoolingScore: (score) => set({ coolingScore: score }),
  
  resetGame: () => set({
    currentLevel: 'input',
    plasticRatio: 50,
    biomassRatio: 50,
    heatingScore: 0,
    sortingScore: 0,
    coolingScore: 0,
  }),
}));
