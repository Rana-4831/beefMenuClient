import { useEffect, useRef, useState, type UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'
import type { Product } from '../data/products'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  lang: Language
  loading?: boolean
  onSelect?: (product: Product) => void
}

function ProductList({ products, lang, loading, onSelect }: Props) {

  const { t } = useTranslation()
  const [focusIndex, setFocusIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef(0)
  // وقتی زبان عوض میشه، اسکرول‌های ناشی از تغییر جهت نباید فوکوس رو عوض کنن
  const lockRef = useRef(false)

  focusRef.current = focusIndex

  // بعد از عوض شدن زبان، کارت فعلی رو دوباره وسط بیار
  useEffect(() => {
    const scroller = scrollerRef.current
    const card = scroller?.children[focusRef.current] as HTMLElement | undefined
    if (!scroller || !card) return

    lockRef.current = true
    card.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'instant' as ScrollBehavior,
    })
    // بعد از تموم شدن اسکرول‌های برنامه‌ای، قفل رو باز کن
    const id = window.setTimeout(() => {
      lockRef.current = false
    }, 150)
    return () => window.clearTimeout(id)
  }, [lang])

  // نزدیک‌ترین کارت به مرکز اسکرولر رو پیدا می‌کنه
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (lockRef.current) return

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

  return (
    <section aria-labelledby="products-heading" className="mt-6">
      {/* جداکننده‌ی تصویری حذف شد؛ عنوان فقط برای دسترسی‌پذیری می‌مونه */}
      <h2 id="products-heading" className="sr-only">
        {t('section.all')}
      </h2>

      {loading ? (
        <div className="products-scroll mt-4 flex gap-3 overflow-x-auto pt-6 pb-10" aria-busy="true">
          {[0, 1, 2].map(i => (
            <div key={i} className="glass-card w-52 shrink-0 snap-center p-3" data-focused={i === 1} aria-hidden>
              <div className="skeleton-box shimmer-bg" />
              <div className="skeleton-line shimmer-bg mt-3 h-4 w-3/4" />
              <div className="skeleton-line shimmer-bg mt-2 h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-cream/50">
          {t('section.empty')}
        </p>
      ) : (
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="products-scroll mt-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pt-6 pb-10"
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              focused={i === focusIndex}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductList
