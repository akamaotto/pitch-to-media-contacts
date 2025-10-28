import { useCallback, useMemo, useState } from 'react';
import { ContactFilterSet, ContactTab, MediaContact, NewContactData } from '../../../types';
import { initialContactsData } from './contactsData';

const createFilterSet = (seed?: ContactFilterSet): ContactFilterSet => ({
  countries: seed?.countries ? [...seed.countries] : [],
  beats: seed?.beats ? [...seed.beats] : [],
  languages: seed?.languages ? [...seed.languages] : [],
  mediaTypes: seed?.mediaTypes ? [...seed.mediaTypes] : [],
});

const aiRecommendedFilters: ContactFilterSet = {
  countries: ['Nigeria', 'Kenya'],
  beats: ['Startups', 'AI', 'Entrepreneurship', 'Enterprise Tech'],
  languages: ['EN'],
  mediaTypes: ['Podcaster', 'TV Journalist', 'Magazine Writer'],
};

const filterContacts = (contacts: MediaContact[], filters: ContactFilterSet) =>
  contacts.filter(contact => {
    const matchesCountry =
      filters.countries.length === 0 ||
      filters.countries.some(country => country.toLowerCase() === contact.country.toLowerCase());

    const matchesLanguage =
      filters.languages.length === 0 ||
      filters.languages.some(language => language.toLowerCase() === contact.language.toLowerCase());

    const matchesMediaType =
      filters.mediaTypes.length === 0 ||
      filters.mediaTypes.some(type => type.toLowerCase() === contact.type.toLowerCase());

    const normalizedBeats = contact.beats.toLowerCase();
    const matchesBeats =
      filters.beats.length === 0 ||
      filters.beats.some(beat => normalizedBeats.includes(beat.toLowerCase()));

    return matchesCountry && matchesLanguage && matchesMediaType && matchesBeats;
  });

export const useContactsState = (preloadedData?: { contacts: MediaContact[]; tab?: string }) => {
  const [mediaContacts, setMediaContacts] = useState<MediaContact[]>(() =>
    preloadedData?.contacts || initialContactsData.map(contact => ({ ...contact }))
  );
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [filtersByTab, setFiltersByTab] = useState<Record<ContactTab, ContactFilterSet>>(() => ({
    recommended: createFilterSet(aiRecommendedFilters),
    all: createFilterSet(),
    myContacts: createFilterSet(),
    pitched: createFilterSet(),
  }));

  const getContactsByTab = useCallback(
    (tab: ContactTab) => {
      let base: MediaContact[];

      switch (tab) {
        case 'recommended':
          base = mediaContacts.filter(contact => contact.recommended && !contact.pitched);
          break;
        case 'all':
          base = mediaContacts.filter(contact => !contact.pitched);
          break;
        case 'myContacts':
          base = mediaContacts.filter(contact => contact.userAdded && !contact.pitched);
          break;
        case 'pitched':
          base = mediaContacts.filter(contact => contact.pitched);
          break;
        default:
          base = mediaContacts;
          break;
      }

      const filters = filtersByTab[tab];
      return filters ? filterContacts(base, filters) : base;
    },
    [filtersByTab, mediaContacts]
  );

  const getFiltersForTab = useCallback(
    (tab: ContactTab) => filtersByTab[tab],
    [filtersByTab]
  );

  const setFiltersForTab = useCallback(
    (tab: ContactTab, nextFilters: ContactFilterSet) => {
      setFiltersByTab(prev => ({
        ...prev,
        [tab]: createFilterSet(nextFilters),
      }));
    },
    []
  );

  const totalPitchesSent = useMemo(
    () => mediaContacts.filter(contact => contact.pitched).length,
    [mediaContacts]
  );

  const showPitchedTab = totalPitchesSent > 0;

  const addContact = useCallback(
    (newContact: NewContactData) => {
      const maxId = mediaContacts.length > 0 ? Math.max(...mediaContacts.map(contact => contact.id)) : 0;
      const newId = maxId + 1;
      const contactWithDefaults: MediaContact = {
        ...newContact,
        id: newId,
        initials: newContact.name
          .split(' ')
          .map(namePart => namePart[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || '??',
        type: 'Journalist',
        country: 'Nigeria',
        language: 'EN',
        matchScore: 0,
        recommended: false,
        pitched: false,
        userAdded: true,
        bio: newContact.bio,
        authorLinks: newContact.authorLinks?.slice(0, 5) || [],
      };
      setMediaContacts(prev => [...prev, contactWithDefaults]);
    },
    [mediaContacts]
  );

  const updateContactsAsPitched = useCallback((contactIds: number[]) => {
    setMediaContacts(prevContacts =>
      prevContacts.map(contact =>
        contactIds.includes(contact.id) ? { ...contact, pitched: true } : contact
      )
    );
  }, []);

  const toggleContact = useCallback((id: number) => {
    setSelectedContacts(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  const toggleAll = useCallback(
    (select: boolean, currentTab: ContactTab) => {
      if (select) {
        const ids = getContactsByTab(currentTab).map(contact => contact.id);
        setSelectedContacts(new Set(ids));
      } else {
        setSelectedContacts(new Set());
      }
    },
    [getContactsByTab]
  );

  const autoSelectRecommended = useCallback(() => {
    if (!showPitchedTab) {
      const recommendedIds = getContactsByTab('recommended').map(contact => contact.id);
      setSelectedContacts(new Set(recommendedIds));
    }
  }, [getContactsByTab, showPitchedTab]);

  return useMemo(
    () => ({
      mediaContacts,
      selectedContacts,
      setSelectedContacts,
      totalPitchesSent,
      showPitchedTab,
      getContactsByTab,
      getFiltersForTab,
      setFiltersForTab,
      addContact,
      updateContactsAsPitched,
      toggleContact,
      toggleAll,
      autoSelectRecommended,
      setMediaContacts,
    }),
    [
      mediaContacts,
      selectedContacts,
      totalPitchesSent,
      showPitchedTab,
      getContactsByTab,
      getFiltersForTab,
      setFiltersForTab,
      addContact,
      updateContactsAsPitched,
      toggleContact,
      toggleAll,
      autoSelectRecommended,
    ]
  );
};

export type ContactsState = ReturnType<typeof useContactsState>;
