import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'

const languages: { code: Language; short: string; label: string }[] = [
    { code: 'fa', short: 'FA', label: 'فارسی' },
    { code: 'en', short: 'EN', label: 'English' },
    { code: 'tr', short: 'TR', label: 'Türkçe' },
]

function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const current = (i18n.resolvedLanguage ?? i18n.language) as Language

    return (
        <div
            dir="rtl"
            style={{ direction: 'rtl' }}
            className="inline-flex flex-row items-center gap-0.5 rounded-full border border-white/[0.04] bg-white/[0.06] p-0.5 shadow-[inset_0_-3px_8px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)]"
        >
            {languages.map(({ code, short, label }) => {
                const isActive = code === current

                return (
                    <button
                        key={code}
                        type="button"
                        lang={code}
                        aria-label={label}
                        aria-pressed={isActive}
                        onClick={() => i18n.changeLanguage(code)}
                        className={`h-7 min-w-9 rounded-full px-2.5 text-[11px] font-semibold tracking-wide transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${isActive
                                ? 'bg-accent text-white shadow-[0_0_12px_rgba(190,40,50,0.45)]'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {short}
                    </button>
                )
            })}
        </div>
    )
}

export default LanguageSwitcher
