import React from 'react';
import {ErrorBoundary} from '../../../components/ui';
import {cx} from '../../../utils/cx';

type StatusFilter = {
    id: string;
    name: string;
};

type InboxFiltersPanelProps = {
    statusFilters: StatusFilter[];
    activeStatus: string;
    statusCounts: Record<string, number>;
    mediaTypes: string[];
    selectedMediaTypes: string[];
    onMediaTypesChange: (values: string[]) => void;
    countries: string[];
    selectedCountries: string[];
    onCountriesChange: (values: string[]) => void;
    onStatusChange: (status: string) => void;
    className?: string;
};

export const InboxFiltersPanel = React.memo(
    ({
        statusFilters,
        activeStatus,
        statusCounts,
        mediaTypes,
        selectedMediaTypes,
        onMediaTypesChange,
        countries,
        selectedCountries,
        onCountriesChange,
        onStatusChange,
        className,
    }: InboxFiltersPanelProps) => {
        // Keep filters panel static; avoid visible refresh or skeletons
        // Multi-select checkboxes are synchronous; no loaders

        const handleStatusChange = async (status: string) => {
            // Apply immediately without loading states to prevent list refresh
            onStatusChange(status);
        };

        const toggleMediaType = (value: string) => {
            const set = new Set(selectedMediaTypes);
            if (set.has(value)) set.delete(value);
            else set.add(value);
            onMediaTypesChange(Array.from(set));
        };

        const toggleCountry = (value: string) => {
            const set = new Set(selectedCountries);
            if (set.has(value)) set.delete(value);
            else set.add(value);
            onCountriesChange(Array.from(set));
        };

        return (
            <ErrorBoundary
                onError={(error) => {
                    console.error('InboxFiltersPanel error:', error);
                }}
            >
                <aside
                    className={cx('flex flex-col gap-4 py-6 px-4', className)}
                >
                    <div
                        className='flex flex-col gap-2'
                        role='radiogroup'
                        aria-labelledby='status-filter-label'
                    >
                        <h3 id='status-filter-label' className='sr-only'>
                            Status Filters
                        </h3>
                        {statusFilters.map((filter) => {
                            const count = statusCounts[filter.id] ?? 0;
                            const isActive = activeStatus === filter.id;
                            const badgeId = `status-badge-${filter.id}`;
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() =>
                                        handleStatusChange(filter.id)
                                    }
                                    className={cx(
                                        'flex items-center justify-between rounded-md px-3 py-2 text-sm transition min-h-[44px] border text-left',
                                        isActive
                                            ? 'bg-foreground text-accent-foreground border-foreground shadow-sm'
                                            : 'border-border bg-surface text-foreground hover:bg-muted',
                                    )}
                                    type='button'
                                    role='radio'
                                    aria-checked={isActive}
                                    aria-describedby={badgeId}
                                >
                                    <span className='flex-1 text-left'>
                                        {filter.name}
                                    </span>
                                    <span
                                        id={badgeId}
                                        className={cx(
                                            'shrink-0 rounded-full px-2 py-0.5 text-xs',
                                            isActive
                                                ? 'bg-accent-foreground/20 text-accent-foreground'
                                                : 'bg-slate-200 text-slate-700',
                                        )}
                                        aria-label={`${count} ${filter.name.toLowerCase()} conversations`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className='flex flex-col gap-3'>
                        <div>
                            <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                Media Types
                            </p>
                            <div className='flex flex-col gap-1'>
                                {mediaTypes.map((type) => {
                                    const id = `media-${type}`;
                                    const checked =
                                        selectedMediaTypes.includes(type);
                                    return (
                                        <label
                                            key={type}
                                            htmlFor={id}
                                            className='flex items-center gap-2 px-0 py-1 text-sm'
                                        >
                                            <input
                                                id={id}
                                                type='checkbox'
                                                checked={checked}
                                                onChange={() =>
                                                    toggleMediaType(type)
                                                }
                                                className='h-4 w-4'
                                            />
                                            <span className='flex-1'>
                                                {type}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                Countries
                            </p>
                            <div className='flex flex-col gap-1'>
                                {countries.map((country) => {
                                    const id = `country-${country}`;
                                    const checked =
                                        selectedCountries.includes(country);
                                    return (
                                        <label
                                            key={country}
                                            htmlFor={id}
                                            className='flex items-center gap-2 px-0 py-1 text-sm'
                                        >
                                            <input
                                                id={id}
                                                type='checkbox'
                                                checked={checked}
                                                onChange={() =>
                                                    toggleCountry(country)
                                                }
                                                className='h-4 w-4'
                                            />
                                            <span className='flex-1'>
                                                {country}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>
            </ErrorBoundary>
        );
    },
);

InboxFiltersPanel.displayName = 'InboxFiltersPanel';
