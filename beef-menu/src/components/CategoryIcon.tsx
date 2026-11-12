import {
  Beef,
  Bean,
  Cake,
  Citrus,
  CookingPot,
  ConciergeBell,
  Coffee,
  CupSoda,
  Drumstick,
  EggFried,
  Flame,
  GlassWater,
  Hamburger,
  IceCreamCone,
  Leaf,
  Martini,
  Pizza,
  Salad,
  Snowflake,
  Soup,
  Thermometer,
  UtensilsCrossed,
  Wheat,
  Wind,
  type LucideIcon,
} from 'lucide-react'
import { categoryIcons } from '../api/menu'


const iconMap: Record<string, LucideIcon> = {
  all: ConciergeBell,
  soup: Soup,
  salad: Salad,
  'hot-appetizer': Flame,
  'cold-appetizer': Snowflake,
  breakfast: EggFried,
  grill: Beef,
  kebab: CookingPot,
  'burger-sandwich': Hamburger,
  pizza: Pizza,
  'fried-chicken': Drumstick,
  pasta: Wheat,
  drinks: CupSoda,
  tea: Leaf,
  dessert: Cake,
  coffee: Coffee,
  'iced-coffee': GlassWater,
  'brewed-coffee': Bean,
  'hot-drink': Thermometer,
  milkshake: IceCreamCone,
  smoothie: Citrus,
  mocktail: Martini,
  hookah: Wind,
}

interface Props {
  categoryId: string
  className?: string
}

// آیکون دسته‌ی محصول؛ اگه دسته یا آیکونش پیدا نشد، چاقو و چنگال
function CategoryIcon({ categoryId, className }: Props) {
  const key = categoryIcons[categoryId]
  const Icon = (key && iconMap[key]) || UtensilsCrossed

  return <Icon className={className} strokeWidth={1.5} aria-hidden />
}

export default CategoryIcon
