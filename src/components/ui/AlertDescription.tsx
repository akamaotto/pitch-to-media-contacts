import React from 'react';
import { AlertDescriptionProps } from '../../types/ui';

/**
 * AlertDescription component for displaying alert text content
 */
const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);

export default AlertDescription;