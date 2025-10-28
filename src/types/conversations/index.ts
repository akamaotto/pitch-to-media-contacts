// Conversation related type definitions

import { MediaContact } from '../contacts';
import { ConversationStatus, MessageSender } from '../common';

// Re-export common types for convenience
export type { ConversationStatus, MessageSender } from '../common';

/**
 * Message interface representing a single message in a conversation
 */
export interface Message {
  /** Name of the message sender */
  sender: string;
  /** Content of the message */
  text: string;
  /** Timestamp when the message was sent */
  timestamp: string;
  /** Whether this is a reply from the contact */
  isReply?: boolean;
}

/**
 * Conversation interface representing a thread of messages with a contact
 */
export interface Conversation {
  /** Unique identifier for the conversation */
  id: number;
  /** The media contact involved in this conversation */
  contact: MediaContact;
  /** Subject line of the conversation */
  subject: string;
  /** Last message in the conversation (preview) */
  lastMessage: string;
  /** Timestamp of the last activity */
  timestamp: string;
  /** Current status of the conversation */
  status: ConversationStatus;
  /** Whether the conversation has unread messages */
  unread: boolean;
  /** Array of all messages in this conversation */
  messages: Message[];
}

/**
 * Legacy Message interface for backward compatibility
 * @deprecated Use the new Message interface instead
 */
export interface LegacyMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
}

/**
 * Legacy Conversation interface for backward compatibility
 * @deprecated Use the new Conversation interface instead
 */
export interface LegacyConversation {
  id: string;
  contactId: string;
  subject: string;
  messages: LegacyMessage[];
  createdAt: Date;
  updatedAt: Date;
}