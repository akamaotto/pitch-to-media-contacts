import { useContext } from 'react';
import { ConversationsContext } from './ConversationsProvider';

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
};
