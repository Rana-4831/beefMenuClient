import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, ApiError } from '../api'
import { setAuth } from '../auth'
import { useT } from '../i18n'

export default function Login() {
  const { t } = useT()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
const a = await login(name, password)
setAuth(a)
nav(a.role === 'staff' ? '/staff' : '/', { replace: true })

    } catch (x) {
      setErr(x instanceof ApiError && x.status < 500 ? t('wrong') : t('error'))
    } finally { setBusy(false) }
  }

  const input = 'w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white outline-none focus:border-amber-500'

  return (
    <div className="min-h-dvh bg-neutral-950 text-white flex items-center justify-center p-4 font-[Vazirmatn]">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
        <h1 className="text-xl font-bold">{t('title')}</h1>
        <input className={input} placeholder={t('username')} value={name} onChange={e => setName(e.target.value)} autoComplete="username" required />
        <input className={input} type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-accent py-2 font-bold text-white disabled:opacity-50">
          {busy ? t('loading') : t('login')}
        </button>
      </form>
    </div>
  )
}
