import React from 'react';
import {Search, AlertTriangle} from 'lucide-react';
import {useState, useMemo, useRef, useEffect} from 'react';
import {
    Input,
    ListRow,
    Badge,
    LoadingState,
    LoadingSpinner,
    ErrorBoundary,
    Button,
    Alert,
} from '../../../components/ui';
import {Conversation, ConversationStatus} from '../../../types';
import {cx} from '../../../utils/cx';

type InboxConversationListProps = {
    conversations: Conversation[];
    selectedConversationId?: number | null;
    onSelectConversation: (conversation: Conversation) => void;
    getStatusClasses: (status: ConversationStatus) => string;
    getStatusLabel: (status: string) => string;
    getUnreadTextClasses: (conversation: Conversation) => {
        previewClass: string;
    };
    className?: string;
};

export const InboxConversationList = React.memo(
    ({
        conversations,
        selectedConversationId,
        onSelectConversation,
        getStatusClasses,
        getStatusLabel,
        getUnreadTextClasses,
        className,
    }: InboxConversationListProps) => {
        const [searchQuery, setSearchQuery] = useState('');
        const [focusedIndex, setFocusedIndex] = useState<number>(-1);
        const [searchLoading, setSearchLoading] = useState(false);
        const [searchError, setSearchError] = useState<string | null>(null);
        const [initialLoading, setInitialLoading] = useState(true);
        const conversationRefs = useRef<(HTMLButtonElement | null)[]>([]);

        const filteredConversations: Conversation[] = useMemo(() => {
            if (!searchQuery.trim()) {
                return conversations;
            }

            const query = searchQuery.toLowerCase().trim();

            return conversations.filter((convo) => {
                const contactNameMatch = convo.contact.name
                    .toLowerCase()
                    .includes(query);
                const lastMessageMatch = convo.lastMessage
                    .toLowerCase()
                    .includes(query);
                const subjectMatch = convo.subject
                    .toLowerCase()
                    .includes(query);

                return contactNameMatch || lastMessageMatch || subjectMatch;
            });
        }, [conversations, searchQuery]);

        // Simulate initial loading
        useEffect(() => {
            const timer = setTimeout(() => {
                setInitialLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }, []);

        // Handle search with loading state
        const handleSearchChange = async (value: string) => {
            setSearchQuery(value);
            setSearchError(null);

            if (value.trim()) {
                setSearchLoading(true);
                try {
                    // Simulate search delay with potential error
                    await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            // Simulate occasional search error for demonstration
                            if (Math.random() < 0.05) {
                                // 5% chance of error
                                reject(new Error('Search failed'));
                            } else {
                                resolve(undefined);
                            }
                        }, 300);
                    });
                } catch (err) {
                    setSearchError('Search failed. Please try again.');
                } finally {
                    setSearchLoading(false);
                }
            }
        };

        // Handle search retry
        const handleSearchRetry = () => {
            setSearchError(null);
            handleSearchChange(searchQuery);
        };

        // Reset focused index when filtered conversations change
        useEffect(() => {
            setFocusedIndex(-1);
            conversationRefs.current = [];
        }, [filteredConversations]);

        // Handle keyboard navigation
        const handleKeyDown = (
            event: React.KeyboardEvent<HTMLButtonElement>,
            index: number,
        ) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    const nextIndex = Math.min(
                        index + 1,
                        filteredConversations.length - 1,
                    );
                    setFocusedIndex(nextIndex);
                    conversationRefs.current[nextIndex]?.focus();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    const prevIndex = Math.max(index - 1, 0);
                    setFocusedIndex(prevIndex);
                    conversationRefs.current[prevIndex]?.focus();
                    break;
                case 'Home':
                    event.preventDefault();
                    setFocusedIndex(0);
                    conversationRefs.current[0]?.focus();
                    break;
                case 'End':
                    event.preventDefault();
                    setFocusedIndex(filteredConversations.length - 1);
                    conversationRefs.current[
                        filteredConversations.length - 1
                    ]?.focus();
                    break;
            }
        };

        return (
            <ErrorBoundary
                onError={(error) => {
                    console.error('InboxConversationList error:', error);
                }}
            >
                <div
                    className={cx(
                        'flex flex-col gap-2 py-4 px-2 sm:p-6',
                        className,
                    )}
                >
                    <div className='relative text-sm'>
                        <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                        <Input
                            type='search'
                            placeholder='Filter threads...'
                            className='pl-10 text-sm'
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            disabled={searchLoading}
                        />
                        {searchLoading && (
                            <LoadingSpinner
                                size='sm'
                                className='absolute right-3 top-1/2 -translate-y-1/2'
                                ariaLabel='Searching...'
                            />
                        )}
                    </div>

                    <div
                        className='flex flex-col'
                        role='list'
                        aria-label='Conversations'
                    >
                        {initialLoading ? (
                            // Show loading skeletons on initial load
                            Array.from({length: 5}, (_, i) => (
                                <LoadingState
                                    key={`initial-skeleton-${i}`}
                                    type='conversation'
                                    className='mb-2'
                                />
                            ))
                        ) : searchError ? (
                            // Show search error state
                            <Alert className='m-2'>
                                <div className='flex items-center gap-2'>
                                    <AlertTriangle className='h-4 w-4 text-danger' />
                                    <span className='text-sm text-danger'>
                                        {searchError}
                                    </span>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={handleSearchRetry}
                                        className='ml-auto'
                                    >
                                        Retry
                                    </Button>
                                </div>
                            </Alert>
                        ) : searchLoading ? (
                            // Show loading skeletons while searching
                            Array.from({length: 5}, (_, i) => (
                                <LoadingState
                                    key={`skeleton-${i}`}
                                    type='conversation'
                                    className='mb-2'
                                />
                            ))
                        ) : filteredConversations.length === 0 ? (
                            <div
                                className='rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground sm:px-4 sm:py-6'
                                role='status'
                                aria-live='polite'
                            >
                                {searchQuery.trim()
                                    ? 'No conversations match your search. Try different keywords.'
                                    : 'No conversations match your filters yet. Try widening the filters.'}
                            </div>
                        ) : (
                            filteredConversations.map((convo, index) => {
                                const textClasses = getUnreadTextClasses(convo);
                                const isActive =
                                    selectedConversationId === convo.id;
                                const variant = isActive
                                    ? 'active'
                                    : convo.unread
                                    ? 'unread'
                                    : 'default';
                                return (
                                    <ListRow
                                        key={convo.id}
                                        ref={(el) => {
                                            conversationRefs.current[index] =
                                                el;
                                        }}
                                        onClick={() =>
                                            onSelectConversation(convo)
                                        }
                                        variant={variant}
                                        className='mb-2 text-sm last:mb-0 sm:mb-2'
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        tabIndex={
                                            focusedIndex === index ? 0 : -1
                                        }
                                        role='option'
                                        aria-selected={isActive}
                                        aria-label={`${convo.contact.name}, ${
                                            convo.subject
                                        }, ${
                                            convo.unread ? 'unread' : 'read'
                                        }, ${convo.timestamp}`}
                                        disabled={
                                            searchLoading || initialLoading
                                        }
                                    >
                                        <div className='flex items-start justify-between gap-2 sm:gap-3'>
                                            <div className='min-w-0 flex-1'>
                                                <p
                                                    className={cx(
                                                        'font-semibold text-foreground text-sm sm:text-sm',
                                                        convo.unread &&
                                                            'text-foreground',
                                                    )}
                                                >
                                                    {convo.contact.name}
                                                </p>
                                                <p
                                                    className={cx(
                                                        'mt-1 truncate text-xs text-muted-foreground',
                                                        textClasses.previewClass,
                                                    )}
                                                >
                                                    {convo.unread
                                                        ? 'NEW REPLY: '
                                                        : ''}
                                                    {convo.lastMessage}
                                                </p>
                                            </div>
                                            <span className='shrink-0 text-xs text-muted-foreground whitespace-nowrap'>
                                                {convo.timestamp}
                                            </span>
                                        </div>
                                        <p className='mt-2 truncate text-sm font-medium text-foreground/90'>
                                            Re: {convo.subject}
                                        </p>
                                        <div className='mt-3 flex justify-end'>
                                            <Badge
                                                className={cx(
                                                    'capitalize text-xs',
                                                    getStatusClasses(
                                                        convo.status,
                                                    ),
                                                )}
                                                aria-label={`Status: ${getStatusLabel(
                                                    convo.status,
                                                )}`}
                                            >
                                                {getStatusLabel(convo.status)}
                                            </Badge>
                                        </div>
                                    </ListRow>
                                );
                            })
                        )}
                    </div>
                </div>
            </ErrorBoundary>
        );
    },
);

InboxConversationList.displayName = 'InboxConversationList';
