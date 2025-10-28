import { ReactNode } from 'react';
import { AppProvider } from '../../hooks/useApp';
import { ContactsProvider } from '../../features/contacts';
import { PitchesProvider } from '../../features/pitches';
import { ConversationsProvider } from '../../features/conversations';
import { ToasterProvider } from '../../components/ui/Toaster';

interface ShellProvidersProps {
  children: ReactNode;
  contactsData?: {
    contacts: any[];
    tab?: string;
  };
  conversationsData?: {
    conversations: any[];
    kpis?: {
      totalPitchesSent: number;
      repliesReceived: number;
      unreadReplies: number;
      openRate: string;
    };
  };
  pitchesData?: {
    pitches: any[];
  };
}

export const ShellProviders = ({
  children,
  contactsData,
  conversationsData,
  pitchesData
}: ShellProvidersProps) => (
  <AppProvider>
    <ToasterProvider>
      <ContactsProvider preloadedData={contactsData}>
        <PitchesProvider preloadedData={pitchesData}>
          <ConversationsProvider preloadedData={conversationsData}>
            {children}
          </ConversationsProvider>
        </PitchesProvider>
      </ContactsProvider>
    </ToasterProvider>
  </AppProvider>
);
