import { Suspense } from 'react'
import { EventsHero } from '@/components/events/events-hero'
import { PhotoGrid } from '@/components/events/photo-grid'
import { ReelList } from '@/components/events/reel-list'
import { PhotoGridSkeleton, ReelListSkeleton } from '@/components/events/skeletons'
import { WorkHeading } from '@/components/events/work-heading'
import { eventPhotos, eventVideos } from '@/lib/events-data'
import { getEventPhotos, getEventVideos } from '@/lib/events-media'

export const dynamic = 'force-dynamic'

async function Reels() {
  const videos = await getEventVideos()
  return <ReelList videos={videos.length > 0 ? videos : eventVideos} />
}

async function Photos() {
  const photos = await getEventPhotos()
  return <PhotoGrid photos={photos.length > 0 ? photos : eventPhotos} />
}

export default function EventsPage() {
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pb-24 sm:px-10 md:pb-32">
      <EventsHero />

      <div className="mt-20 flex flex-wrap gap-x-10 gap-y-16 md:mt-28">
        <section aria-labelledby="video-heading" className="min-w-0 max-w-[420px] flex-[1_1_320px]">
          <WorkHeading id="video-heading" label="Video" index="01" />
          <Suspense fallback={<ReelListSkeleton />}>
            <Reels />
          </Suspense>
        </section>

        <section aria-labelledby="photo-heading" className="min-w-0 flex-[999_1_560px]">
          <WorkHeading id="photo-heading" label="Photo" index="02" />
          <Suspense fallback={<PhotoGridSkeleton />}>
            <Photos />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
