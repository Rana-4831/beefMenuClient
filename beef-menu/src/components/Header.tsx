import LanguageSwitcher from './LanguageSwitcher'

type Props = {
  onMenuClick: () => void
}

function Header({ onMenuClick }: Props) {
  return (
    <header dir="rtl" className="flex items-center justify-between px-5 py-1">
      <button
        type="button"
        aria-label="menu"
        onClick={onMenuClick}
        className="flex h-8 w-8 flex-col items-center justify-center gap-1"
      >
        <span className="h-0.5 w-5 rounded bg-white" />
        <span className="h-0.5 w-5 rounded bg-white" />
        <span className="h-0.5 w-5 rounded bg-white" />
      </button>

      <LanguageSwitcher />
    </header>
  )
}

export default Header
