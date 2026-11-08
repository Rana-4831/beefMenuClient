import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'
import { Globe } from 'lucide-react'


const languages: { code: Language; short: string; label: string }[] = [
    { code: 'fa', short: 'FA', label: 'فارسی' },
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'tr', short: 'TR', label: 'Türkçe' },
]

function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const current = (i18n.resolvedLanguage ?? i18n.language) as Language
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    // بستن با کلیک بیرون و Escape
    useEffect(() => {
        if (!open) return

        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label="language"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={`flex size-9 items-center justify-center rounded-full transition-colors duration-500 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cream/60 ${open ? 'text-gold' : 'text-cream hover:text-gold'
                    }`}
            >
                <Globe strokeWidth={1.25} className="size-[18px]" />
            </button>

            <ul
                role="listbox"
                dir="ltr"
                aria-hidden={!open}
                className={`absolute left-1/2 top-full z-50 mt-3 w-32 -translate-x-1/2 origin-top divide-y divide-cream/10 rounded-xl border border-cream/15 bg-surface/92 py-0.5 backdrop-blur-sm transition-[opacity,visibility] duration-300 ${open
                    ? 'visible opacity-100'
                    : 'invisible opacity-0'
                    }`}
            >
                {languages.map(({ code, short, label }) => {
                    const isActive = code === current

                    return (
                        <li key={code} role="option" aria-selected={isActive}>
                            <button
                                type="button"
                                lang={code}
                                tabIndex={open ? 0 : -1}
                                onClick={() => {
                                    i18n.changeLanguage(code)
                                    setOpen(false)
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-start transition-colors duration-300 hover:bg-cream/5"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`size-1 rounded-full ${isActive ? 'bg-gold' : 'bg-transparent'
                                        }`}
                                />
                                <span
                                    className={`flex-1 text-xs ${isActive ? 'text-cream' : 'text-cream/60'
                                        }`}
                                >
                                    {label}
                                </span>
                                <span className="font-latin-serif text-[10px] tracking-[0.15em] text-cream/35">
                                    {short}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default LanguageSwitcher
