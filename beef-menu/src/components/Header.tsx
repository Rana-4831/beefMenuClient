type Props = {
  onMenuClick: () => void
}

function Header({ onMenuClick }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <button
        type="button"
        aria-label="menu"
        onClick={onMenuClick}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-0.5 w-6 rounded bg-white" />
        <span className="h-0.5 w-6 rounded bg-white" />
        <span className="h-0.5 w-6 rounded bg-white" />
      </button>

      <h2 className="font-serif text-3xl text-white">Bella Bites</h2>

      {/* جای خالی هم‌اندازه‌ی همبرگر تا لوگو وسط بمونه */}
      <div className="h-10 w-10" />
    </header>
  )
}

export default Header
