import { act, renderHook } from '@testing-library/react';
import { useContactsState } from './useContactsState';

describe('useContactsState', () => {
  it('applies AI recommended filters to the recommended tab', () => {
    const { result } = renderHook(() => useContactsState());

    const recommended = result.current.getContactsByTab('recommended');

    expect(recommended).toHaveLength(3);
    expect(recommended.every(contact => ['Nigeria', 'Kenya'].includes(contact.country))).toBe(true);
    expect(recommended.every(contact => contact.language === 'EN')).toBe(true);
    expect(
      recommended.every(contact =>
        ['Podcaster', 'TV Journalist', 'Magazine Writer'].includes(contact.type)
      )
    ).toBe(true);
  });

  it('returns all unpitched contacts without filters on the all tab', () => {
    const { result } = renderHook(() => useContactsState());

    const allContacts = result.current.getContactsByTab('all');

    expect(allContacts).toHaveLength(9);
    expect(allContacts.some(contact => contact.language === 'FR')).toBe(true);
  });

  it('auto-selects the filtered recommended contacts', () => {
    const { result } = renderHook(() => useContactsState());

    act(() => {
      result.current.autoSelectRecommended();
    });

    const selectedIds = Array.from(result.current.selectedContacts.values());
    expect(selectedIds).toHaveLength(3);
    expect(selectedIds).toEqual(expect.arrayContaining([2, 3, 4]));
  });
});
