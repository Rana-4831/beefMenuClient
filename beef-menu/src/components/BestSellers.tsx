import { useState, type UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'
import type { Product } from '../data/products'
import ProductCard from './ProductCard'

interface Props {
    products: Product[]
    lang: Language
    categoryName: string
    isAll: boolean
    onSelect?: (product: Product) => void
}

function BestSellers({ products, lang, categoryName, isAll, onSelect }: Props) {


    const { t } = useTranslation()
    const [focusIndex, setFocusIndex] = useState(0)

    // فقط پرفروش‌ها
    const items = products.filter((p) => p.bestSeller)

    // نزدیک‌ترین کارت به مرکز اسکرولر رو فوکوس می‌کنه
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        const scroller = e.currentTarget
        const rect = scroller.getBoundingClientRect()
        const center = rect.left + rect.width / 2

        let best = 0
        let bestDist = Infinity
        Array.from(scroller.children).forEach((child, i) => {
            const r = child.getBoundingClientRect()
            const dist = Math.abs(r.left + r.width / 2 - center)
            if (dist < bestDist) {
                bestDist = dist
                best = i
            }
        })
        setFocusIndex(best)
    }

    // اگه دسته‌ای پرفروش نداشته باشه، کل بخش مخفی میشه
    if (items.length === 0) return null

    return (
        <section aria-labelledby="best-heading" className="mt-6">
            <div className="flex items-center gap-3 px-5">
                <span className="h-px flex-1 bg-cream/15" />
                <h2
                    id="best-heading"
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-cream/8 px-5 py-2 text-sm font-medium text-cream shadow-[inset_0_1px_0_rgba(239,232,218,0.12),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md"
                >
                    {isAll
                        ? t('section.bestSellers')
                        : t('section.bestSellersIn', {
                            category: categoryName,
                            interpolation: { escapeValue: false },
                        })}
                </h2>

                <span className="h-px flex-1 bg-cream/15" />
            </div>

            <div
                onScroll={handleScroll}
                className="bestsellers-scroll mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pt-6 pb-10"
            >
                {items.map((product, i) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        focused={i === focusIndex}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </section>
    )
}

export default BestSellers
