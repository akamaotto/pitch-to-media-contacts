import { createContext, ReactNode } from 'react';
import { PitchesState, usePitchesState } from './usePitchesState';
import { Pitch } from '../../../types';

export const PitchesContext = createContext<PitchesState | undefined>(undefined);

interface PitchesProviderProps {
  children: ReactNode;
  preloadedData?: {
    pitches: Pitch[];
  };
}

export const PitchesProvider = ({ children, preloadedData }: PitchesProviderProps) => {
  const value = usePitchesState(preloadedData);
  return <PitchesContext.Provider value={value}>{children}</PitchesContext.Provider>;
};
