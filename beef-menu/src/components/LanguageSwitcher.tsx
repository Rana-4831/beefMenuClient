import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'

const languages: { code: Language; label: string }[] = [
    { code: 'fa', label: 'فارسی' },
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
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

            {languages.map(({ code, label }) => {
                const isActive = code === current

                return (
                    <button
                        key={code}
                        type="button"
                        lang={code}
                        aria-pressed={isActive}
                        onClick={() => i18n.changeLanguage(code)}
                        className={`h-9 rounded-full px-3 text-xs font-medium transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${isActive
                                ? 'bg-accent text-white shadow-[0_0_12px_rgba(190,40,50,0.45)]'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {label}
                    </button>
                )
            })}
        </div>
    )
}

export default LanguageSwitcher
