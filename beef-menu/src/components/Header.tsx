import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

type Props = {
  onMenuClick: () => void
}

function Header({ onMenuClick }: Props) {
  const { t } = useTranslation()

  return (
    <header dir="rtl" className="flex items-center justify-center px-5 py-2">
      <div
        className="flex items-center gap-1 rounded-full border border-cream/25 bg-cream/10 px-2 py-1 backdrop-blur-md"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(239,232,218,0.25), 0 8px 20px rgba(0,0,0,0.35)',
        }}
      >

        <LanguageSwitcher />

        <span className="h-4 w-px bg-cream/20" />

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-full px-3 py-1.5 text-sm tracking-wide text-cream/85 transition hover:bg-cream/10 hover:text-cream active:scale-[0.97]"
        >
          {t('header.categories')}
        </button>
      </div>
    </header>
  )
}

export default Header
