const KEY = 'admin_auth'
export type Role = 'admin' | 'staff'
export interface Auth { token: string; role: Role }

export const getAuth = (): Auth | null => {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}
export const setAuth = (a: Auth) => localStorage.setItem(KEY, JSON.stringify(a))
export const clearAuth = () => localStorage.removeItem(KEY)
