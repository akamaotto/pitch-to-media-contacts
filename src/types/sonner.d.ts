declare module 'sonner' {
  import * as React from 'react';
  export interface ToasterProps {
    position?:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right';
    duration?: number;
    richColors?: boolean;
    closeButton?: boolean;
    expand?: boolean;
  }
  export const Toaster: React.FC<ToasterProps>;
  export const toast: {
    (message: string): void;
    success(message: string): void;
    error(message: string): void;
    info?(message: string): void;
    warning?(message: string): void;
  };
}

