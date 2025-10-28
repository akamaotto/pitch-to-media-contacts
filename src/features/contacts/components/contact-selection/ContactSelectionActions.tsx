import { Filter, PlusCircle } from 'lucide-react';
import { Button } from '../../../../components/ui';

type ContactSelectionActionsProps = {
  totalInView: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClearFilters: () => void;
  onAddContact: () => void;
};

export const ContactSelectionActions = ({
  totalInView,
  showFilters,
  onToggleFilters,
  onSelectAll,
  onDeselectAll,
  onClearFilters,
  onAddContact,
}: ContactSelectionActionsProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={onSelectAll} variant="subtle" size="sm">
        Select All ({totalInView})
      </Button>
      <Button onClick={onDeselectAll} variant="subtle" size="sm">
        Deselect All
      </Button>
      <Button onClick={onClearFilters} variant="subtle" size="sm">
        Clear Filters
      </Button>
      <Button onClick={onToggleFilters} variant="ghost" size="sm" className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>
    </div>
    <div>
      <Button onClick={onAddContact} variant="outline" size="sm" className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Add New Contact
      </Button>
    </div>
  </div>
);
