interface Props {
  id: string
  title: string
}

function SectionDivider({ id, title }: Props) {
  return (
    <div className="flex items-center gap-3 px-6">
      <span className="h-px flex-1 bg-white/15" aria-hidden />
      <h2 id={id} className="font-serif text-lg text-white/80">
        {title}
      </h2>
      <span className="h-px flex-1 bg-white/15" aria-hidden />
    </div>
  )
}

export default SectionDivider
