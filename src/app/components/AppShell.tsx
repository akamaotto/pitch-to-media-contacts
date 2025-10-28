import { ReactNode } from 'react';
import { ShellProviders } from './ShellProviders';
import { Navigation } from '../../components/ui/Navigation';

interface AppShellProps {
  children?: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => (
  <ShellProviders>
    <div className="app-shell">
      <Navigation />
      <main className="app-main">
        {children}
      </main>
    </div>
  </ShellProviders>
);

export default AppShell;
