export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>{eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-teal-600">{eyebrow}</p>}<h1 className="text-2xl font-bold text-ink md:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>
      {action}
    </div>
  )
}

