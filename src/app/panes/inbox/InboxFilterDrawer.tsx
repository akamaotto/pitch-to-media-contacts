import {X} from 'lucide-react';
import {Button} from '../../../components/ui';
import {cx} from '../../../utils/cx';

type StatusFilter = {
    id: string;
    name: string;
};

type InboxFilterDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
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
};

export const InboxFilterDrawer = ({
    isOpen,
    onClose,
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
}: InboxFilterDrawerProps) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className='fixed inset-0 z-40 bg-black/50 md:hidden'
                onClick={onClose}
                aria-hidden='true'
            />

            {/* Drawer */}
            <div
                className={cx(
                    'fixed inset-y-0 left-0 z-50 w-96 transform bg-surface shadow-lg transition-transform duration-300 ease-in-out md:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className='flex h-full flex-col'>
                    {/* Header */}
                    <div className='flex items-center justify-between border-b border-border p-4'>
                        <h2 className='text-lg font-semibold'>Filters</h2>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={onClose}
                            aria-label='Close filters'
                        >
                            <X className='h-4 w-4' />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className='flex-1 overflow-y-auto p-4'>
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
                                            onStatusChange(filter.id)
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
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                            aria-label={`${count} ${filter.name.toLowerCase()} conversations`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className='mt-6 flex flex-col gap-4'>
                            <div>
                                <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                    Media Types
                                </p>
                                <div className='flex flex-col gap-1'>
                                    {mediaTypes.map((type) => {
                                        const id = `drawer-media-${type}`;
                                        const checked =
                                            selectedMediaTypes.includes(type);
                                        return (
                                            <label
                                                key={type}
                                                htmlFor={id}
                                                className='flex items-center gap-2 px-1 py-2 text-sm'
                                            >
                                                <input
                                                    id={id}
                                                    type='checkbox'
                                                    checked={checked}
                                                    onChange={() => {
                                                        const set = new Set(
                                                            selectedMediaTypes,
                                                        );
                                                        if (set.has(type))
                                                            set.delete(type);
                                                        else set.add(type);
                                                        onMediaTypesChange(
                                                            Array.from(set),
                                                        );
                                                    }}
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
                                        const id = `drawer-country-${country}`;
                                        const checked =
                                            selectedCountries.includes(country);
                                        return (
                                            <label
                                                key={country}
                                                htmlFor={id}
                                                className='flex items-center gap-2 px-1 py-2 text-sm'
                                            >
                                                <input
                                                    id={id}
                                                    type='checkbox'
                                                    checked={checked}
                                                    onChange={() => {
                                                        const set = new Set(
                                                            selectedCountries,
                                                        );
                                                        if (set.has(country))
                                                            set.delete(country);
                                                        else set.add(country);
                                                        onCountriesChange(
                                                            Array.from(set),
                                                        );
                                                    }}
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
                    </div>

                    {/* Footer */}
                    <div className='border-t border-border p-4'>
                        <Button
                            onClick={onClose}
                            className='w-full'
                            aria-label='Apply filters and close'
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
