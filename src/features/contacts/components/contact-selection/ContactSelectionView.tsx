import { ContactSelectionActions } from './ContactSelectionActions';
import { ContactSelectionList } from './ContactSelectionList';
import { ContactFiltersPanel } from './ContactFiltersPanel';
import NewContactModal from '../NewContactModal';
import { useContacts } from '../../state';
import { useApp } from '../../../../hooks/useApp';
import { Panel } from '../../../../components/ui';

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

  const clearFilters = () => setFiltersForTab(selectedTab, { countries: [], mediaTypes: [], languages: [], beats: [] });

  return (
    <Panel padding="md" className="space-y-5 shadow-sm">
      <ContactSelectionActions
        totalInView={contactsToDisplay.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onSelectAll={() => toggleAll(true, selectedTab)}
        onDeselectAll={() => toggleAll(false, selectedTab)}
        onClearFilters={clearFilters}
        onAddContact={() => setShowAddContactModal(true)}
      />

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
