const photoRatios = ['aspect-[3/2]', 'aspect-[2/3]', 'aspect-[4/5]', 'aspect-square', 'aspect-[16/9]', 'aspect-[3/4]']

const box = 'rounded-[4px] bg-ev-soft motion-safe:animate-pulse'

export function ReelListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={`aspect-[9/16] ${box}`} />
      ))}
    </ul>
  )
}

export function PhotoGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="columns-2 gap-4">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={`mb-4 break-inside-avoid ${photoRatios[index % photoRatios.length]} ${box}`} />
      ))}
    </ul>
  )
}
