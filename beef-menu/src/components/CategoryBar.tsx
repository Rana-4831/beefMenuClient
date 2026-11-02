import {
  ConciergeBell,
  CupSoda,
  Hamburger,
  Pizza,
  Salad,
  Soup,
  UtensilsCrossed,
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
}

function CategoryBar({ categories, activeId, onSelect, lang }: Props) {
  return (
    <nav className="-my-8 overflow-x-auto px-4 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex min-w-full justify-between gap-2 sm:gap-3">
        {categories.map((c) => {
          const Icon = iconMap[c.icon] ?? UtensilsCrossed
          const isActive = c.id === activeId

          return (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-label={c.name[lang]}
                aria-pressed={isActive}
                className={`relative flex size-12 items-center justify-center overflow-hidden rounded-full border transition duration-300 sm:size-14 before:pointer-events-none before:absolute before:inset-x-2.5 before:top-1 before:h-1/2 before:rounded-full before:bg-linear-to-b before:from-white/25 before:to-transparent before:content-[''] ${
                  isActive
                    ? 'border-accent/40 bg-accent text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]'
                    : 'border-white/[0.06] bg-white/[0.07] text-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-6px_12px_rgba(0,0,0,0.35)] hover:bg-white/[0.16] hover:border-white/20'
                }`}
              >
                <Icon strokeWidth={1.5} className="size-5 sm:size-6" />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default CategoryBar
