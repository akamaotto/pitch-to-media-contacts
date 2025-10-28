import React, {useEffect, useMemo, useRef, useState} from 'react';
import {cx} from '../../utils/cx';

export type MultiSelectOption = {
    value: string;
    label?: string;
};

export type MultiSelectProps = {
    options: MultiSelectOption[];
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    panelLabel?: string; // label shown inside dropdown header
    className?: string;
    disabled?: boolean;
    widthClass?: string; // allow consumer to size the trigger
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select…',
    panelLabel,
    className,
    disabled,
    widthClass = 'min-w-[180px]',
}) => {
    const [open, setOpen] = useState(false);
    const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const label = useMemo(() => {
        if (!value || value.length === 0) return placeholder;
        if (value.length === 1) {
            const match = options.find((o) => o.value === value[0]);
            return match?.label || value[0];
        }
        return `${value.length} selected`;
    }, [value, options, placeholder]);

    useEffect(() => {
        if (!open) return;
        const handle = (e: MouseEvent) => {
            const t = e.target as Node;
            if (
                panelRef.current?.contains(t) ||
                triggerRef.current?.contains(t)
            )
                return;
            setOpen(false);
        };
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [open]);

    // Match panel width to trigger width
    useEffect(() => {
        const update = () => {
            if (triggerRef.current) {
                setPanelWidth(triggerRef.current.getBoundingClientRect().width);
            }
        };
        update();
        if (open) {
            window.addEventListener('resize', update);
            return () => window.removeEventListener('resize', update);
        }
    }, [open]);

    const toggle = (val: string) => {
        const set = new Set(value);
        if (set.has(val)) set.delete(val);
        else set.add(val);
        onChange(Array.from(set));
    };

    const selectAll = () => onChange(options.map((o) => o.value));
    const clearAll = () => onChange([]);

    return (
        <div className={cx('relative', className)}>
            <button
                ref={triggerRef}
                type='button'
                disabled={disabled}
                onClick={() => setOpen((o) => !o)}
                className={cx(
                    'inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    widthClass,
                )}
                aria-haspopup='listbox'
                aria-expanded={open}
            >
                <span
                    className={cx(
                        'truncate',
                        value.length === 0 && 'text-muted-foreground',
                    )}
                >
                    {label}
                </span>
                <svg
                    className='ml-2 h-4 w-4 opacity-60'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <polyline points='6 9 12 15 18 9' />
                </svg>
            </button>
            {open && (
                <div
                    ref={panelRef}
                    className={cx(
                        'absolute left-0 z-50 mt-2 rounded-md border border-border bg-surface p-2 text-sm shadow-lg',
                    )}
                    role='listbox'
                    style={{width: panelWidth}}
                >
                    <div className='mb-2 flex items-center px-2 pt-2 justify-between'>
                        <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            {panelLabel || placeholder}
                        </span>
                        <div className='flex items-center gap-3 text-xs'>
                            <button
                                className='text-blue-600 hover:underline'
                                onClick={selectAll}
                                type='button'
                            >
                                All
                            </button>
                            <button
                                className='text-blue-600 hover:underline'
                                onClick={clearAll}
                                type='button'
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                        {options.map((opt) => {
                            const checked = value.includes(opt.value);
                            const id = `ms-opt-${opt.value}`;
                            return (
                                <label
                                    key={opt.value}
                                    htmlFor={id}
                                    className='flex cursor-pointer items-center gap-2 rounded-none px-2 py-1 hover:bg-muted'
                                >
                                    <input
                                        id={id}
                                        type='checkbox'
                                        className='h-4 w-4'
                                        checked={checked}
                                        onChange={() => toggle(opt.value)}
                                    />
                                    <span className='flex-1'>
                                        {opt.label || opt.value}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
