import { useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { useContacts } from '../../features/contacts';
import { useConversations } from '../../features/conversations';
import { ContactsPane } from '../panes/contacts/ContactsPane';
import { InboxPane } from '../panes/inbox/InboxPane';
import { ComposerPane } from '../panes/composer/ComposerPane';
import { cx } from '../../utils/cx';

export const ShellContent = () => {
  const { activeSurface, setActiveSurface, selectedTab, setSelectedTab } = useApp();
  const { showPitchedTab } = useContacts();
  const { clearSelectedConversation } = useConversations();

  useEffect(() => {
    if (activeSurface !== 'inbox') {
      clearSelectedConversation();
    }
  }, [activeSurface, clearSelectedConversation]);

  useEffect(() => {
    if (activeSurface === 'inbox' && showPitchedTab && selectedTab !== 'pitched') {
      setSelectedTab('pitched');
    }
  }, [activeSurface, selectedTab, setSelectedTab, showPitchedTab]);

  return (
    <div className={cx('app-shell-canvas')}>
      <div className="app-shell">
        <div className="shell-main">
          {activeSurface === 'contacts' && (
            <div className="shell-stage">
              <ContactsPane onNavigate={setActiveSurface} />
            </div>
          )}

          {activeSurface === 'inbox' && (
            <div className="shell-stage">
              <InboxPane onNavigate={setActiveSurface} />
            </div>
          )}

          {activeSurface === 'composer' && (
            <div className="shell-stage">
              <ComposerPane onNavigate={setActiveSurface} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
