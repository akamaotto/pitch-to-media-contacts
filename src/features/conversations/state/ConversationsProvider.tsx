import { createContext, ReactNode } from 'react';
import { useContacts } from '../../contacts';
import { ConversationsState, useConversationsState } from './useConversationsState';
import { Conversation } from '../../../types';

export const ConversationsContext = createContext<ConversationsState | undefined>(undefined);

interface ConversationsProviderProps {
  children: ReactNode;
  preloadedData?: {
    conversations: Conversation[];
    kpis?: {
      totalPitchesSent: number;
      repliesReceived: number;
      unreadReplies: number;
      openRate: string;
    };
  };
}

export const ConversationsProvider = ({ children, preloadedData }: ConversationsProviderProps) => {
  const { mediaContacts } = useContacts();
  const value = useConversationsState(mediaContacts, preloadedData);

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
};
