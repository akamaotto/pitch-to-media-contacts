import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useConversations } from '../state/useConversations';
import { Conversation } from '../../../types';
import { cx } from '../../../utils/cx';

/**
 * ConversationList component for displaying a list of conversations
 */
const ConversationList: React.FC = () => {
  const {
    getFilteredConversations,
    getConversationCardClasses,
    getUnreadTextClasses,
    handleSelectConversation,
    getStatusLabel,
  } = useConversations();

  // For now, we'll use a simple filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMediaType, setFilterMediaType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        const result = await getFilteredConversations(filterStatus, filterMediaType, filterCountry);
        setFilteredConversations(result);
      } catch (err) {
        console.error('Failed to apply filters:', err);
      }
    };
    
    applyFilters();
  }, [filterStatus, filterMediaType, filterCountry, getFilteredConversations]);

  return (
    <div className="inbox-card">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition"
        />
      </div>

      {filteredConversations.length === 0 ? (
        <div className="empty-panel mt-6">
          No threads match your filters.
        </div>
      ) : (
        <div className="conversation-list mt-6">
          {filteredConversations.map(convo => {
            const textClasses = getUnreadTextClasses(convo);

            return (
              <button
                key={convo.id}
                onClick={() => handleSelectConversation(convo)}
                className={getConversationCardClasses(convo, false)}
                type="button"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={cx('conversation-card__title', textClasses.nameClass)}>
                    {convo.contact.name}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{convo.timestamp}</span>
                </div>
                <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                  Re: {convo.subject}
                </p>
                <p className={cx('conversation-card__preview', textClasses.previewClass)}>
                  {convo.unread ? 'NEW REPLY: ' : ''}
                  {convo.lastMessage}
                </p>
                <div className="flex justify-end mt-3">
                  <span className={cx('conversation-card__tag',
                    convo.status === 'awaitingResponse' ? 'bg-yellow-100 text-yellow-700' :
                    convo.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    convo.status === 'requestingPay' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  )}>
                    {getStatusLabel(convo.status)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
