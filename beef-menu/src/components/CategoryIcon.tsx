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
import { categories } from '../data/categories'

const iconMap: Record<string, LucideIcon> = {
  all: ConciergeBell,
  pizza: Pizza,
  pasta: Soup,
  burger: Hamburger,
  salad: Salad,
  drinks: CupSoda,
}

interface Props {
  categoryId: string
  className?: string
}

// آیکون دسته‌ی محصول؛ اگه دسته یا آیکونش پیدا نشد، چاقو و چنگال
function CategoryIcon({ categoryId, className }: Props) {
  const key = categories.find((c) => c.id === categoryId)?.icon
  const Icon = (key && iconMap[key]) || UtensilsCrossed

  return <Icon className={className} strokeWidth={1.5} aria-hidden />
}

export default CategoryIcon
