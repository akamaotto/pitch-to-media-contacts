import { useCallback, useMemo, useState } from 'react';
import {
  Conversation,
  ConversationStatus,
  MediaContact,
} from '../../../types';
import { buildInitialConversations } from './conversationMocks';
import type { ContactType } from '../../../types';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ConversationsError = {
  message: string;
  code?: string;
  operation?: string;
};

export const STATUS_FILTERS = [
  { id: 'all', name: 'Inbox (All)', icon: 'Mail', color: 'text-black' },
  { id: 'sent', name: 'Sent', icon: 'Send', color: 'text-blue-600' },
  { id: 'awaitingResponse', name: 'Awaiting Response', icon: 'Clock', color: 'text-yellow-600' },
  { id: 'draft', name: 'Drafts', icon: 'Archive', color: 'text-gray-500' },
  { id: 'rejected', name: 'Rejected', icon: 'Slash', color: 'text-red-600' },
  { id: 'requestingPay', name: 'Requesting Pay', icon: 'TrendingUp', color: 'text-green-600' },
];

export const useConversationsState = (mediaContacts: MediaContact[], preloadedData?: {
  conversations: Conversation[];
  kpis?: {
    totalPitchesSent: number;
    repliesReceived: number;
    unreadReplies: number;
    openRate: string;
  };
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    preloadedData?.conversations || buildInitialConversations(mediaContacts)
  );
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<ConversationsError | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<number, Partial<Conversation>>>(new Map());
  const statusFilters = useMemo(() => STATUS_FILTERS, []);

  const availableMediaTypes = useMemo(() => {
    const types = new Set(
      conversations
        .map(c => c?.contact?.type)
        .filter((v): v is ContactType => Boolean(v))
    );
    return ['all', ...Array.from(types).sort()];
  }, [conversations]);

  const availableCountries = useMemo(() => {
    const countries = new Set(
      conversations
        .map(c => c?.contact?.country)
        .filter((v): v is string => Boolean(v))
    );
    return ['all', ...Array.from(countries).sort()];
  }, [conversations]);

  const getFilteredConversations = useCallback(
    async (filterStatus: string, filterMediaType: string, filterCountry: string) => {
      try {
        setFilterLoading(true);
        setError(null);
        
        // Simulate async filtering for demonstration
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Early return if no filters are applied
        if (filterStatus === 'all' && filterMediaType === 'all' && filterCountry === 'all') {
          return [...conversations].sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
        }

        let list = conversations;

        if (filterStatus !== 'all') {
          list = list.filter(c => c.status === filterStatus);
        }

        if (filterMediaType !== 'all') {
          list = list.filter(c => c.contact && c.contact.type === filterMediaType);
        }

        if (filterCountry !== 'all') {
          list = list.filter(c => c.contact && c.contact.country === filterCountry);
        }

        // Optimize sorting by using a more efficient comparison
        return [...list].sort((a, b) => {
          // First sort by unread status (unread first)
          if (a.unread !== b.unread) {
            return b.unread ? 1 : -1;
          }
          // Then sort by timestamp (most recent first) if timestamps are available
          return 0; // Keep original order for now
        });
      } catch (err) {
        const error: ConversationsError = {
          message: 'Failed to filter conversations',
          operation: 'filter',
        };
        setError(error);
        return [];
      } finally {
        setFilterLoading(false);
      }
    },
    [conversations]
  );

  const getStatusClasses = useCallback((status: ConversationStatus) => {
    switch (status) {
      case 'awaitingResponse':
        return 'bg-amber-50 text-amber-900 border border-amber-200';
      case 'rejected':
        return 'bg-red-50 text-red-900 border border-red-200';
      case 'requestingPay':
        return 'bg-emerald-50 text-emerald-900 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-900 border border-slate-200';
    }
  }, []);

  const getConversationCardClasses = useCallback((convo: Conversation, selected: boolean) => {
    const classes: string[] = ['conversation-card'];
    if (selected) {
      classes.push('conversation-card--active');
    }
    if (convo.unread) {
      classes.push('conversation-card--unread');
    }
    return classes.join(' ');
  }, []);

  const getUnreadTextClasses = useCallback((convo: Conversation) => {
    const nameClass = convo.unread ? 'font-semibold text-foreground' : 'text-foreground/90';
    const previewClass = convo.unread ? 'text-foreground font-medium' : 'text-muted-foreground';

    return { nameClass, previewClass };
  }, []);

  const handleSelectConversation = useCallback(async (convo: Conversation) => {
    try {
      setSelectionLoading(true);
      setError(null);
      
      // Optimistic update: immediately mark as read
      const conversationId = convo.id;
      setOptimisticUpdates(prev => new Map(prev).set(conversationId, { unread: false }));
      setConversations(prev => prev.map(c => (c.id === conversationId ? { ...c, unread: false } : c)));
      
      // Simulate async selection for demonstration
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setSelectedConversation(convo);
      setIsMobileDetailView(true);
      
      // Clear optimistic update on success
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(conversationId);
        return newMap;
      });
    } catch (err) {
      // Revert optimistic update on error
      setConversations(prev => prev.map(c => (c.id === convo.id ? { ...c, unread: true } : c)));
      setOptimisticUpdates(prev => {
        const newMap = new Map(prev);
        newMap.delete(convo.id);
        return newMap;
      });
      
      const error: ConversationsError = {
        message: 'Failed to select conversation',
        operation: 'selection',
      };
      setError(error);
    } finally {
      setSelectionLoading(false);
    }
  }, []);

  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
    setIsMobileDetailView(false);
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    const filter = statusFilters.find(f => f.id === status);
    return filter ? filter.name : status;
  }, [statusFilters]);

  const addConversations = useCallback((entries: Conversation[]) => {
    if (!entries.length) return;
    setConversations(prev => {
      const incomingIds = new Set(entries.map(entry => entry.id));
      const filtered = prev.filter(convo => !incomingIds.has(convo.id));
      return [...entries, ...filtered];
    });
  }, []);

  const handleArchiveConversation = useCallback(async (conversationId: number) => {
    // Store original conversation outside try block for error handling
    const originalConversation = conversations.find(c => c.id === conversationId);
    
    try {
      setError(null);
      
      // Optimistic update: immediately remove from list
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      // Simulate archive operation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) { // 10% chance of error
            reject(new Error('Archive failed'));
          } else {
            resolve(undefined);
          }
        }, 1000);
      });
      
      // Clear selected conversation if it was the archived one
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setIsMobileDetailView(false);
      }
      
      return true;
    } catch (err) {
      // Revert optimistic update on error
      if (originalConversation) {
        setConversations(prev => [...prev, originalConversation]);
      }
      
      const error: ConversationsError = {
        message: 'Failed to archive conversation',
        operation: 'archive',
      };
      setError(error);
      return false;
    }
  }, [conversations, selectedConversation]);

  const handleMarkAsUnread = useCallback(async (conversationId: number) => {
    try {
      setError(null);
      
      // Optimistic update: immediately mark as unread
      setConversations(prev => prev.map(c => (c.id === conversationId ? { ...c, unread: true } : c)));
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.05) { // 5% chance of error
            reject(new Error('Mark as unread failed'));
          } else {
            resolve(undefined);
          }
        }, 300);
      });
      
      return true;
    } catch (err) {
      // Revert optimistic update on error
      setConversations(prev => prev.map(c => (c.id === conversationId ? { ...c, unread: false } : c)));
      
      const error: ConversationsError = {
        message: 'Failed to mark as unread',
        operation: 'mark-unread',
      };
      setError(error);
      return false;
    }
  }, []);

  const handleUpdateStatus = useCallback(async (conversationId: number, newStatus: ConversationStatus) => {
    // Store original status for potential revert
    const originalConversation = conversations.find(c => c.id === conversationId);
    const originalStatus = originalConversation?.status;
    
    try {
      setError(null);
      
      // Optimistic update: immediately update status
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, status: newStatus } : c
      ));
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.05) { // 5% chance of error
            reject(new Error('Status update failed'));
          } else {
            resolve(undefined);
          }
        }, 500);
      });
      
      return true;
    } catch (err) {
      // Revert optimistic update on error
      if (originalConversation && originalStatus) {
        setConversations(prev => prev.map(c =>
          c.id === conversationId ? { ...c, status: originalStatus } : c
        ));
      }
      
      const error: ConversationsError = {
        message: 'Failed to update conversation status',
        operation: 'status-update',
      };
      setError(error);
      return false;
    }
  }, [conversations]);

  const getKpis = useCallback(async () => {
    try {
      setLoadingState('loading');
      
      // If we have preloaded KPIs, return them immediately
      if (preloadedData?.kpis) {
        setLoadingState('success');
        return preloadedData.kpis;
      }
      
      // Simulate async KPI calculation for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const totalPitchesSent = mediaContacts.filter(c => c.pitched).length;
      const repliesReceived = conversations.filter(c =>
        ['awaitingResponse', 'rejected', 'requestingPay'].includes(c.status)
      ).length;
      const unreadReplies = conversations.filter(c => c.unread).length;

      const kpis = {
        totalPitchesSent,
        repliesReceived,
        unreadReplies,
        openRate: '65%',
      };
      
      setLoadingState('success');
      return kpis;
    } catch (err) {
      const error: ConversationsError = {
        message: 'Failed to calculate KPIs',
        operation: 'kpi-calculation',
      };
      setError(error);
      setLoadingState('error');
      return {
        totalPitchesSent: 0,
        repliesReceived: 0,
        unreadReplies: 0,
        openRate: '0%',
      };
    }
  }, [mediaContacts, conversations, preloadedData]);

  return useMemo(
    () => ({
      conversations,
      selectedConversation,
      setSelectedConversation,
      isMobileDetailView,
      setIsMobileDetailView,
      STATUS_FILTERS: statusFilters,
      availableMediaTypes,
      availableCountries,
      getFilteredConversations,
      getStatusClasses,
      getConversationCardClasses,
      getUnreadTextClasses,
      handleSelectConversation,
      getStatusLabel,
      getKpis,
      addConversations,
      clearSelectedConversation,
      handleArchiveConversation,
      handleMarkAsUnread,
      handleUpdateStatus,
      optimisticUpdates,
      loadingState,
      error,
      filterLoading,
      selectionLoading,
      setError,
      clearError: () => setError(null),
    }),
    [
      conversations,
      selectedConversation,
      isMobileDetailView,
      availableMediaTypes,
      availableCountries,
      getFilteredConversations,
      getStatusClasses,
      getConversationCardClasses,
      getUnreadTextClasses,
      handleSelectConversation,
      getStatusLabel,
      getKpis,
      addConversations,
      clearSelectedConversation,
      handleArchiveConversation,
      handleMarkAsUnread,
      handleUpdateStatus,
      optimisticUpdates,
      statusFilters,
      loadingState,
      error,
      filterLoading,
      selectionLoading,
    ]
  );
};

export type ConversationsState = ReturnType<typeof useConversationsState>;
