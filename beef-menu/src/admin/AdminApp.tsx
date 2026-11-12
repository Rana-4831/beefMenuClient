import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { AdminI18nProvider, useT } from './i18n'
import { clearAuth, getAuth, type Role } from './auth'
import Login from './pages/Login'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Prices from './pages/Prices'
import StaffProducts from './pages/StaffProducts'
import type { ReactElement } from 'react'

function Guard({ allow = ['admin', 'staff'], children }: { allow?: Role[]; children: ReactElement }) {
  const a = getAuth()
  if (!a) return <Navigate to="/login" replace />
  if (!allow.includes(a.role)) return <Navigate to={a.role === 'staff' ? '/staff' : '/'} replace />
  return children
}

const menu = [
  {
    to: '/categories',
    title: 'دستهبندیها',
    desc: 'افزودن، ویرایش و جستجوی دستهبندیها',
    role: 'admin' as Role,
    icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  },
  {
    to: '/products',
    title: 'محصولات',
    desc: 'مدیریت محصولات، تصاویر و موجودی',
    role: 'admin' as Role,
    icon: <path d="M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5m-18 4l9 5 9-5" />,
  },
  {
    to: '/prices',
    title: 'قیمتها',
    desc: 'تغییر سریع قیمت محصولات بدون صفحهی ویرایش',
    role: 'admin' as Role,
    icon: <path d="M4 6h16M4 12h10M4 18h7M17 15v6m-3-3h6" />,
  },
  {
    to: '/staff',
    title: 'موجودی محصولات',
    desc: 'تغییر وضعیت موجود / ناموجود',
    role: 'staff' as Role,
    icon: <path d="M20 6L9 17l-5-5" />,
  },
]

function Home() {
  const { t } = useT()
  const auth = getAuth()!
  const isAdmin = auth.role === 'admin'
  const items = menu.filter(m => m.role === auth.role || (isAdmin && m.role === 'admin'))

  return (
    <div className="min-h-dvh bg-neutral-950 text-white font-[Vazirmatn]">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold">پنل مدیریت</h1>
            <p className="text-xs text-neutral-400">
              {t('role')}:{' '}
              <span className={`rounded-full px-2 py-0.5 ${isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-300'}`}>
                {auth.role}
              </span>
            </p>
          </div>
          <button
            onClick={() => { clearAuth(); location.href = '/admin/login' }}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-red-500 hover:text-red-400"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        <p className="mb-4 text-sm text-neutral-400">بخش مورد نظر را انتخاب کنید</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(m => (
            <Link
              key={m.to}
              to={m.to}
              className="group flex items-start gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition hover:border-amber-500/60 hover:bg-neutral-900/80"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 transition group-hover:bg-amber-500 group-hover:text-black">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  {m.icon}
                </svg>
              </span>
              <span className="flex-1">
                <span className="block text-base font-bold">{m.title}</span>
                <span className="mt-1 block text-sm text-neutral-400">{m.desc}</span>
              </span>
              <span className="self-center text-neutral-600 transition group-hover:-translate-x-1 group-hover:text-amber-400">←</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default function AdminApp() {
  return (
    <AdminI18nProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Guard><Home /></Guard>} />
          <Route path="/categories" element={<Guard allow={['admin']}><Categories /></Guard>} />
          <Route path="/products" element={<Guard allow={['admin']}><Products /></Guard>} />
          <Route path="/prices" element={<Guard allow={['admin']}><Prices /></Guard>} />
          <Route path="/staff" element={<Guard><StaffProducts /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminI18nProvider>
  )
}
