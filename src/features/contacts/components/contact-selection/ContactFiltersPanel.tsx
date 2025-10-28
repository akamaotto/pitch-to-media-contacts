import React, {useMemo} from 'react';
import {useContacts} from '../../state';
import {useApp} from '../../../../hooks/useApp';
import {Panel, Button, MultiSelect} from '../../../../components/ui';

const Section: React.FC<{title: string; children: React.ReactNode}> = ({
    title,
    children,
}) => (
    <div>
        <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            {title}
        </p>
        <div className='flex flex-col gap-1'>{children}</div>
    </div>
);

const CheckboxRow: React.FC<{
    id: string;
    label: string;
    checked: boolean;
    onChange: () => void;
}> = ({id, label, checked, onChange}) => (
    <label htmlFor={id} className='flex items-center gap-2 px-0 py-1 text-sm'>
        <input
            id={id}
            type='checkbox'
            className='h-4 w-4'
            checked={checked}
            onChange={onChange}
        />
        <span className='flex-1'>{label}</span>
    </label>
);

export const ContactFiltersPanel: React.FC = () => {
    const {selectedTab} = useApp();
    const {mediaContacts, getFiltersForTab, setFiltersForTab} = useContacts();

    const filters = getFiltersForTab(selectedTab);

    const options = useMemo(() => {
        const countries = new Set<string>();
        const mediaTypes = new Set<string>();
        const languages = new Set<string>();
        const beats = new Set<string>();
        mediaContacts.forEach((c) => {
            if (c.country) countries.add(c.country);
            if (c.type) mediaTypes.add(c.type);
            if (c.language) languages.add(c.language);
            if (c.beats) {
                c.beats
                    .split(',')
                    .map((b) => b.trim())
                    .filter(Boolean)
                    .forEach((b) => beats.add(b));
            }
        });
        return {
            countries: Array.from(countries).sort(),
            mediaTypes: Array.from(mediaTypes).sort(),
            languages: Array.from(languages).sort(),
            beats: Array.from(beats).sort(),
        };
    }, [mediaContacts]);

    const toggle = (key: keyof typeof filters, value: string) => {
        const current = new Set(filters[key] as string[]);
        if (current.has(value)) current.delete(value);
        else current.add(value);
        setFiltersForTab(selectedTab, {
            ...filters,
            [key]: Array.from(current),
        });
    };

    const clearAll = () =>
        setFiltersForTab(selectedTab, {
            countries: [],
            mediaTypes: [],
            languages: [],
            beats: [],
        });

    const groups = useMemo(
        () => [
            {
                placeholder: 'Media Types',
                options: options.mediaTypes.map((v) => ({value: v})),
                value: filters.mediaTypes as unknown as string[],
                onChange: (vals: string[]) =>
                    setFiltersForTab(selectedTab, {
                        ...filters,
                        mediaTypes: vals as any,
                    }),
            },
            {
                placeholder: 'Countries',
                options: options.countries.map((v) => ({value: v})),
                value: filters.countries,
                onChange: (vals: string[]) =>
                    setFiltersForTab(selectedTab, {
                        ...filters,
                        countries: vals,
                    }),
            },
            {
                placeholder: 'Languages',
                options: options.languages.map((v) => ({value: v})),
                value: filters.languages as unknown as string[],
                onChange: (vals: string[]) =>
                    setFiltersForTab(selectedTab, {
                        ...filters,
                        languages: vals as any,
                    }),
            },
            {
                placeholder: 'Beats',
                options: options.beats.map((v) => ({value: v})),
                value: filters.beats,
                onChange: (vals: string[]) =>
                    setFiltersForTab(selectedTab, {...filters, beats: vals}),
            },
        ],
        [options, filters, selectedTab, setFiltersForTab],
    );

    const columns = Math.max(1, groups.length);

    return (
        <Panel padding='md' className='space-y-3 border-solid border-slate-800'>
            <div
                className='grid items-start gap-3'
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
            >
                {groups.map((g, idx) => (
                    <div key={`${g.placeholder}-${idx}`} className='flex flex-col'>
                        <MultiSelect
                            options={g.options}
                            value={g.value}
                            onChange={g.onChange}
                            placeholder={g.placeholder}
                            panelLabel={g.placeholder}
                            widthClass='w-full'
                        />
                        {g.value && g.value.length > 0 && (
                            <div className='mt-2 text-xs text-foreground'>
                                {(g.value as string[]).join(', ')}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Panel>
    );
};

export default ContactFiltersPanel;
