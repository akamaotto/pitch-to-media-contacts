import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import 'sonner/dist/styles.css';

type ToastContextType = {
  showToast: (message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be used within a ToasterProvider');
  return ctx;
};

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = useCallback((message: string) => toast(message), []);
  const showSuccess = useCallback((message: string) => toast.success(message), []);
  const showError = useCallback((message: string) => toast.error(message), []);

  const value = useMemo(() => ({ showToast, showSuccess, showError }), [showToast, showSuccess, showError]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SonnerToaster position="top-right" richColors expand={true} closeButton duration={3500} />
    </ToastContext.Provider>
  );
};
