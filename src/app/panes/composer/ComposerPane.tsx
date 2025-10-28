import { usePitches } from '../../../features/pitches';
import { useApp } from '../../../hooks/useApp';
import { cx } from '../../../utils/cx';
import { ComposerHeader } from './ComposerHeader';
import { ComposerDraftList } from './ComposerDraftList';
import { ComposerFooter } from './ComposerFooter';

export type ComposerPaneProps = {
  className?: string;
  onNavigate: (surface: 'contacts' | 'inbox' | 'composer') => void;
  preloadedData?: {
    contacts: any[];
  };
};

export const ComposerPane = ({ className, onNavigate, preloadedData }: ComposerPaneProps) => {
  const { generatedPitches, sendingStatus } = usePitches();
  const { setActiveSurface } = useApp();

  const handleBackToContacts = () => {
    setActiveSurface('contacts');
    onNavigate('contacts');
  };

  return (
    <div className={cx('space-y-6', className)}>
      <ComposerHeader onBack={handleBackToContacts} />
      <ComposerDraftList pitches={generatedPitches} />
      <ComposerFooter sendingStatus={sendingStatus} />
    </div>
  );
};
