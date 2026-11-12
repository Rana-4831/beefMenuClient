import type { Language } from './i18n'

export type Localized = Record<Language, string>

export interface Product {
  id: string
  categoryId: string
  name: Localized
  description: Localized
  price: number
  available: boolean
  image?: string
  bestSeller?: boolean
  isNew: boolean
}

export interface Category {
  id: string
  icon: string
  name: Localized
  description?: Localized
}
