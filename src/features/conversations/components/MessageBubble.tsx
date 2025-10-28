import React from 'react';
import { MessageBubbleProps } from '../../../types/ui';
import { cx } from '../../../utils/cx';

/**
 * MessageBubble component for displaying a single message in a conversation
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isReply = message.isReply;

  return (
    <div className={cx('flex', isReply ? 'justify-start' : 'justify-end')}>
      <div className={cx('message-bubble', isReply ? 'message-bubble--contact' : 'message-bubble--user')}>
        <p
          className={cx(
            'mb-1 text-sm font-semibold',
            isReply ? 'text-foreground' : 'text-accent-foreground'
          )}
        >
          {message.sender}
        </p>
        <p
          className={cx(
            'text-sm leading-relaxed whitespace-pre-wrap',
            isReply ? 'text-foreground/90' : 'text-accent-foreground/90'
          )}
        >
          {message.text}
        </p>
        <span
          className={cx(
            'mt-2 block text-right text-xs',
            isReply ? 'text-muted-foreground/70' : 'text-accent-foreground/70'
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
