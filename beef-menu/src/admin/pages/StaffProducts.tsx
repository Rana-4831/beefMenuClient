import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, setAvailability, type Category, type Product } from '../api'
import { clearAuth } from '../auth'

export default function StaffProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [busy, setBusy] = useState<number | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([c, p]) => { setCats(c); setProducts(p) })
      .catch(() => setErr('خطا در دریافت اطلاعات'))
  }, [])

  async function toggle(p: Product) {
    setBusy(p.id); setErr('')
    try {
      const u = await setAvailability(p.id, !p.available)
      setProducts(l => l.map(x => (x.id === p.id ? { ...x, available: u.available } : x)))
    } catch { setErr('خطا در تغییر وضعیت') }
    finally { setBusy(null) }
  }

  const groups = [
    ...cats.map(c => ({ id: c.id, title: c.name.fa, items: products.filter(p => p.categoryId === c.id) })),
    { id: 0, title: 'بدون دسته', items: products.filter(p => !cats.some(c => c.id === p.categoryId)) },
  ].filter(g => g.items.length > 0)

  return (
    <div dir="rtl" className="min-h-dvh bg-neutral-950 text-white font-[Vazirmatn]">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold">موجودی محصولات</h1>
            <p className="text-xs text-neutral-400">فقط وضعیت موجود / ناموجود را تغییر دهید</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-neutral-400 hover:text-amber-400">بازگشت</Link>
            <button onClick={() => { clearAuth(); location.href = '/admin/login' }}
              className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-red-500 hover:text-red-400">
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-xl space-y-6 p-4">
        {err && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{err}</p>}

        {groups.map(g => (
          <section key={g.id}>
            <h2 className="mb-2 text-sm font-bold text-amber-500">{g.title}</h2>
            <ul className="space-y-2">
              {g.items.map(p => (
                <li key={p.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3">
                  <span className={`text-sm ${p.available ? '' : 'text-neutral-500 line-through'}`}>
                    {p.name.fa}
                  </span>
                  <button
                    disabled={busy === p.id}
                    onClick={() => toggle(p)}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      p.available ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    {busy === p.id ? '...' : p.available ? 'موجود' : 'ناموجود'}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {!err && groups.length === 0 && (
          <p className="text-sm text-neutral-500">محصولی یافت نشد.</p>
        )}
      </main>
    </div>
  )
}
