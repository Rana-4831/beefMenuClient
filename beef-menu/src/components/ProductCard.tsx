import { UtensilsCrossed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { MouseEvent } from 'react'
import type { Language } from '../i18n'
import type { Localized, Product } from '../data/products'

const numberLocales: Record<Language, string> = {
  fa: 'fa-IR',
  en: 'en-US',
  tr: 'tr-TR',
}

interface Props {
  product: Product
  lang: Language
  focused: boolean
}

function ProductCard({ product, lang, focused }: Props) {
  const { t } = useTranslation()
  const pick = (value: Localized) => value[lang] ?? value.en
  const price = new Intl.NumberFormat(numberLocales[lang]).format(product.price)
  const name = pick(product.name)

  // کلیک روی کارت کناری، اون رو وسط می‌بره
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (!focused) {
      e.currentTarget.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  return (
    <article
      onClick={handleClick}
      data-focused={focused}
      data-available={product.available}
      className="glass-card w-52 shrink-0 snap-center p-3"
    >
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={name} loading="lazy" />
        ) : (
          <UtensilsCrossed className="size-10 text-white/25" aria-hidden />
        )}
      </div>

      <h3 className="product-title">{name}</h3>
      <p className="product-desc">{pick(product.description)}</p>

      <div className="product-footer">
        <span className="product-price">
          {price} {t('item.currency')}
        </span>
        <span className="product-status" data-available={product.available}>
          <span className="product-status-dot" />
          {t(product.available ? 'item.available' : 'item.unavailable')}
        </span>
      </div>
    </article>
  )
}

export default ProductCard
