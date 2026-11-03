import { useState, type UIEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../i18n'
import type { Product } from '../data/products'
import ProductCard from './ProductCard'
import SectionDivider from './SectionDivider'

interface Props {
  products: Product[]
  lang: Language
  onSelect?: (product: Product) => void
}

function ProductList({ products, lang, onSelect }: Props) {

  const { t } = useTranslation()
  const [focusIndex, setFocusIndex] = useState(0)

  // نزدیک‌ترین کارت به مرکز اسکرولر رو پیدا می‌کنه
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

  return (
    <section aria-labelledby="products-heading" className="mt-6">
      <SectionDivider id="products-heading" title={t('section.all')} />

      {products.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-white/50">
          {t('section.empty')}
        </p>
      ) : (
        <div
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
