import { createContext, useContext, type ReactNode } from 'react'

const fa = {
  title: 'پنل مدیریت',
  username: 'نام کاربری',
  password: 'رمز عبور',
  login: 'ورود',
  wrong: 'نام کاربری یا رمز اشتباه است',
  error: 'خطا در ارتباط با سرور',
  logout: 'خروج',
  role: 'نقش',
  loading: 'در حال ورود...',
}
export type Key = keyof typeof fa

const t = (k: Key) => fa[k]
const C = createContext({ t })

export function AdminI18nProvider({ children }: { children: ReactNode }) {
  return (
    <C.Provider value={{ t }}>
      <div dir="rtl">{children}</div>
    </C.Provider>
  )
}
export const useT = () => useContext(C)
