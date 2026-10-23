export function WorkHeading({ label, index, id }: { label: string; index: string; id: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between border-t border-ev-text pt-4">
      <h2 id={id} className="text-sm font-medium uppercase tracking-[0.14em]">
        {label}
      </h2>
      <span aria-hidden="true" className="text-sm tabular-nums text-ev-muted">
        {index}
      </span>
    </div>
  )
}
