import { initialContactsData } from '../features/contacts/state/contactsData';
import { buildInitialConversations } from '../features/conversations/state/conversationMocks';
import { ContactTab, MediaContact, Conversation } from '../types';

// Simulate async data fetching with delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Contacts loader
export const loadContacts = async (): Promise<MediaContact[]> => {
  try {
    // Simulate network delay
    await delay(300);
    
    // In a real app, this would be an API call
    return [...initialContactsData];
  } catch (error) {
    console.error('Failed to load contacts:', error);
    throw new Error('Failed to load contacts');
  }
};

// Conversations loader - depends on contacts
export const loadConversations = async (contacts: MediaContact[]): Promise<Conversation[]> => {
  try {
    // Simulate network delay
    await delay(400);
    
    // In a real app, this would be an API call
    return buildInitialConversations(contacts);
  } catch (error) {
    console.error('Failed to load conversations:', error);
    throw new Error('Failed to load conversations');
  }
};

// Pitches loader - currently empty since pitches are generated on demand
export const loadPitches = async (): Promise<any[]> => {
  try {
    // Simulate network delay
    await delay(200);
    
    // In a real app, this would be an API call
    // For now, return empty array since pitches are generated dynamically
    return [];
  } catch (error) {
    console.error('Failed to load pitches:', error);
    throw new Error('Failed to load pitches');
  }
};

// Combined loader for contacts with tab-specific filtering
export const loadContactsByTab = async (tab: ContactTab): Promise<{
  contacts: MediaContact[];
  tab: ContactTab;
}> => {
  try {
    const contacts = await loadContacts();
    
    // Filter contacts based on tab
    let filteredContacts: MediaContact[];
    
    switch (tab) {
      case 'recommended':
        filteredContacts = contacts.filter(contact => contact.recommended && !contact.pitched);
        break;
      case 'all':
        filteredContacts = contacts.filter(contact => !contact.pitched);
        break;
      case 'myContacts':
        filteredContacts = contacts.filter(contact => contact.userAdded && !contact.pitched);
        break;
      case 'pitched':
        filteredContacts = contacts.filter(contact => contact.pitched);
        break;
      default:
        filteredContacts = contacts;
        break;
    }
    
    return {
      contacts: filteredContacts,
      tab
    };
  } catch (error) {
    console.error(`Failed to load contacts for tab ${tab}:`, error);
    throw new Error(`Failed to load contacts for tab ${tab}`);
  }
};

// Loader for inbox data (conversations with KPIs)
export const loadInboxData = async (contacts: MediaContact[]): Promise<{
  conversations: Conversation[];
  kpis: {
    totalPitchesSent: number;
    repliesReceived: number;
    unreadReplies: number;
    openRate: string;
  };
}> => {
  try {
    const conversations = await loadConversations(contacts);
    
    // Calculate KPIs
    const totalPitchesSent = contacts.filter(c => c.pitched).length;
    const repliesReceived = conversations.filter(c =>
      ['awaitingResponse', 'rejected', 'requestingPay'].includes(c.status)
    ).length;
    const unreadReplies = conversations.filter(c => c.unread).length;
    
    const kpis = {
      totalPitchesSent,
      repliesReceived,
      unreadReplies,
      openRate: '65%', // In a real app, this would be calculated
    };
    
    return {
      conversations,
      kpis
    };
  } catch (error) {
    console.error('Failed to load inbox data:', error);
    throw new Error('Failed to load inbox data');
  }
};

// Loader for composer data (contacts for selection)
export const loadComposerData = async (): Promise<{
  contacts: MediaContact[];
}> => {
  try {
    const contacts = await loadContacts();
    
    // For composer, we want contacts that haven't been pitched yet
    const availableContacts = contacts.filter(contact => !contact.pitched);
    
    return {
      contacts: availableContacts
    };
  } catch (error) {
    console.error('Failed to load composer data:', error);
    throw new Error('Failed to load composer data');
  }
};