import type { Category, Product } from '../types'

const API = import.meta.env.VITE_API_URL as string
// آدرس سرور بدون /api/v1 برای ساخت مسیر کامل تصویرها
const ORIGIN = new URL(API).origin
export const categoryIcons: Record<string, string> = {}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

interface ApiCategory {
  id: number
  icon: string
  name: Category['name']
  description?: Category['description']
}

interface ApiProduct {
  id: number
  categoryId: number | null
  name: Product['name']
  description: Product['description']
  price: number
  available: boolean
  image: string | null
  bestSeller: boolean
  isNew: boolean
}

export async function getCategories(): Promise<Category[]> {
  const list = await get<ApiCategory[]>('/getAllCategories')
  return list.map((c) => {
    categoryIcons[String(c.id)] = c.icon
    return {
      id: String(c.id),
      icon: c.icon,
      name: c.name,
      description: c.description,
    }
  })
}

export async function getProducts(): Promise<Product[]> {
  const list = await get<ApiProduct[]>('/getProducts')
  return list.map((p) => ({
    id: String(p.id),
    categoryId: p.categoryId == null ? '' : String(p.categoryId),
    name: p.name,
    description: p.description,
    price: p.price,
    available: p.available,
    image: p.image
      ? p.image.startsWith('http')
        ? p.image
        : `${ORIGIN}${p.image}`
      : undefined,
    bestSeller: p.bestSeller,
    isNew: p.isNew,
  }))
}
