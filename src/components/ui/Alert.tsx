import React from 'react';
import { AlertProps } from '../../types/ui';

/**
 * Alert component for displaying important messages
 */
const Alert: React.FC<AlertProps> = ({ children, className = '' }) => (
  <div className={`p-4 rounded-xl bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 flex items-start gap-3 ${className}`}>
    {children}
  </div>
);

export default Alert;