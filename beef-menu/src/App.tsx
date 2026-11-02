import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from './i18n'
import Header from './components/Header'
import CategorySidebar from './components/CategorySidebar'
import LanguageSwitcher from './components/LanguageSwitcher'
import ProductList from './components/ProductList'
import { categories } from './data/categories'
import { products } from './data/products'
import CategoryBar from './components/CategoryBar'

// دسته‌ی اول ("همه") همه‌ی محصولات رو نشون می‌ده
const ALL_ID = categories[0].id

function App() {
  const { i18n } = useTranslation()
  const lang = i18n.language as Language
  const [activeId, setActiveId] = useState(ALL_ID)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  const visibleProducts =
    activeId === ALL_ID
      ? products
      : products.filter((p) => p.categoryId === activeId)

  // تعداد آیتم‌های هر دسته؛ "همه" یعنی کل محصولات
  const counts: Record<string, number> = Object.fromEntries(
    categories.map((c) => [
      c.id,
      c.id === ALL_ID
        ? products.length
        : products.filter((p) => p.categoryId === c.id).length,
    ]),
  )

  return (
    <div>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex justify-center px-4 pt-2 pb-6">
        <LanguageSwitcher />
      </div>

      <CategoryBar
        categories={categories}
        activeId={activeId}
        onSelect={setActiveId}
        lang={lang}
      />


      <CategorySidebar
        categories={categories}
        activeId={activeId}
        onSelect={setActiveId}
        counts={counts}
        lang={lang}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <section className="px-5 pt-6 text-start">
        <h1 className="font-serif text-4xl text-white">{active.name[lang]}</h1>
        <div className="mt-3 h-px w-10 bg-accent" />
        <p className="mt-3 text-sm text-white/60">{active.description[lang]}</p>
      </section>

      <ProductList key={activeId} products={visibleProducts} lang={lang} />
    </div>
  )
}

export default App
