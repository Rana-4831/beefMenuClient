import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError, getCategories, getProducts, imageUrl, storeProduct, updateProduct, uploadFile,
  reorderProducts, moveIds,
  type Category, type Product, type ProductInput,
} from '../api'

const empty: ProductInput = {
  name_fa: '', name_en: '', name_tr: '',
  description_fa: '', description_en: '', description_tr: '',
  price: 0, category_id: 0,
  available: true, best_seller: false, is_new: false,
}

const toForm = (p: Product): ProductInput => ({
  name_fa: p.name.fa ?? '', name_en: p.name.en ?? '', name_tr: p.name.tr ?? '',
  description_fa: p.description.fa ?? '',
  description_en: p.description.en ?? '',
  description_tr: p.description.tr ?? '',
  price: p.price, category_id: p.categoryId,
  available: p.available, best_seller: p.bestSeller, is_new: p.isNew,
})

export default function Products() {
  const [list, setList] = useState<Product[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductInput>(empty)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [open, setOpen] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [moving, setMoving] = useState(false)
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState(0)
  const [drag, setDrag] = useState(false)

  const load = () => getProducts().then(setList).catch(() => setErr('خطا در دریافت محصولات'))
  useEffect(() => { load(); getCategories().then(setCats).catch(() => {}) }, [])

  const text = (k: keyof ProductInput) =>
    (e: { target: { value: string } }) => setForm(f => ({ ...f, [k]: e.target.value }))
  const num = (k: 'price' | 'category_id') =>
    (e: { target: { value: string } }) => setForm(f => ({ ...f, [k]: Number(e.target.value) }))
  const flag = (k: 'available' | 'best_seller' | 'is_new') =>
    (e: { target: { checked: boolean } }) => setForm(f => ({ ...f, [k]: e.target.checked }))

  function startNew() {
    setEditId(null); setForm(empty); setFile(null); setPreview(''); setErr(''); setOpen(true)
  }
  function startEdit(p: Product) {
    setEditId(p.id); setForm(toForm(p)); setFile(null)
    setPreview(imageUrl(p.image)); setErr(''); setOpen(true)
  }
  function pick(f: File | null) {
    setFile(f)
    if (f) setPreview(URL.createObjectURL(f))
  }

  // فقط محصولات همان دسته جابه‌جا می‌شوند
  async function move(catId: number, index: number, dir: -1 | 1) {
    setErr(''); setMoving(true)
    try {
      const inCat = list.filter(p => p.categoryId === catId)
      await reorderProducts(moveIds(inCat, index, dir))
      await load()
    } catch {
      setErr('خطا در تغییر ترتیب')
    } finally { setMoving(false) }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr('')
    if (!form.category_id) { setErr('دسته‌بندی را انتخاب کنید'); return }
    setBusy(true)
    try {
      const data: ProductInput = { ...form }
      if (file) data.file_id = await uploadFile(file)
      if (editId === null) await storeProduct(data)
      else await updateProduct(editId, data)
      setOpen(false)
      await load()
    } catch (x) {
      if (x instanceof ApiError && x.status === 422) {
        const first = Object.values(x.data?.errors ?? {})[0] as string[] | undefined
        setErr(first?.[0] ?? x.data?.message ?? 'اطلاعات نامعتبر است')
      } else if (x instanceof ApiError && x.status === 403) setErr('دسترسی ندارید')
      else setErr('خطا در ذخیره')
    } finally { setBusy(false) }
  }

  const norm = q.trim().toLowerCase()
  const shown = list.filter(p =>
    (!catFilter || p.categoryId === catFilter) &&
    (!norm || [p.name.fa, p.name.en, p.name.tr].some(n => n?.toLowerCase().includes(norm))))
  const groups = [
    ...cats.map(c => ({ key: c.id, title: c.name.fa || c.slug || '-', items: shown.filter(p => p.categoryId === c.id) })),
    { key: 0, title: 'بدون دسته‌بندی', items: shown.filter(p => !cats.some(c => c.id === p.categoryId)) },
  ].filter(g => g.items.length)

  const row = (p: Product, catKey: number) => {
    const inCat = catKey ? list.filter(x => x.categoryId === catKey) : []
    const i = inCat.findIndex(x => x.id === p.id)
    const lockMove = moving || !!norm || !catKey
    return (
      <li key={p.id} className="flex items-center gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-3">
        {p.image
          ? <img src={imageUrl(p.image)} alt="" className="h-14 w-14 rounded-lg object-cover" />
          : <div className="h-14 w-14 rounded-lg bg-neutral-800" />}
        <div className="flex-1">
          <p className="font-bold">{p.name.fa || '—'}</p>
          <p className="text-xs text-neutral-400">
            {p.price.toLocaleString('fa-IR')}
            {!p.available && ' · ناموجود'}{p.bestSeller && ' · پرفروش'}{p.isNew && ' · جدید'}
          </p>
        </div>
        <button
          onClick={() => move(catKey, i, -1)}
          disabled={lockMove || i <= 0}
          className="rounded bg-neutral-800 px-2 py-1 text-sm disabled:opacity-30"
          aria-label="بالا"
        >▲</button>
        <button
          onClick={() => move(catKey, i, 1)}
          disabled={lockMove || i === inCat.length - 1}
          className="rounded bg-neutral-800 px-2 py-1 text-sm disabled:opacity-30"
          aria-label="پایین"
        >▼</button>
        <button onClick={() => startEdit(p)} className="rounded bg-neutral-800 px-3 py-1 text-sm">ویرایش</button>
      </li>
    )
  }

  const input = 'w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white outline-none focus:border-amber-500'

  return (
    <div className="min-h-dvh bg-neutral-950 text-white p-4 font-[Vazirmatn]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-neutral-400">← بازگشت</Link>
            <h1 className="text-xl font-bold">محصولات</h1>
          </div>
          <button onClick={startNew} className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black">افزودن</button>
        </div>

        {err && !open && <p className="text-red-400 text-sm mb-3">{err}</p>}

        <input
          className={input + ' mb-3'}
          placeholder="جستجوی محصول..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {[{ id: 0, label: 'همه' }, ...cats.map(c => ({ id: c.id, label: c.name.fa || c.slug || '-' }))].map(c => (
            <button
              key={c.id}
              onClick={() => setCatFilter(c.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${
                catFilter === c.id ? 'bg-amber-500 font-bold text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {groups.length === 0 && <p className="text-center text-neutral-500 py-8">محصولی پیدا نشد</p>}

        {groups.map(g => (
          <section key={g.key} className="mb-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-500">
              {g.title}
              <span className="rounded-full bg-neutral-800 px-2 text-xs text-neutral-400">{g.items.length}</span>
            </h2>
            <ul className="space-y-2">{g.items.map(p => row(p, g.key))}</ul>
          </section>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={submit} className="w-full max-w-lg max-h-[90dvh] overflow-y-auto space-y-3 rounded-2xl bg-neutral-900 p-5 border border-neutral-800">
            <h2 className="text-lg font-bold">{editId === null ? 'محصول جدید' : 'ویرایش محصول'}</h2>

            <select className={input} value={form.category_id} onChange={num('category_id')} required>
              <option value={0}>انتخاب دسته‌بندی</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name.fa || c.slug}</option>)}
            </select>

            <input className={input} placeholder="نام (فارسی)" value={form.name_fa} onChange={text('name_fa')} required />
            <input className={input} dir="ltr" placeholder="Name (English)" value={form.name_en} onChange={text('name_en')} />
            <input className={input} dir="ltr" placeholder="Ad (Türkçe)" value={form.name_tr} onChange={text('name_tr')} />

            <textarea className={input} placeholder="توضیحات (فارسی)" value={form.description_fa} onChange={text('description_fa')} />
            <textarea className={input} dir="ltr" placeholder="Description (English)" value={form.description_en} onChange={text('description_en')} />
            <textarea className={input} dir="ltr" placeholder="Açıklama (Türkçe)" value={form.description_tr} onChange={text('description_tr')} />

            <input className={input} type="number" min={0} placeholder="قیمت" value={form.price} onChange={num('price')} required />

            <label
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false)
                const f = e.dataTransfer.files[0]
                if (f && f.type.startsWith('image/')) pick(f)
              }}
              className={`relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
                drag ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-500'
              }`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute bottom-2 rounded-full bg-black/70 px-3 py-1 text-xs">تغییر تصویر</span>
                </>
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <span className="mt-2 text-sm text-neutral-300">تصویر را بکشید یا انتخاب کنید</span>
                  <span className="mt-1 text-xs text-neutral-500">JPG, PNG, WebP · حداکثر ۱۰ مگابایت</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={e => pick(e.target.files?.[0] ?? null)}
              />
            </label>

            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.available} onChange={flag('available')} /> موجود</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.best_seller} onChange={flag('best_seller')} /> پرفروش</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={flag('is_new')} /> جدید</label>
            </div>

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <div className="flex gap-2">
              <button disabled={busy} className="flex-1 rounded-lg bg-amber-500 py-2 font-bold text-black disabled:opacity-50">
                {busy ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-neutral-800 px-4 py-2">انصراف</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
