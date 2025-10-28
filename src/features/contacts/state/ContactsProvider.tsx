import { createContext, ReactNode } from 'react';
import { ContactsState, useContactsState } from './useContactsState';
import { MediaContact } from '../../../types';

export const ContactsContext = createContext<ContactsState | undefined>(undefined);

interface ContactsProviderProps {
  children: ReactNode;
  preloadedData?: {
    contacts: MediaContact[];
    tab?: string;
  };
}

export const ContactsProvider = ({ children, preloadedData }: ContactsProviderProps) => {
  const value = useContactsState(preloadedData);
  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
};
