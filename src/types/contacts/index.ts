// Contact related type definitions

import { ContactType, LanguageCode } from '../common';

// Re-export common types for convenience
export type { ContactType, LanguageCode } from '../common';

/**
 * Filter buckets that can be applied to the contacts list
 */
export interface ContactFilterSet {
  countries: string[];
  beats: string[];
  languages: LanguageCode[];
  mediaTypes: ContactType[];
}

export type ContactFilterCategory = keyof ContactFilterSet;

/**
 * Media Contact interface representing a media professional
 */
export interface MediaContact {
  /** Unique identifier for the contact */
  id: number;
  /** Initials derived from the contact's name */
  initials: string;
  /** Full name of the contact */
  name: string;
  /** Media outlet or publication name */
  outlet: string;
  /** Email address of the contact */
  email: string;
  /** Type of media professional */
  type: ContactType;
  /** Language code for communication */
  language: LanguageCode;
  /** Country where the contact is based */
  country: string;
  /** Topics or beats the contact covers */
  beats: string;
  /** Optional short bio for personalization */
  bio?: string;
  /** Optional list of article/author links */
  authorLinks?: string[];
  /** AI match score percentage (0-100) */
  matchScore: number;
  /** Whether the contact is recommended by AI */
  recommended: boolean;
  /** Whether a pitch has been sent to this contact */
  pitched: boolean;
  /** Whether the contact was manually added by the user */
  userAdded: boolean;
}

/**
 * Legacy Contact interface for backward compatibility
 * @deprecated Use MediaContact instead
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  role?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
