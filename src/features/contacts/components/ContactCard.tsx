import React from 'react';
import { ContactCardProps } from '../../../types/ui';
import { useContacts } from '../state/useContacts';
import { cx } from '../../../utils/cx';
import { Badge } from '../../../components/ui';

/**
 * ContactCard component for displaying a media contact's information
 */
const ContactCard: React.FC<ContactCardProps> = ({ contact, showMatch = true }) => {
  const { selectedContacts, toggleContact } = useContacts();
  const isSelected = selectedContacts.has(contact.id);

  return (
    <div
      className={cx(
        'flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm transition-colors hover:border-border-strong',
        isSelected && 'border-2 border-border-strong bg-muted/50'
      )}
      onClick={() => toggleContact(contact.id)}
    >
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        className="mt-1 h-4 w-4 cursor-pointer accent-foreground"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">{contact.outlet}</p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs">
            {contact.recommended && showMatch && contact.matchScore && (
              <Badge className="border-transparent bg-foreground text-accent-foreground">
                {contact.matchScore}% Match
              </Badge>
            )}
            {contact.userAdded && <Badge>User Added</Badge>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <Badge variant="subtle" className="capitalize">
            {contact.type}
          </Badge>
          <Badge variant="subtle">{contact.country}</Badge>
        </div>

        {showMatch && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Beats:</span> {contact.beats}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
