import { useContext } from 'react';
import { PitchesContext } from './PitchesProvider';

export const usePitches = () => {
  const context = useContext(PitchesContext);
  if (!context) {
    throw new Error('usePitches must be used within a PitchesProvider');
  }
  return context;
};
