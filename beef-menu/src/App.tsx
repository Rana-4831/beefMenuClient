import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from './i18n'
import Header from './components/Header'
import CategorySidebar from './components/CategorySidebar'
import ProductList from './components/ProductList'
import { categories } from './data/categories'
import { products, type Product } from './data/products'
import CategoryBar from './components/CategoryBar'
import BestSellers from './components/BestSellers'
import ProductSheet from './components/ProductSheet'
import Footer from './components/Footer'
import AboutSheet from './components/AboutSheet'
import { aboutMock } from './data/about'

// دسته‌ی اول ("همه") همه‌ی محصولات رو نشون می‌ده
const ALL_ID = categories[0].id

function App() {
  const { i18n } = useTranslation()
  const lang = i18n.language as Language
  const [activeId, setActiveId] = useState(ALL_ID)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const closeAbout = useCallback(() => setAboutOpen(false), [])
  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  const visibleProducts =
    activeId === ALL_ID
      ? products
      : products.filter((p) => p.categoryId === activeId)


  return (
    <div className="pb-28">

      {/* فقط لوگو و زبان استیکی هستن */}
      {/* هدر استیکی: همبرگر و زبان */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
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
    </div>
  )
}

export default App
