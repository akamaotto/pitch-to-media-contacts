import React from 'react';
import { cx } from '../../utils/cx';

export type HeaderVariant = 'default' | 'page' | 'section' | 'dialog';
export type HeaderSize = 'sm' | 'md' | 'lg';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  variant?: HeaderVariant;
  size?: HeaderSize;
}

type HeaderSlot = 'breadcrumb' | 'actions';

type HeaderForwardComponent<P> = React.ForwardRefExoticComponent<P & React.RefAttributes<any>> & {
  __headerSlot?: HeaderSlot;
};

const setSlot = <P,>(component: HeaderForwardComponent<P>, slot: HeaderSlot) => {
  component.__headerSlot = slot;
};

const DEFAULT_CONTEXT: { size: HeaderSize } = { size: 'md' };
const HeaderContext = React.createContext<{ size: HeaderSize } | undefined>(undefined);

const useHeaderContext = () => React.useContext(HeaderContext) ?? DEFAULT_CONTEXT;

const variantClass: Record<HeaderVariant, string> = {
  default: 'border-b border-border bg-surface',
  page: 'pb-4',
  section: 'pb-4',
  dialog: 'pb-4',
};

const variantGapClass: Record<HeaderVariant, string> = {
  default: 'space-y-4',
  page: 'space-y-4',
  section: 'space-y-3',
  dialog: 'space-y-3',
};

const sizeClass: Record<HeaderSize, string> = {
  sm: 'px-4 py-3',
  md: 'px-6 py-4',
  lg: 'px-6 py-6',
};

const titleSizeClass: Record<HeaderSize, string> = {
  sm: 'text-lg font-semibold',
  md: 'text-xl font-semibold tracking-tight',
  lg: 'text-3xl font-semibold tracking-tight',
};

const isSlot = (child: React.ReactNode, slot: HeaderSlot) =>
  React.isValidElement(child) && (child.type as HeaderForwardComponent<any>).__headerSlot === slot;

const distributeChildren = (children: React.ReactNode) => {
  const breadcrumbs: React.ReactNode[] = [];
  const actions: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (child === null || child === undefined || child === false) {
      return;
    }

    if (isSlot(child, 'breadcrumb')) {
      breadcrumbs.push(child);
      return;
    }

    if (isSlot(child, 'actions')) {
      actions.push(child);
      return;
    }

    content.push(child);
  });

  return { breadcrumbs, actions, content };
};

const HeaderBreadcrumb = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('text-xs font-semibold uppercase tracking-wide text-muted-foreground', className)}
      {...props}
    />
  )
) as HeaderForwardComponent<React.HTMLAttributes<HTMLDivElement>>;
HeaderBreadcrumb.displayName = 'HeaderBreadcrumb';
setSlot(HeaderBreadcrumb, 'breadcrumb');

const HeaderContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('space-y-2', className)} {...props} />
  )
);
HeaderContent.displayName = 'HeaderContent';

type HeaderTitleProps = React.HTMLAttributes<HTMLHeadingElement> & { icon?: React.ReactNode };

const HeaderTitle = React.forwardRef<HTMLHeadingElement, HeaderTitleProps>(
  ({ className, icon, children, ...props }, ref) => {
    const { size } = useHeaderContext();

    return (
      <h2
        ref={ref}
        className={cx('flex items-center gap-2 text-foreground', titleSizeClass[size], className)}
        {...props}
      >
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        {children}
      </h2>
    );
  }
);
HeaderTitle.displayName = 'HeaderTitle';

const HeaderSubtitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx('text-sm text-muted-foreground', className)} {...props} />
  )
);
HeaderSubtitle.displayName = 'HeaderSubtitle';

const HeaderActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cx('flex flex-wrap items-center gap-2', className)}
      {...props}
    />
  )
) as HeaderForwardComponent<React.HTMLAttributes<HTMLDivElement>>;
HeaderActions.displayName = 'HeaderActions';
setSlot(HeaderActions, 'actions');

type HeaderComponent = React.ForwardRefExoticComponent<HeaderProps & React.RefAttributes<HTMLElement>> & {
  Breadcrumb: typeof HeaderBreadcrumb;
  Content: typeof HeaderContent;
  Title: typeof HeaderTitle;
  Subtitle: typeof HeaderSubtitle;
  Actions: typeof HeaderActions;
};

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const { breadcrumbs, actions, content } = distributeChildren(children);

    const layout = (
      <>
        {breadcrumbs.length > 0 && <div className="space-y-2">{breadcrumbs}</div>}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {content.length > 0 && <div className="flex-1 space-y-2">{content}</div>}
          {actions.length > 0 && (
            <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      </>
    );

    const classes = cx(
      variantClass[variant],
      variantGapClass[variant],
      variant === 'default' ? sizeClass[size] : '',
      className
    );

    return (
      <HeaderContext.Provider value={{ size }}>
        {variant === 'dialog' ? (
          <div
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            className={classes}
            {...props}
          >
            {layout}
          </div>
        ) : (
          <header
            ref={ref}
            className={classes}
            {...props}
          >
            {layout}
          </header>
        )}
      </HeaderContext.Provider>
    );
  }
) as HeaderComponent;

Header.displayName = 'Header';
Header.Breadcrumb = HeaderBreadcrumb;
Header.Content = HeaderContent;
Header.Title = HeaderTitle;
Header.Subtitle = HeaderSubtitle;
Header.Actions = HeaderActions;

export { Header, HeaderBreadcrumb, HeaderContent, HeaderTitle, HeaderSubtitle, HeaderActions };
