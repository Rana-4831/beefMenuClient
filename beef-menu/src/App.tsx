import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from './i18n'
import Header from './components/Header'
import CategorySidebar from './components/CategorySidebar'
import ProductList from './components/ProductList'
import type { Category, Product } from './types'
import { getCategories, getProducts } from './api/menu'
import CategoryBar from './components/CategoryBar'
import BestSellers from './components/BestSellers'
import ProductSheet from './components/ProductSheet'
import Footer from './components/Footer'
import AboutSheet from './components/AboutSheet'
import { aboutMock } from './data/about'
import NewProductPopup from './components/NewProductPopup'
import Landing from './components/Landing'

// دسته‌ی «همه» در دیتابیس نیست و در فرانت ساخته می‌شه
const ALL_ID = 'all'
const ALL_CATEGORY: Category = {
  id: ALL_ID,
  icon: 'all',
  name: { fa: 'همه‌ی محصولات', en: 'All Items', tr: 'Tüm Ürünler' },
  description: {
    fa: 'مواد تازه. طعم عالی.',
    en: 'Fresh ingredients. Great taste.',
    tr: 'Taze malzemeler. Harika lezzet.',
  },
}

function App() {
  const { i18n } = useTranslation()
  const lang = i18n.language as Language
  const [apiCategories, setApiCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [failed, setFailed] = useState(false)
  const [activeId, setActiveId] = useState(ALL_ID)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const closeAbout = useCallback(() => setAboutOpen(false), [])

  // دسته‌ها باید قبل از محصولات ست بشن تا آیکون‌ها پیدا بشن
  useEffect(() => {
    let cancelled = false
    Promise.all([getCategories(), getProducts()])
      .then(([c, p]) => {
        if (cancelled) return
        setApiCategories(c)
        setProducts(p)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => [ALL_CATEGORY, ...apiCategories], [apiCategories])
  const active = categories.find((c) => c.id === activeId) ?? ALL_CATEGORY

  const visibleProducts =
    activeId === ALL_ID
      ? products
      : products.filter((p) => p.categoryId === activeId)

  // همه‌ی محصولات (نه فقط دسته‌ی فعلی) برای پاپ‌آپ محصول جدید
  const newItems = useMemo(
    () =>
      products.map((p) => ({
        id: p.id,
        name: p.name[lang],
        image: p.image,
        isNew: p.isNew,
      })),
    [products, lang],
  )

  return (
    <div className={`pb-28 ${entered ? '' : 'invisible'}`}>

      {!entered && <Landing onEnter={() => setEntered(true)} />}

      {/* هدر استیکی: قرص دسته‌بندی و زبان وسط بالا */}
      <div className="sticky top-1.5 z-40">
        <Header onMenuClick={() => setSidebarOpen(true)} />
      </div>

      {/* نوار دسته‌ها با صفحه اسکرول میشه */}
      <div className="pt-4">
        <CategoryBar
          categories={categories}
          activeId={activeId}
          onSelect={setActiveId}
          lang={lang}
        />
      </div>

      <CategorySidebar
        key={lang}
        categories={categories}
        activeId={activeId}
        onSelect={setActiveId}
        lang={lang}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ProductSheet
        product={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />

      <section className="px-5 pt-6 text-start">
        <h1 className="font-serif text-3xl text-white">{active.name[lang]}</h1>
        {active.description?.[lang] && (
          <>
            <div className="mt-3 h-px w-10 bg-accent" />
            <p className="mt-3 text-sm text-white/60">{active.description[lang]}</p>
          </>
        )}
      </section>

      {failed && (
        <p className="px-5 pt-6 text-sm text-red-400">
          Connection error
        </p>
      )}

      <ProductList
        key={`list-${activeId}`}
        products={visibleProducts}
        lang={lang}
        onSelect={setSelected}
      />
      <BestSellers
        key={`best-${activeId}`}
        products={visibleProducts}
        lang={lang}
        categoryName={active.name[lang]}
        isAll={activeId === ALL_ID}
        onSelect={setSelected}
      />
      <Footer onAboutClick={() => setAboutOpen(true)} />
      <AboutSheet open={aboutOpen} onClose={closeAbout} about={aboutMock.about} />
      {entered && (
        <NewProductPopup
          items={newItems}
          onView={(id) => {
            const product = products.find((p) => p.id === id)
            if (product) setSelected(product)
          }}
        />
      )}
    </div>
  )
}

export default App
