import React from 'react';
import { cx } from '../../utils/cx';

type ButtonVariant = 'default' | 'outline' | 'subtle' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantClass: Record<ButtonVariant, string> = {
  default: 'bg-accent text-accent-foreground shadow-sm hover:bg-accent/90',
  outline: 'border border-border bg-background hover:bg-muted text-foreground',
  subtle: 'bg-muted text-foreground hover:bg-muted/80',
  ghost: 'hover:bg-muted text-foreground',
  destructive: 'bg-danger text-white hover:bg-danger/90',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-9 px-4 text-sm',
  lg: 'h-10 px-5 text-base',
  icon: 'h-9 w-9',
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cx(baseClass, variantClass[variant], sizeClass[size], className)}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
