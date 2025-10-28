// UI related type definitions

import { Message } from '../conversations';
import { NewContactData } from '../pitches';
import { ButtonVariant, ButtonSize } from '../common';

// Re-export common types for convenience
export type { ButtonVariant, ButtonSize } from '../common';

/**
 * Alert component props
 */
export interface AlertProps {
  /** Content to display inside the alert */
  children: React.ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Alert Description component props
 */
export interface AlertDescriptionProps {
  /** Text content to display */
  children: React.ReactNode;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * KPI Card component props
 */
export interface KPICardProps {
  /** Title label for the KPI */
  title: string;
  /** Value to display */
  value: string | number;
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** CSS class for coloring the icon and value */
  colorClass: string;
}

/**
 * New Contact Modal component props
 */
export interface NewContactModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should close */
  onClose: () => void;
  /** Function to call when form is submitted */
  onSubmit: (contact: NewContactData) => void;
}

/**
 * Contact Card component props
 */
export interface ContactCardProps {
  /** The contact data to display */
  contact: {
    id: number;
    name: string;
    outlet: string;
    type: string;
    country: string;
    beats: string;
    matchScore?: number;
    recommended?: boolean;
    userAdded?: boolean;
  };
  /** Whether to show the match score badge */
  showMatch?: boolean;
}

/**
 * Message Bubble component props
 */
export interface MessageBubbleProps {
  /** The message data to display */
  message: Message;
}

/**
 * Status Filter option props
 */
export interface StatusFilterOption {
  /** Unique identifier for the filter */
  id: string;
  /** Display name for the filter */
  name: string;
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** CSS class for coloring the icon */
  color: string;
}

/**
 * Tab option props
 */
export interface TabOption {
  /** Unique identifier for the tab */
  id: string;
  /** Display name for the tab */
  name: string;
}

/**
 * Legacy Button component props for backward compatibility
 * @deprecated Consider using more specific button interfaces
 */
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * Legacy Modal component props for backward compatibility
 * @deprecated Consider using more specific modal interfaces
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}