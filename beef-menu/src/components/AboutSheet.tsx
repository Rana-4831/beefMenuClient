import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import type { AboutText } from '../data/about'

const CLOSE_MS = 500

interface Props {
    open: boolean
    onClose: () => void
    about: AboutText | null
}

function AboutSheet({ open, onClose, about }: Props) {
    const { t, i18n } = useTranslation()
    const [mounted, setMounted] = useState(false)
    const [visible, setVisible] = useState(false)

    // ورود و خروج با انیمیشن؛ بعد از بسته شدن از DOM برداشته میشه
    useEffect(() => {
        if (open) {
            setMounted(true)
            // دو rAF پشت هم تا مرورگر حالت اولیه رو رندر کنه و انیمیشن اجرا بشه
            let id2 = 0
            const id1 = requestAnimationFrame(() => {
                id2 = requestAnimationFrame(() => setVisible(true))
            })
            return () => {
                cancelAnimationFrame(id1)
                cancelAnimationFrame(id2)
            }
        }
        setVisible(false)
        const id = setTimeout(() => setMounted(false), CLOSE_MS)
        return () => clearTimeout(id)
    }, [open])

    // Escape و قفل اسکرول بدنه
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [open, onClose])

    if (!mounted) return null

    // زبان فعلی؛ اگه متن همون زبان نبود، انگلیسی و بعد بقیه
    const lang = (i18n.language ?? 'en').slice(0, 2) as keyof AboutText
    const body = about?.[lang] ?? about?.en ?? about?.fa ?? about?.tr ?? ''

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
                aria-hidden="true"
                onClick={onClose}
                className={`absolute inset-0 bg-black/60 transition-opacity duration-700 motion-reduce:transition-none ${
                    visible ? 'opacity-100' : 'opacity-0'
                }`}
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-title"
                className={`relative w-full max-w-md max-h-[90dvh] overflow-x-hidden overflow-y-auto rounded-t-3xl border-t border-[#D4AF7A]/40 bg-[#1A1914]/90 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[#F3E7D0] backdrop-blur-xl transition-transform duration-700 ease-out motion-reduce:transition-none ${
                    visible ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 id="about-title" className="text-xl font-bold">
                        {t('about.title')}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="close"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#D4AF7A] transition duration-200 active:scale-95"
                    >
                        <X size={18} />
                    </button>
                </div>

                {body ? (
                    <p className="whitespace-pre-line break-words text-sm leading-7 text-white/85">{body}</p>
                ) : (
                    <p className="text-sm text-white/50">{t('about.empty')}</p>
                )}
            </section>
        </div>
    )
}

export default AboutSheet
