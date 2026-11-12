import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError, getCategories, getIcons, storeCategory, updateCategory,
  reorderCategories, moveIds,
  type Category, type CategoryInput,
} from '../api'

const empty: CategoryInput = {
  slug: '', icon: '',
  name_fa: '', name_en: '', name_tr: '',
  description_fa: '', description_en: '', description_tr: '',
}

const toForm = (c: Category): CategoryInput => ({
  slug: c.slug ?? '', icon: c.icon ?? '',
  name_fa: c.name.fa ?? '', name_en: c.name.en ?? '', name_tr: c.name.tr ?? '',
  description_fa: c.description?.fa ?? '',
  description_en: c.description?.en ?? '',
  description_tr: c.description?.tr ?? '',
})

export default function Categories() {
  const [list, setList] = useState<Category[]>([])
  const [icons, setIcons] = useState<string[]>([])
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CategoryInput>(empty)
  const [open, setOpen] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [moving, setMoving] = useState(false)
  const [q, setQ] = useState('')

  const load = () => getCategories().then(setList).catch(() => setErr('خطا در دریافت دسته‌بندی‌ها'))
  useEffect(() => { load(); getIcons().then(setIcons).catch(() => {}) }, [])

  const set = (k: keyof CategoryInput) =>
    (e: { target: { value: string } }) => setForm(f => ({ ...f, [k]: e.target.value }))

  function startNew() { setEditId(null); setForm(empty); setErr(''); setOpen(true) }
  function startEdit(c: Category) { setEditId(c.id); setForm(toForm(c)); setErr(''); setOpen(true) }

  async function move(index: number, dir: -1 | 1) {
    setErr(''); setMoving(true)
    try {
      await reorderCategories(moveIds(list, index, dir))
      await load()
    } catch {
      setErr('خطا در تغییر ترتیب')
    } finally { setMoving(false) }
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      if (editId === null) await storeCategory(form)
      else await updateCategory(editId, form)
      setOpen(false)
      await load()
    } catch (x) {
      if (x instanceof ApiError && x.status === 422) {
        const first = Object.values(x.data?.errors ?? {})[0] as string[] | undefined
        setErr(first?.[0] ?? 'اطلاعات نامعتبر است')
      } else if (x instanceof ApiError && x.status === 403) setErr('دسترسی ندارید')
      else setErr('خطا در ذخیره')
    } finally { setBusy(false) }
  }

  const norm = q.trim().toLowerCase()
  const shown = list.filter(c =>
    !norm || [c.name.fa, c.name.en, c.name.tr, c.slug].some(v => v?.toLowerCase().includes(norm)))

  const input = 'w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white outline-none focus:border-amber-500'

  return (
    <div className="min-h-dvh bg-neutral-950 text-white p-4 font-[Vazirmatn]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-neutral-400">← بازگشت</Link>
            <h1 className="text-xl font-bold">دسته‌بندی‌ها</h1>
          </div>
          <button onClick={startNew} className="rounded-lg bg-amber-500 px-4 py-2 font-bold text-black">
            افزودن
          </button>
        </div>

        {err && !open && <p className="text-red-400 text-sm mb-3">{err}</p>}

        <input
          className={input + ' mb-3'}
          placeholder="جستجوی دسته‌بندی..."
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        {shown.length === 0 && <p className="text-center text-neutral-500 py-8">دسته‌بندی‌ای پیدا نشد</p>}

        <ul className="space-y-2">
          {shown.map(c => {
            const i = list.findIndex(x => x.id === c.id)
            const lockMove = moving || !!norm
            return (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-neutral-900 border border-neutral-800 p-3">
                <div>
                  <p className="font-bold">{c.name.fa || '— بدون نام —'}</p>
                  <p className="text-xs text-neutral-400" dir="ltr">
                    {c.slug ?? '-'} · {c.icon ?? '-'} · {c.name.en ?? '-'} · {c.name.tr ?? '-'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={lockMove || i === 0}
                    className="rounded bg-neutral-800 px-2 py-1 text-sm disabled:opacity-30"
                    aria-label="بالا"
                  >▲</button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={lockMove || i === list.length - 1}
                    className="rounded bg-neutral-800 px-2 py-1 text-sm disabled:opacity-30"
                    aria-label="پایین"
                  >▼</button>
                  <button onClick={() => startEdit(c)} className="rounded bg-neutral-800 px-3 py-1 text-sm">
                    ویرایش
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={submit} className="w-full max-w-lg max-h-[90dvh] overflow-y-auto space-y-3 rounded-2xl bg-neutral-900 p-5 border border-neutral-800">
            <h2 className="text-lg font-bold">{editId === null ? 'دسته‌بندی جدید' : 'ویرایش دسته‌بندی'}</h2>

            <input className={input} dir="ltr" placeholder="slug (مثلاً grill-menu)" value={form.slug} onChange={set('slug')} required />

            <select className={input} value={form.icon} onChange={set('icon')} required>
              <option value="">انتخاب آیکون</option>
              {icons.map(i => <option key={i} value={i}>{i}</option>)}
            </select>

            <input className={input} placeholder="نام (فارسی)" value={form.name_fa} onChange={set('name_fa')} required />
            <input className={input} dir="ltr" placeholder="Name (English)" value={form.name_en} onChange={set('name_en')} required />
            <input className={input} dir="ltr" placeholder="Ad (Türkçe)" value={form.name_tr} onChange={set('name_tr')} required />

            <textarea className={input} placeholder="توضیحات (فارسی)" value={form.description_fa} onChange={set('description_fa')} />
            <textarea className={input} dir="ltr" placeholder="Description (English)" value={form.description_en} onChange={set('description_en')} />
            <textarea className={input} dir="ltr" placeholder="Açıklama (Türkçe)" value={form.description_tr} onChange={set('description_tr')} />

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <div className="flex gap-2">
              <button disabled={busy} className="flex-1 rounded-lg bg-amber-500 py-2 font-bold text-black disabled:opacity-50">
                {busy ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-neutral-800 px-4 py-2">
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
