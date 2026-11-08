import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type NewItem = {
    id: string;
    name: string;
    image?: string;
    isNew?: boolean;
};

const SEEN_KEY = 'seenNew';

function readSeen(): string[] {
    try {
        return JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function markSeen(ids: string[]) {
    const seen = new Set([...readSeen(), ...ids]);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

type Props = {
    items: NewItem[];
    onView: (id: string) => void;
};

export default function NewProductPopup({ items, onView }: Props) {
    const { t } = useTranslation();
    const [queue, setQueue] = useState<NewItem[]>([]);
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const checkedRef = useRef(false);

    // فقط یک بار در هر بار لود: محصول‌های جدیدی که دیده نشدن
    useEffect(() => {
        if (checkedRef.current || items.length === 0) return;
        checkedRef.current = true;
        const seen = readSeen();
        const fresh = items.filter((i) => i.isNew && !seen.includes(i.id));
        if (fresh.length > 0) {
            setQueue(fresh);
            setOpen(true);
        }
    }, [items]);

    const close = () => {
        markSeen(queue.map((i) => i.id));
        setOpen(false);
    };

    const view = (id: string) => {
        markSeen([id]);
        setOpen(false);
        onView(id);
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    if (!open || queue.length === 0) return null;
    const current = queue[index];

    return (
        <div
            className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-bg/55 p-6 backdrop-blur-md"
            onPointerDown={(e) => e.target === e.currentTarget && close()}
        >
            <div
                className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-cream/15 p-7 text-center"
                style={{
                    background:
                        'linear-gradient(160deg, rgba(239,232,218,0.14) 0%, rgba(239,232,218,0.04) 55%, rgba(239,232,218,0.07) 100%)',
                    boxShadow:
                        'inset 0 1px 0 rgba(239,232,218,0.25), inset 0 -12px 28px rgba(0,0,0,0.25), 0 24px 60px rgba(0,0,0,0.5)',
                }}
            >
                {/* خط طلایی بالا */}
                <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />

                <p className="mt-5 flex items-center justify-center gap-3 text-[0.65rem] tracking-[0.35em] text-gold">
                    <span className="h-px w-5 bg-gold/50" />
                    {t('newPopup.kicker')}
                    <span className="h-px w-5 bg-gold/50" />
                </p>

                {current.image && (
                    <img
                        src={current.image}
                        alt={current.name}
                        className="mx-auto mt-5 h-44 w-full object-contain"
                        style={{ filter: 'drop-shadow(0 14px 14px rgba(0,0,0,0.5))' }}
                    />
                )}

                <h2 className="mt-4 font-serif text-2xl text-cream">{current.name}</h2>
                <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-7 text-cream/65">
                    {t('newPopup.body')}
                </p>

                <button
                    type="button"
                    onClick={() => view(current.id)}
                    className="mt-7 w-full rounded-full border border-cream/20 bg-accent/60 py-2.5 text-sm tracking-wide text-cream backdrop-blur-md transition hover:bg-accent/70 active:scale-[0.98]"
                    style={{
                        boxShadow:
                            'inset 0 1px 0 rgba(239,232,218,0.18), 0 8px 20px rgba(0,0,0,0.25)',
                    }}
                >
                    {t('newPopup.view')}
                </button>


                <div className="mt-5 flex items-center justify-between text-xs text-cream/50">
                    {queue.length > 1 ? (
                        <button
                            type="button"
                            onClick={() => setIndex((i) => (i + 1) % queue.length)}
                            className="flex items-center gap-2"
                        >
                            {t('newPopup.next')}
                            <span className="flex gap-1">
                                {queue.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1 rounded-full transition-all ${i === index ? 'w-4 bg-gold' : 'w-1 bg-cream/30'
                                            }`}
                                    />
                                ))}
                            </span>
                        </button>
                    ) : (
                        <span />
                    )}
                    <button type="button" onClick={close} className="transition hover:text-cream">
                        {t('newPopup.later')}
                    </button>
                </div>
            </div>
        </div>
    );
}
