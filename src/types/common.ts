// Common union types used across the application

/**
 * Union type for main application views
 */
export type MainView = 'contacts' | 'generating' | 'review' | 'sent';

/**
 * Union type for contact selection tabs
 */
export type ContactTab = 'recommended' | 'all' | 'myContacts' | 'pitched';

/**
 * Union type for sending status
 */
export type SendingStatus = 'idle' | 'sending' | 'sent';

/**
 * Union type for media contact types
 */
export type ContactType =
  | 'Journalist'
  | 'Podcaster'
  | 'Blogger'
  | 'Youtuber'
  | 'Tiktoker'
  | 'TV Journalist'
  | 'Magazine Writer'
  | 'Newspaper Writer';

/**
 * Union type for conversation status
 */
export type ConversationStatus = 'sent' | 'awaitingResponse' | 'rejected' | 'requestingPay' | 'draft';

/**
 * Union type for pitch status
 */
export type PitchStatus = 'ready' | 'sent' | 'draft' | 'edited';

/**
 * Union type for language codes
 */
export type LanguageCode = 'EN' | string;

/**
 * Union type for button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

/**
 * Union type for button sizes
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Union type for message senders
 */
export type MessageSender = 'user' | 'contact';
