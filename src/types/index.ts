// Type definitions for the application

// Export all type definitions from subdirectories
export * from './contacts/index';
export * from './conversations/index';
export * from './pitches/index';
export * from './ui/index';
export * from './common';

// Re-export commonly used types for convenience
export type {
  MediaContact,
  ContactType,
  LanguageCode
} from './contacts/index';

export type {
  Conversation,
  Message,
  ConversationStatus
} from './conversations/index';

export type {
  Pitch,
  PitchStatus,
  NewContactData
} from './pitches/index';

export type {
  AlertProps,
  AlertDescriptionProps,
  KPICardProps,
  NewContactModalProps,
  ContactCardProps,
  MessageBubbleProps,
  StatusFilterOption,
  TabOption
} from './ui/index';

export type {
  MainView,
  ContactTab,
  SendingStatus,
  ButtonVariant,
  ButtonSize,
  MessageSender
} from './common';