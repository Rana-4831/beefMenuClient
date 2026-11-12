import { clearAuth, getAuth, type Auth } from './auth'

const BASE = import.meta.env.VITE_API_URL as string

export class ApiError extends Error {
  status: number
  data: any
  constructor(status: number, data: any) {
    super(data?.message || `HTTP ${status}`)
    this.status = status
    this.data = data
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const auth = getAuth()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  if (auth) headers.Authorization = `Bearer ${auth.token}`

  const res = await fetch(BASE + path, { ...options, headers: { ...headers, ...(options.headers as any) } })
  const data = await res.json().catch(() => null)

  if (res.status === 401 && path !== '/login') {
    clearAuth()
    location.href = '/admin/login'
  }
  if (!res.ok) throw new ApiError(res.status, data)
  return data as T
}

export const login = (name: string, password: string) =>
  api<Auth>('/login', { method: 'POST', body: JSON.stringify({ name, password }) })


export type Tri = { fa: string | null; en: string | null; tr: string | null }
export type Category = {
  id: number
  slug: string | null
  icon: string | null
  name: Tri
  description?: Tri
}
export type CategoryInput = {
  slug: string
  icon: string
  name_fa: string; name_en: string; name_tr: string
  description_fa: string; description_en: string; description_tr: string
}

export const getCategories = () => api<Category[]>('/getAllCategories')
export const getIcons = () => api<string[]>('/getCategoryIcons')
export const storeCategory = (d: CategoryInput) =>
  api<Category>('/store-category', { method: 'POST', body: JSON.stringify(d) })
export const updateCategory = (id: number, d: Partial<CategoryInput>) =>
  api<Category>(`/update-category/${id}`, { method: 'POST', body: JSON.stringify(d) })


export type Product = {
  id: number
  categoryId: number
  name: Tri
  description: Tri
  price: number
  available: boolean
  image: string | null
  bestSeller: boolean
  isNew: boolean
}
export type ProductInput = {
  name_fa: string; name_en: string; name_tr: string
  description_fa: string; description_en: string; description_tr: string
  price: number
  category_id: number
  file_id?: number
  available: boolean
  best_seller: boolean
  is_new: boolean
}

export const getProducts = () => api<Product[]>('/getProducts')
export const storeProduct = (d: ProductInput) =>
  api<Product>('/store-product', { method: 'POST', body: JSON.stringify(d) })
export const updateProduct = (id: number, d: Partial<ProductInput>) =>
  api<Product>(`/update-product/${id}`, { method: 'POST', body: JSON.stringify(d) })
export async function uploadFile(file: File): Promise<number> {
  const fd = new FormData()
  fd.append('file', file)
  const r = await api<{ file: { id: number } }>('/fileStore', { method: 'POST', body: fd })
  return r.file.id
}
export const imageUrl = (p: string | null) =>
  !p ? '' : /^https?:/.test(p) ? p : `${new URL(import.meta.env.VITE_API_URL).origin}/${p.replace(/^\//, '')}`


export const reorderCategories = (ids: number[]) =>
  api<{ ok: boolean }>('/reorder-categories', { method: 'POST', body: JSON.stringify({ ids }) })

export const reorderProducts = (ids: number[]) =>
  api<{ ok: boolean }>('/reorder-products', { method: 'POST', body: JSON.stringify({ ids }) })

// ids را با جابه‌جایی آیتم index در جهت dir برمی‌گرداند
export function moveIds(items: { id: number }[], index: number, dir: -1 | 1): number[] {
  const ids = items.map(i => i.id)
  const j = index + dir
  if (index < 0 || j < 0 || j >= ids.length) return ids
  ;[ids[index], ids[j]] = [ids[j], ids[index]]
  return ids
}


export const setAvailability = (id: number, available: boolean) =>
  api<Product>(`/set-availability/${id}`, { method: 'POST', body: JSON.stringify({ available }) })

export const setPrice = (id: number, price: number) =>
  updateProduct(id, { price })
