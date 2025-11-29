import { ContactSelectionActions } from './ContactSelectionActions';
import { ContactSelectionList } from './ContactSelectionList';
import { ContactFiltersPanel } from './ContactFiltersPanel';
import NewContactModal from '../NewContactModal';
import { useContacts } from '../../state';
import { useApp } from '../../../../hooks/useApp';
import { Panel, Button, Badge } from '../../../../components/ui';

const ContactSelectionView = () => {
  const { getContactsByTab, getFiltersForTab, setFiltersForTab, toggleAll, addContact } = useContacts();
  const {
    selectedTab,
    showFilters,
    setShowFilters,
    showAddContactModal,
    setShowAddContactModal,
  } = useApp();

  const contactsToDisplay = getContactsByTab(selectedTab);
  const activeFilters = getFiltersForTab(selectedTab);

  const clearFilters = () =>
    setFiltersForTab(selectedTab, {
      countries: [],
      mediaTypes: [],
      languages: [],
      beats: [],
    });

  const applyPreset = (preset: 'usTech' | 'euClimate') => {
    if (preset === 'usTech') {
      setFiltersForTab(selectedTab, {
        ...activeFilters,
        countries: ['United States'],
        beats: ['Technology'],
      });
    }
    if (preset === 'euClimate') {
      setFiltersForTab(selectedTab, {
        ...activeFilters,
        countries: ['Germany', 'France', 'Netherlands'],
        beats: ['Climate', 'Sustainability'],
      });
    }
  };

  return (
    <Panel
      padding="md"
      className="space-y-4 shadow-sm bg-gradient-to-b from-surface/98 to-background/98"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Showing {contactsToDisplay.length} contacts
          </p>
          <p className="text-[11px] text-muted-foreground">
            Let the presets and filters surface the most relevant journalists, then select all in one click.
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Smart presets
          </span>
          <Button
            variant="subtle"
            size="sm"
            className="h-6 rounded-full border border-transparent bg-primary/5 px-3 text-[10px] font-medium text-primary hover:bg-primary/8 hover:border-primary/30 transition-colors duration-150"
            onClick={() => applyPreset('usTech')}
          >
            US tech journalists
          </Button>
          <Button
            variant="subtle"
            size="sm"
            className="h-6 rounded-full border border-transparent bg-primary/5 px-3 text-[10px] font-medium text-primary hover:bg-primary/8 hover:border-primary/30 transition-colors duration-150"
            onClick={() => applyPreset('euClimate')}
          >
            EU climate reporters
          </Button>
        </div>
      </div>

      <ContactSelectionActions
        totalInView={contactsToDisplay.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onSelectAll={() => toggleAll(true, selectedTab)}
        onDeselectAll={() => toggleAll(false, selectedTab)}
        onClearFilters={clearFilters}
        onAddContact={() => setShowAddContactModal(true)}
      />

      <div className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary/15 bg-primary/3 px-3 py-2 text-[10px] text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">
            {contactsToDisplay.length}
          </span>{' '}
          contacts match your current strategy.
          <span className="ml-1 hidden text-muted-foreground/90 sm:inline">
            Fine-tune filters or presets, then promote them into your pitch list in one click.
          </span>
        </div>
        <Badge className="hidden shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-primary sm:inline-flex">
          Curated set
        </Badge>
      </div>

      {showFilters && <ContactFiltersPanel />}

      <ContactSelectionList contacts={contactsToDisplay} />

      <NewContactModal
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onSubmit={addContact}
      />
    </Panel>
  );
};

export default ContactSelectionView;
