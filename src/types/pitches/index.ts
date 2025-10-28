// Pitch related type definitions

import { MediaContact } from '../contacts';
import { PitchStatus } from '../common';

// Re-export common types for convenience
export type { PitchStatus } from '../common';

/**
 * Pitch interface representing a personalized pitch to a media contact
 */
export interface Pitch {
  /** Unique identifier for the pitch */
  id: number;
  /** The media contact this pitch is intended for */
  contact: MediaContact;
  /** Subject line of the pitch email */
  subject: string;
  /** Preview text (first line) of the pitch */
  preview: string;
  /** Full body content of the pitch */
  body: string;
  /** Current status of the pitch */
  status: PitchStatus;
  /** Whether the pitch has been edited from the AI-generated version */
  edited: boolean;
}

/**
 * New contact data for adding a new media contact
 */
export interface NewContactData {
  /** Full name of the contact */
  name: string;
  /** Media outlet or publication name */
  outlet: string;
  /** Email address of the contact */
  email: string;
  /** Topics or beats the contact covers */
  beats: string;
  /** Short professional bio to tailor pitches */
  bio?: string;
  /** Up to 5 links to authored work */
  authorLinks?: string[];
}

/**
 * Legacy Pitch interface for backward compatibility
 * @deprecated Use the new Pitch interface instead
 */
export interface LegacyPitch {
  id: string;
  title: string;
  content: string;
  contactIds: string[];
  status: 'draft' | 'sent' | 'responded' | 'rejected' | 'accepted';
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
}
