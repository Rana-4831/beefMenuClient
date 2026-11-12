import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, updateProduct, type Category, type Product } from '../api'

type State = '' | 'saving' | 'ok' | 'err'

function PriceInput({ p, onSaved }: { p: Product; onSaved: (u: Product) => void }) {
  const [v, setV] = useState(String(p.price))
  const [state, setState] = useState<State>('')

  // اگر از جای دیگر آپدیت شد
  useEffect(() => { setV(String(p.price)) }, [p.price])

  async function save() {
    const n = Number(v.replace(/[^\d]/g, ''))
    if (v.trim() === '' || Number.isNaN(n)) { setV(String(p.price)); return }
    if (n === p.price) { setV(String(p.price)); return }

    setState('saving')
    try {
      onSaved(await updateProduct(p.id, { price: n }))
      setState('ok')
    } catch {
      setV(String(p.price))
      setState('err')
    }
    setTimeout(() => setState(''), 1400)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        inputMode="numeric"
        value={v}
        onChange={e => setV(e.target.value.replace(/[^\d]/g, ''))}
        onBlur={save}
        onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        className={`w-28 rounded-lg border bg-neutral-800 px-3 py-1.5 text-center text-sm outline-none focus:border-amber-500 ${
          state === 'ok' ? 'border-green-500' : state === 'err' ? 'border-red-500' : 'border-neutral-700'}`}
      />
      <span className="w-5 text-center text-xs">
        {state === 'saving' ? '…' : state === 'ok' ? <span className="text-green-500">✓</span>
          : state === 'err' ? <span className="text-red-500">!</span> : null}
      </span>
    </div>
  )
}

export default function Prices() {
  const [products, setProducts] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [err, setErr] = useState('')

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([c, p]) => { setCats(c); setProducts(p) })
      .catch(() => setErr('خطا در دریافت اطلاعات'))
  }, [])

  const replace = (u: Product) => setProducts(l => l.map(x => (x.id === u.id ? u : x)))

  const groups = [
    ...cats.map(c => ({ id: c.id, title: c.name.fa, items: products.filter(p => p.categoryId === c.id) })),
    { id: 0, title: 'بدون دسته', items: products.filter(p => !cats.some(c => c.id === p.categoryId)) },
  ].filter(g => g.items.length > 0)

  return (
    <div dir="rtl" className="min-h-dvh bg-neutral-950 text-white font-[Vazirmatn]">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold">ویرایش سریع قیمت</h1>
            <p className="text-xs text-neutral-400">قیمت را بنویس و Enter بزن</p>
          </div>
          <Link to="/" className="text-sm text-neutral-400 hover:text-amber-400">بازگشت</Link>
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
                  <PriceInput p={p} onSaved={replace} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  )
}
