import { useEffect, useState, useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import CategoryIcon from './CategoryIcon'
import type { Language } from '../i18n'
import type { Localized, Product } from '../data/products'


const numberLocales: Record<Language, string> = {
    fa: 'fa-IR',
    en: 'en-US',
    tr: 'tr-TR',
}

const CLOSE_MS = 500

interface Props {
    product: Product | null
    lang: Language
    onClose: () => void
}

function ProductSheet({ product, lang, onClose }: Props) {
    const { t } = useTranslation()
    const [closing, setClosing] = useState(false)
    const [dragY, setDragY] = useState(0)
    const dragStartY = useRef<number | null>(null)


    // شروع بستن: فقط انیمیشن رو اجرا می‌کنه، بعد از تموم شدنش onClose صدا زده میشه
    const requestClose = useCallback(() => {
        setClosing(true)
    }, [])

    // کشیدن دستگیره: برگه همراه انگشت پایین میاد
    const onHandleDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        dragStartY.current = e.clientY
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const onHandleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartY.current === null) return
        setDragY(Math.max(0, e.clientY - dragStartY.current))
    }

    // اگه به اندازه‌ی کافی کشیده شد می‌بنده، وگرنه برمی‌گرده
    const onHandleUp = () => {
        if (dragStartY.current === null) return
        dragStartY.current = null
        if (dragY > 100) {
            requestClose()
        } else {
            setDragY(0)
        }
    }


    // بعد از پایان انیمیشن خروج، شیت واقعاً بسته میشه
    useEffect(() => {
        if (!closing) return

        const timer = setTimeout(() => {
            onClose()
            setClosing(false)
            setDragY(0)

        }, CLOSE_MS)

        return () => clearTimeout(timer)
    }, [closing, onClose])

    // بستن با Escape و قفل اسکرول صفحه وقتی باز است
    useEffect(() => {
        if (!product) return

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') requestClose()
        }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [product, requestClose])

    if (!product) return null

    const pick = (value: Localized) => value[lang] ?? value.en
    const price = new Intl.NumberFormat(numberLocales[lang]).format(product.price)

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* پس‌زمینه‌ی تیره: کلیک روش، شیت رو می‌بنده */}
            <div
                onClick={requestClose}
                className={`absolute inset-0 bg-black/20 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}

            />

            {/* خود شیت */}
            <div
                role="dialog"
                aria-modal="true"
                style={{ translate: `0 ${dragY}px` }}
                className={`relative flex h-[calc(100dvh-49px)] w-full max-w-md flex-col overflow-y-auto
rounded-t-3xl border-t border-white/15 bg-[#1A1914]/35 p-5 pb-[max(1rem,env(safe-area-inset-bottom))]
 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_-12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl ${closing ? 'animate-sheet-down' : 'animate-sheet-up'}`}
            >
                <button
                    type="button"
                    onClick={requestClose}
                    aria-label="close"
                    className="absolute end-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20"
                >
                    <X size={18} />
                </button>
                <div
                    onPointerDown={onHandleDown}
                    onPointerMove={onHandleMove}
                    onPointerUp={onHandleUp}
                    onPointerCancel={onHandleUp}
                    className="mb-4 flex h-6 w-full shrink-0 cursor-grab touch-none items-start justify-center active:cursor-grabbing"
                >
                    <span className="h-1 w-12 rounded-full bg-white/25" />
                </div>
                <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={pick(product.name)}
                            className="h-full w-full object-contain drop-shadow-[0_14px_12px_rgba(0,0,0,0.55)]"
                        />
                    ) : (
                        <CategoryIcon categoryId={product.categoryId} className="size-16 text-white/20" />
                    )}
                </div>

                <h3 className="mt-4 text-3xl font-semibold">{pick(product.name)}</h3>

                <p className="mt-3 text-lg leading-relaxed text-white/65">
                    {pick(product.description)}
                </p>

                <div className="product-footer mt-4">
                    <span className="product-price text-xl! font-semibold!">
                        {price} {t('item.currency')}
                    </span>
                    <span
                        className="product-status gap-2! px-4! py-2! text-base!"
                        data-available={product.available}
                    >
                        <span className="product-status-dot size-3!" />
                        {t(product.available ? 'item.available' : 'item.unavailable')}
                    </span>
                </div>

            </div>
        </div>
    )
}

export default ProductSheet
