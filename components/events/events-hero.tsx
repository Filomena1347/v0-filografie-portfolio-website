import { RotatingWord } from './rotating-word'

const facts = [
  { title: 'Same day', detail: 'edited photos, delivered on site' },
  { title: '30–50 photos', detail: 'carefully edited, ready to post' },
  { title: '2 reels a day', detail: 'finished during the event' },
]

export function EventsHero() {
  return (
    <header className="pt-20 md:pt-[120px]">
      <p className="flex items-center gap-3 text-[13px] uppercase leading-snug tracking-[0.12em] text-ev-muted">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-ev-accent" />
        Photo &amp; video for trade fairs and conferences
      </p>

      <h1 className="mt-8 font-display text-[clamp(48px,7.6vw,112px)] font-normal leading-[0.98] tracking-[-0.03em] text-balance">
        <span className="sr-only">Your event in good hands.</span>
        <span aria-hidden="true">
          Your <RotatingWord />
          <br />
          in good hands.
        </span>
      </h1>

      <div className="mt-12 flex flex-wrap items-start justify-between gap-x-16 gap-y-10">
        <p className="max-w-[460px] text-[19px] leading-relaxed text-ev-body text-pretty">
          Your booth, your stage and your people, from the first coffee to the last handshake.
          Content you can post while the event is still running.
        </p>

        <ul className="flex flex-wrap gap-x-10 gap-y-8">
          {facts.map((fact) => (
            <li key={fact.title} className="border-l border-ev-line pl-5">
              <p className="font-display text-[34px] leading-none">{fact.title}</p>
              <p className="mt-2 text-sm text-ev-muted">{fact.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
