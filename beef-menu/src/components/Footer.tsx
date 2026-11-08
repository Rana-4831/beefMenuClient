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

const baseItem =
    'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1 text-center text-[10px] leading-tight text-cream transition duration-200 active:scale-95 hover:bg-white/5 active:bg-accent/80 active:text-white'

const iconColor = 'text-cream/75 transition duration-200'

const divider =
    'my-1.5 w-px shrink-0 bg-gradient-to-b from-transparent via-cream/35 to-transparent'

function Footer({ onAboutClick }: Props) {
    const { t } = useTranslation()

    return (
     <footer className="fixed inset-x-0 bottom-1.5 z-40 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <nav className="mx-auto max-w-sm px-4 pt-1">
                <div className="flex items-stretch gap-1 rounded-full border border-cream/20 bg-white/[0.04] p-1 backdrop-blur-xl">
                    <a href={`tel:${PHONE}`} className={baseItem}>
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
                        className={baseItem}
                    >
                        <span className={iconColor}>
                            <InstagramIcon size={15} />
                        </span>
                        <span>{t('footer.follow')}</span>
                    </a>

                    <span aria-hidden="true" className={divider} />

                    <button type="button" onClick={onAboutClick} className={baseItem}>
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
