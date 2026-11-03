import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ConciergeBell,
  CupSoda,
  Hamburger,
  Pizza,
  Salad,
  Soup,
  UtensilsCrossed,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '../data/categories'
import type { Language } from '../i18n'

const iconMap: Record<string, LucideIcon> = {
  all: ConciergeBell,
  pizza: Pizza,
  pasta: Soup,
  burger: Hamburger,
  salad: Salad,
  drinks: CupSoda,
}

type Props = {
  categories: Category[]
  activeId: string
  onSelect: (id: string) => void
  lang: Language
  open: boolean
  onClose: () => void
}

function CategorySidebar({ categories, activeId, onSelect, lang, open, onClose }: Props) {
  const { t } = useTranslation()

  // بستن با کلید Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSelect = (id: string) => {
    onSelect(id)
    onClose()
  }

  return (
    <>
      {/* پس‌زمینه‌ی تیره */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-hidden={!open}
        className={`fixed inset-y-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col border-e border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-transform duration-300 ease-out ltr:left-0 rtl:right-0 ${
          open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <h2 className="font-serif text-xl text-white">{t('sidebar.title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('sidebar.close')}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white/80 hover:bg-white/15"
          >
            <X strokeWidth={1.5} className="size-5" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-6">
          {categories.map((c) => {
            const Icon = iconMap[c.icon] ?? UtensilsCrossed
            const isActive = c.id === activeId

            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(c.id)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-start transition duration-200 ${
                    isActive
                      ? 'border-accent/40 bg-accent/80 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]'
                      : 'border-white/[0.06] bg-white/[0.05] text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]">
                    <Icon strokeWidth={1.5} className="size-5" />
                  </span>
                  <span className="flex-1 font-medium">{c.name[lang]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
    </>
  )
}

export default CategorySidebar
