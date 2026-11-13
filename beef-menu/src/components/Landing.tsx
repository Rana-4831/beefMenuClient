import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LogIn, UtensilsCrossed } from 'lucide-react'

const BG_IMG = '/images/grill-bg.webp'
const LOGO_IMG = '/images/logo-intro.webp'
const TAGLINE = 'Steak & Meat Lover'
const FADE_MS = 700
const BUTTON_DELAY = 1000 // میلی‌ثانیه تا ظاهر شدن دکمه (لوگو ×۳ سریع‌تر ساخته شده)

interface Props {
    onEnter: () => void
}

export default function Landing({ onEnter }: Props) {
    const { t } = useTranslation()
    const [showButton, setShowButton] = useState(false)
    const [leaving, setLeaving] = useState(false)

    useEffect(() => {
        const html = document.documentElement
        const body = document.body
        const prev = {
            htmlOverflow: html.style.overflow,
            bodyOverflow: body.style.overflow,
            htmlBg: html.style.background,
            bodyBg: body.style.background,
        }
        html.style.overflow = 'hidden'
        body.style.overflow = 'hidden'
        html.style.background = '#000000'
        body.style.background = 'transparent'
        return () => {
            html.style.overflow = prev.htmlOverflow
            body.style.overflow = prev.bodyOverflow
            html.style.background = prev.htmlBg
            body.style.background = prev.bodyBg
        }
    }, [])

    useEffect(() => {
        const id = setTimeout(() => setShowButton(true), BUTTON_DELAY)
        return () => clearTimeout(id)
    }, [])

    const handleEnter = () => {
        setLeaving(true)
        setTimeout(onEnter, FADE_MS)
    }

    return (
        <div
            className={`visible fixed inset-x-0 -top-25 -bottom-24 z-[100] overflow-hidden transition-opacity ${leaving ? 'opacity-0' : 'opacity-100'}`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
        >
            <img
                src={BG_IMG}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />

            <div className="absolute inset-x-0 top-24 bottom-24 flex flex-col items-center justify-center px-6 pb-[16%]">
                <img
                    src={LOGO_IMG}
                    alt="Beef"
                    className="w-full max-w-[260px] mix-blend-screen"
                    style={{ transform: 'translate(3.6%, -9.4%)' }}
                />

                <div
                    className={`-mt-2 flex flex-col items-center gap-2 transition-all duration-500 ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                >
                    <UtensilsCrossed className="h-4 w-4 text-gold" strokeWidth={1.25} />
                    <span className="font-latin-serif text-[11px] uppercase tracking-[0.35em] text-cream/70">
                        {TAGLINE}
                    </span>
                </div>

<button
    type="button"
    onClick={handleEnter}
    className={`mt-14 flex items-center gap-3 rounded-full border border-white/20 bg-accent/50 px-8 py-3 font-latin-serif text-base text-cream transition-all duration-500 active:scale-[0.97] ${showButton ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}
    style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
>
    {t('landing.enter')}
    <LogIn className="h-4 w-4" strokeWidth={1.5} />
</button>

            </div>

            <a
                href="mailto:ranarajehdoust@gmail.com"
                className={`absolute inset-x-0 bottom-24 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-[11px] tracking-wide text-cream/50 transition-opacity duration-500 hover:text-cream/80 ${showButton ? 'opacity-100' : 'opacity-0'}`}
            >
                Designed &amp; developed by ranarajehdoust@gmail.com
            </a>
        </div>
    )
}
