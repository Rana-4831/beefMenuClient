import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/vazirmatn/300.css'
import '@fontsource/vazirmatn/400.css'
import '@fontsource/vazirmatn/500.css'
import '@fontsource/vazirmatn/700.css'
import '@fontsource/lalezar/400.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import './index.css'
import './i18n'
import App from './App.tsx'

const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))
const isAdmin = location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
