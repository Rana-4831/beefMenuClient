import { useTranslation } from 'react-i18next'
import { Phone, Info } from 'lucide-react'

const PHONE = '+984433666655'
const INSTAGRAM = 'Beef_urmia'

interface Props {
    onAboutClick?: () => void
}

function InstagramIcon({ size = 15 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}

// انعکاس ثابت روی نیمه‌ی بالایی دکمه (کم‌رنگ‌تر)
const reflection =
    'pointer-events-none absolute inset-x-2 top-0 h-1/2 rounded-full bg-gradient-to-b from-white/6 to-transparent'

// نور از گوشه‌ی بالا-راست، فقط موقع tap (محوتر)
const spotlight =
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:content-[''] before:bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.12),transparent_55%)] before:opacity-0 before:transition-opacity before:duration-200 active:before:opacity-100"


const baseItem =
    'group relative flex flex-1 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-full px-2 py-1 text-center text-[10px] leading-tight text-[#F3E7D0] transition duration-200 active:scale-95 hover:bg-white/5'

// دکمه‌ی طلایی شیشه‌ای؛ موقع tap قرمز شیشه‌ای و نور از گوشه
const glassItem =
    `${baseItem} ${spotlight} active:bg-[#850013]/80 active:text-white`

const iconColor = 'text-[#D4AF7A] transition duration-200 group-active:text-white'

const divider =
    'my-1.5 w-px shrink-0 bg-gradient-to-b from-transparent via-[#D4AF7A]/70 to-transparent'

function Footer({ onAboutClick }: Props) {
    const { t } = useTranslation()

    return (
        <footer className="fixed inset-x-0 bottom-0 z-40 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
            <nav className="mx-auto max-w-sm px-4 pt-1">
                <div className="flex items-stretch gap-1 rounded-full border border-[#D4AF7A]/60 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                    <a href={`tel:${PHONE}`} className={glassItem}>
                        <span aria-hidden="true" className={reflection} />
                        <span className={iconColor}>
                            <Phone size={15} />
                        </span>
                        <span>{t('footer.reserve')}</span>
                    </a>

                    <span aria-hidden="true" className={divider} />

                    <a
                        href={`https://instagram.com/${INSTAGRAM}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={glassItem}
                    >
                        <span aria-hidden="true" className={reflection} />
                        <span className={iconColor}>
                            <InstagramIcon size={15} />
                        </span>
                        <span>{t('footer.follow')}</span>
                    </a>

                    <span aria-hidden="true" className={divider} />

                    <button type="button" onClick={onAboutClick} className={glassItem}>
                        <span aria-hidden="true" className={reflection} />
                        <span className={iconColor}>
                            <Info size={15} />
                        </span>
                        <span>{t('footer.about')}</span>
                    </button>
                </div>
            </nav>
        </footer>
    )
}

export default Footer
