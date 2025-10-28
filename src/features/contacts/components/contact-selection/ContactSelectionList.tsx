import { MediaContact } from '../../../../types';
import { useContacts } from '../../state';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui';

const EMPTY_STATE = (
  <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
    <p className="mb-1 font-semibold text-foreground">No unpitched contacts available in this view.</p>
    <p>Adjust filters or import contacts to populate this tab.</p>
  </div>
);

type ContactSelectionListProps = {
  contacts: MediaContact[];
};

export const ContactSelectionList = ({ contacts }: ContactSelectionListProps) => {
  const { selectedContacts, toggleContact } = useContacts();

  if (contacts.length === 0) {
    return EMPTY_STATE;
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-10"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Outlet</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Beats</TableHead>
            <TableHead className="text-right">Match</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map(contact => {
            const isSelected = selectedContacts.has(contact.id);
            return (
              <TableRow key={contact.id} className={isSelected ? 'bg-muted/40' : undefined}>
                <TableCell className="w-10 align-middle">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleContact(contact.id)}
                    className="h-4 w-4"
                    aria-label={`Select ${contact.name}`}
                  />
                </TableCell>
                <TableCell className="font-semibold text-foreground">{contact.name}</TableCell>
                <TableCell className="text-muted-foreground">{contact.outlet}</TableCell>
                <TableCell className="capitalize">{contact.type}</TableCell>
                <TableCell>{contact.country}</TableCell>
                <TableCell className="uppercase">{contact.language}</TableCell>
                <TableCell className="max-w-[260px] truncate text-muted-foreground">{contact.beats}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">{contact.matchScore}%</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
