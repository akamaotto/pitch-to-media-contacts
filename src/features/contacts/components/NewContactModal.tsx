import React, {useState} from 'react';
import {X, PlusCircle, Link2} from 'lucide-react';
import {NewContactModalProps} from '../../../types/ui';
import {Button, Input} from '../../../components/ui';

/**
 * NewContactModal component for adding a new media contact
 */
const NewContactModal: React.FC<NewContactModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState('');
    const [outlet, setOutlet] = useState('');
    const [email, setEmail] = useState('');
    const [beats, setBeats] = useState('');
    const [bio, setBio] = useState('');
    const [authorLinks, setAuthorLinks] = useState<string[]>(['']);

    const handleSubmit = () => {
        if (name && outlet && email) {
            const links = authorLinks
                .map((l) => l.trim())
                .filter(Boolean)
                .slice(0, 5);
            onSubmit({
                name,
                outlet,
                email,
                beats,
                bio: bio.trim() || undefined,
                authorLinks: links,
            });
            setName('');
            setOutlet('');
            setEmail('');
            setBeats('');
            setBio('');
            setAuthorLinks(['']);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'>
            <div className='relative w-full sm:w-11/12 md:w-1/2 lg:w-1/3 rounded-xl border border-border bg-surface p-6 shadow-md'>
                <button
                    onClick={onClose}
                    className='absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition hover:bg-muted'
                >
                    <X className='h-4 w-4' />
                </button>
                <h2 className='mb-1 text-xl font-semibold text-foreground'>
                    Add New Media Contact
                </h2>
                <p className='mb-4 text-xs text-muted-foreground'>
                    Add a key contact that is not yet in your media list.
                </p>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='space-y-3'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            Full Name
                        </label>
                        <Input
                            type='text'
                            placeholder='Full Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='space-y-3'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            Outlet/Publication
                        </label>
                        <Input
                            type='text'
                            placeholder='TechCrunch'
                            value={outlet}
                            onChange={(e) => setOutlet(e.target.value)}
                        />
                    </div>
                    <div className='space-y-3'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            Email Address
                        </label>
                        <Input
                            type='email'
                            placeholder='name@domain.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='space-y-3'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            Beats
                        </label>
                        <Input
                            type='text'
                            placeholder='AI, SaaS, Funding'
                            value={beats}
                            onChange={(e) => setBeats(e.target.value)}
                        />
                    </div>
                    <div className='md:col-span-2 space-y-2'>
                        <label className='block text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                            Short Bio
                        </label>
                        <textarea
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                            placeholder='One to two sentences that describe their focus, outlets, or style. Used to personalize pitches.'
                        />
                    </div>
                    <div className='md:col-span-2'>
                        <div className='mb-2 flex items-center justify-between'>
                            <span className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                                Author Links (up to 5)
                            </span>
                            <Button
                                size='sm'
                                variant='outline'
                                className='gap-2'
                                onClick={() =>
                                    setAuthorLinks((prev) =>
                                        prev.length < 5 ? [...prev, ''] : prev,
                                    )
                                }
                                disabled={authorLinks.length >= 5}
                            >
                                <Link2 className='h-4 w-4' /> Add Link
                            </Button>
                        </div>
                        <div className='space-y-2'>
                            {authorLinks.map((link, idx) => (
                                <div
                                    key={idx}
                                    className='flex items-center gap-2'
                                >
                                    <Input
                                        type='url'
                                        placeholder='https://example.com/article'
                                        value={link}
                                        onChange={(e) =>
                                            setAuthorLinks((prev) =>
                                                prev.map((v, i) =>
                                                    i === idx
                                                        ? e.target.value
                                                        : v,
                                                ),
                                            )
                                        }
                                    />
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                            setAuthorLinks((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== idx,
                                                ),
                                            )
                                        }
                                        disabled={authorLinks.length <= 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='mt-6 flex justify-end gap-3'>
                    <Button
                        onClick={handleSubmit}
                        disabled={!name || !outlet || !email}
                        className='gap-2'
                    >
                        <PlusCircle className='h-4 w-4' /> Add Contact
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NewContactModal;
