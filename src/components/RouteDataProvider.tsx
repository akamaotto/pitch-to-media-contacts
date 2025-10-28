import { ReactNode } from 'react';
import { ContactsProvider } from '../features/contacts';
import { PitchesProvider } from '../features/pitches';
import { ConversationsProvider } from '../features/conversations';

interface RouteDataProviderProps {
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

export const RouteDataProvider = ({ 
  children, 
  contactsData, 
  conversationsData, 
  pitchesData 
}: RouteDataProviderProps) => {
  return (
    <ContactsProvider preloadedData={contactsData}>
      <PitchesProvider preloadedData={pitchesData}>
        <ConversationsProvider preloadedData={conversationsData}>
          {children}
        </ConversationsProvider>
      </PitchesProvider>
    </ContactsProvider>
  );
};