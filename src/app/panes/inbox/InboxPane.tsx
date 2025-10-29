import {useMemo, useState, useEffect} from 'react';
import {ArrowLeft, Filter, RefreshCw, AlertTriangle} from 'lucide-react';
// import { useApp } from '../../../hooks/useApp';
// import { useContacts } from '../../../features/contacts';
import {
    useConversations,
    STATUS_FILTERS,
} from '../../../features/conversations';
import ConversationDetail from '../../../features/conversations/components/ConversationDetail';
import {Conversation} from '../../../types';
import {useLocation} from '@tanstack/react-router';
import {cx} from '../../../utils/cx';
import {
    Button,
    Panel,
    ErrorBoundary,
    LoadingSpinner,
    Alert,
} from '../../../components/ui';
import {InboxKpiSummary} from './InboxKpiSummary';
import {InboxFiltersPanel} from './InboxFiltersPanel';
import {InboxFilterDrawer} from './InboxFilterDrawer';
import {InboxConversationList} from './InboxConversationList';

export type InboxPaneProps = {
    className?: string;
    onNavigate: (surface: 'contacts' | 'inbox' | 'composer') => void;
    preloadedData?: {
        conversations: any[];
        kpis?: {
            totalPitchesSent: number;
            repliesReceived: number;
            unreadReplies: number;
            openRate: string;
        };
    };
};

export const InboxPane = ({
    className,
    onNavigate,
    preloadedData,
}: InboxPaneProps) => {
    const {
        conversations,
        selectedConversation,
        availableMediaTypes,
        availableCountries,
        getUnreadTextClasses,
        handleSelectConversation,
        getStatusLabel,
        getStatusClasses,
        getKpis,
        error,
        selectionLoading,
        clearError,
    } = useConversations();
    // const { selectedTab, handleTabChange, setActiveSurface } = useApp();
    // const { showPitchedTab } = useContacts();

    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    // Derive filtered conversations synchronously to avoid list unmount/refresh
    const filteredConversations = useMemo<Conversation[]>(() => {
        let list = conversations;

        // Status filter
        if (filterStatus !== 'all') {
            list = list.filter((c) => c.status === filterStatus);
        }

        // Media types filter (multi-select). If none selected, pass-through.
        if (selectedMediaTypes.length > 0) {
            const set = new Set(selectedMediaTypes);
            list = list.filter(
                (c) => c.contact && c.contact.type && set.has(c.contact.type),
            );
        }

        // Countries filter (multi-select). If none selected, pass-through.
        if (selectedCountries.length > 0) {
            const set = new Set(selectedCountries);
            list = list.filter(
                (c) =>
                    c.contact &&
                    c.contact.country &&
                    set.has(c.contact.country),
            );
        }

        // Sort: unread first; keep original order otherwise
        return [...list].sort((a, b) => {
            if (a.unread === b.unread) return 0;
            return a.unread ? -1 : 1;
        });
    }, [conversations, filterStatus, selectedMediaTypes, selectedCountries]);
    const [kpiData, setKpiData] = useState<any>(null);
    const [kpiError, setKpiError] = useState<string | null>(null);
    // Removed top-level refresh behavior; keep fast UI with no explicit refresh

    // Removed async filtering to prevent list refresh; computed via useMemo above

    // Handle async KPI calculation
    useEffect(() => {
        const calculateKpis = async () => {
            try {
                setKpiError(null);
                const kpis = await getKpis();
                setKpiData(kpis);
            } catch (err) {
                console.error('Failed to calculate KPIs:', err);
                setKpiError(
                    'Failed to load performance data. Please try again.',
                );
            }
        };

        calculateKpis();
    }, [getKpis]);

    // Initialize active status from search param (e.g., ?status=draft)
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        if (
            status &&
            [
                'all',
                'sent',
                'awaitingResponse',
                'draft',
                'rejected',
                'requestingPay',
            ].includes(status)
        ) {
            setFilterStatus(status);
        }
        // run only on first mount for initial status
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRetry = () => {
        clearError();
        setKpiError(null);
        window.location.reload();
    };

    // Removed top-level refresh handler along with in-page tabs

    // No-op: filtering is synchronous now
    const handleFilterRetry = () => {};

    const handleKpiRetry = async () => {
        setKpiError(null);
        try {
            const kpis = await getKpis();
            setKpiData(kpis);
        } catch (err) {
            setKpiError('Failed to load performance data. Please try again.');
        }
    };

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            all: conversations.length,
        };

        conversations.forEach((conversation) => {
            counts[conversation.status] =
                (counts[conversation.status] ?? 0) + 1;
        });

        return counts;
    }, [conversations]);

    // Remove in-page tabs for Inbox (Pitched) view

    return (
        <ErrorBoundary
            onError={(error) => {
                console.error('InboxPane error:', error);
            }}
        >
            <div
                className={cx('flex h-full min-h-0 flex-col gap-6', className)}
            >
                {/* Removed the in-page tab row and top refresh for Inbox (Pitched) */}

                {/* Error Display */}
                {error && (
                    <Alert className='mx-4'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='font-medium'>
                                    Error: {error.message}
                                </p>
                                {error.operation && (
                                    <p className='text-sm text-muted-foreground'>
                                        Operation: {error.operation}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleRetry}
                                className='flex items-center gap-2'
                            >
                                <RefreshCw className='h-4 w-4' />
                                Retry
                            </Button>
                        </div>
                    </Alert>
                )}

                {kpiError ? (
                    <Alert>
                        <div className='flex items-center gap-2'>
                            <AlertTriangle className='h-4 w-4 text-danger' />
                            <span className='text-sm text-danger'>
                                {kpiError}
                            </span>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={handleKpiRetry}
                                className='ml-auto'
                            >
                                Retry
                            </Button>
                        </div>
                    </Alert>
                ) : kpiData ? (
                    <InboxKpiSummary {...kpiData} />
                ) : (
                    <div className='animate-pulse'>
                        <div className='h-32 rounded-lg border border-border bg-surface shadow-sm' />
                    </div>
                )}

                <Panel
                    padding='none'
                    className='flex-1 min-h-0 overflow-hidden'
                >
                    {/* Mobile Filter Button */}
                    <div className='flex items-center justify-between border-b border-border bg-surface p-4 md:hidden'>
                        <h2 className='text-sm font-semibold text-foreground'>
                            Conversations
                        </h2>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className='flex items-center gap-2'
                        >
                            <Filter className='h-4 w-4' />
                            Filters
                        </Button>
                    </div>

                    {/* Responsive Grid Layout */}
                    <div className='grid h-full grid-cols-1 divide-y divide-border md:grid-cols-[220px,minmax(0,1fr),minmax(0,1.15fr)] md:divide-x md:divide-y-0'>
                        {/* Filter Panel - Hidden on mobile, shown in drawer */}
                        <div className='hidden h-full overflow-y-auto md:block'>
                            <InboxFiltersPanel
                                className='bg-surface'
                                statusFilters={STATUS_FILTERS}
                                activeStatus={filterStatus}
                                statusCounts={statusCounts}
                                mediaTypes={availableMediaTypes.filter(
                                    (t) => t !== 'all',
                                )}
                                selectedMediaTypes={selectedMediaTypes}
                                onMediaTypesChange={(values) =>
                                    setSelectedMediaTypes(values)
                                }
                                countries={availableCountries.filter(
                                    (c) => c !== 'all',
                                )}
                                selectedCountries={selectedCountries}
                                onCountriesChange={(values) =>
                                    setSelectedCountries(values)
                                }
                                onStatusChange={(value) =>
                                    setFilterStatus(value)
                                }
                            />
                        </div>

                        {/* Conversation List - always mounted to avoid visible refresh */}
                        <div className='h-full overflow-y-auto'>
                            <InboxConversationList
                                className='bg-surface'
                                conversations={filteredConversations}
                                selectedConversationId={
                                    selectedConversation?.id
                                }
                                onSelectConversation={handleSelectConversation}
                                getStatusClasses={getStatusClasses}
                                getStatusLabel={getStatusLabel}
                                getUnreadTextClasses={getUnreadTextClasses}
                            />
                        </div>

                        {/* Conversation Detail - Hidden on mobile when no conversation is selected */}
                        <div
                            className={cx(
                                'flex h-full min-h-0 flex-col bg-surface',
                                'hidden md:block', // Hide on mobile by default
                                selectedConversation && 'block', // Show on mobile when a conversation is selected
                            )}
                        >
                            {selectedConversation ? (
                                <>
                                    {/* Mobile back button */}
                                    <div className='flex items-center border-b border-border p-4 md:hidden'>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() =>
                                                handleSelectConversation(
                                                    null as any,
                                                )
                                            }
                                            className='mr-2'
                                            aria-label='Back to conversation list'
                                            disabled={selectionLoading}
                                        >
                                            <ArrowLeft className='h-4 w-4' />
                                        </Button>
                                        <h2 className='text-sm font-semibold text-foreground truncate'>
                                            {selectedConversation.contact.name}
                                        </h2>
                                    </div>
                                    <ConversationDetail />
                                </>
                            ) : (
                                <div className='flex flex-1 items-center justify-center p-10 text-sm text-muted-foreground'>
                                    Choose a thread from the inbox to review
                                    replies, generate AI responses, and log
                                    outcomes.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Filter Drawer */}
                    <InboxFilterDrawer
                        isOpen={isFilterDrawerOpen}
                        onClose={() => setIsFilterDrawerOpen(false)}
                        statusFilters={STATUS_FILTERS}
                        activeStatus={filterStatus}
                        statusCounts={statusCounts}
                        mediaTypes={availableMediaTypes.filter(
                            (t) => t !== 'all',
                        )}
                        selectedMediaTypes={selectedMediaTypes}
                        onMediaTypesChange={(values) =>
                            setSelectedMediaTypes(values)
                        }
                        countries={availableCountries.filter(
                            (c) => c !== 'all',
                        )}
                        selectedCountries={selectedCountries}
                        onCountriesChange={(values) =>
                            setSelectedCountries(values)
                        }
                        onStatusChange={(value) => setFilterStatus(value)}
                    />
                </Panel>
            </div>
        </ErrorBoundary>
    );
};
