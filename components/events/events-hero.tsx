import { EditDot } from './edit-dot'
import { RotatingWord } from './rotating-word'

const facts = [
  { title: 'Edited same day', detail: 'delivered on site' },
  { title: '50–100 photos', detail: 'carefully edited, ready to post' },
  { title: '1-2 reels a day', detail: 'finished during the event' },
]

export function EventsHero() {
  return (
    <header className="pt-20 md:pt-[78px]">
      <p className="flex items-center gap-3 text-[14px] uppercase leading-snug tracking-[0.12em] text-ev-muted">
        <EditDot />
        Photo &amp; video for trade fairs and conferences
      </p>

      <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h1 className="font-display text-[clamp(48px,7.6vw,112px)] font-normal leading-[0.98] tracking-[-0.03em] text-balance">
          <span className="sr-only">Your event in good hands.</span>
          <span aria-hidden="true">
            Your <RotatingWord />
            <br />
            in good hands.
          </span>
        </h1>

        <ul className="mt-[22px] flex flex-wrap gap-x-10 gap-y-8 lg:mt-0 lg:shrink-0 lg:flex-col lg:flex-nowrap lg:gap-y-6 lg:pb-2">
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
