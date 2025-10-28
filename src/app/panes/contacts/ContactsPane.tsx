import { useEffect } from 'react';
import { Users } from 'lucide-react';
import { useApp } from '../../../hooks/useApp';
import { useContacts } from '../../../features/contacts';
import { usePitches } from '../../../features/pitches';
import { useConversations } from '../../../features/conversations/state/useConversations';
import { useRouter } from '@tanstack/react-router';
import { useToasts } from '../../../components/ui/Toaster';
import ContactSelectionView from '../../../features/contacts/components/contact-selection';
import { cx } from '../../../utils/cx';
import { Button, Panel } from '../../../components/ui';

export type ContactsPaneProps = {
  className?: string;
  onNavigate: (surface: 'contacts' | 'inbox' | 'composer') => void;
  tab?: 'recommended' | 'all' | 'myContacts' | 'pitched';
  preloadedData?: {
    contacts: any[];
    tab?: string;
  };
};

export const ContactsPane = ({ className, tab, preloadedData }: ContactsPaneProps) => {
  const { selectedTab, setShowAddContactModal, setActiveSurface } = useApp();
  
  // Use tab from prop if provided, otherwise use from router state
  const currentTab = tab || selectedTab;
  const {
    selectedContacts,
    showPitchedTab,
    autoSelectRecommended,
    mediaContacts,
  } = useContacts();
  const router = useRouter();
  const { showToast } = useToasts();
  const { addConversations } = useConversations();
  const {
    generatePitchesSequential,
    sendingStatus,
    generationMessage,
    generationCurrent,
    generationTotal,
  } = usePitches();

  useEffect(() => {
    autoSelectRecommended();
  }, [autoSelectRecommended]);

  console.log('ContactsPane: showPitchedTab:', showPitchedTab, 'selectedTab:', selectedTab);

  return (
    <div className={cx('space-y-6', className)}>

      {/* Generation status banner */}
      {sendingStatus === 'sending' && generationMessage && (
        <Panel padding="md" className="flex items-center justify-between shadow-sm">
          <div className="text-sm text-muted-foreground">
            {generationMessage}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.navigate({ to: '/contacts/pitched', search: { status: 'draft' } as any })}
          >
            View Drafts ({generationCurrent}/{generationTotal})
          </Button>
        </Panel>
      )}

      <ContactSelectionView />

      <Panel padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{selectedContacts.size}</span> contacts selected
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setShowAddContactModal(true)} variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Add Contact
          </Button>
          <Button
            onClick={() =>
              generatePitchesSequential(
                selectedContacts,
                mediaContacts,
                (conv) => addConversations([conv]),
                (msg) => showToast(msg),
                () => router.navigate({ to: '/contacts/pitched', search: { status: 'draft' } as any }),
              )
            }
            disabled={selectedContacts.size === 0}
            className="gap-2"
          >
            Generate Pitches ({selectedContacts.size})
          </Button>
        </div>
      </Panel>
    </div>
  );
};
