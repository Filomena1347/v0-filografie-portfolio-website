import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { PortfolioHome } from "@/components/portfolio-home"
import { CATEGORY_TITLES, categoryFromSlug, categoryPath } from "@/lib/category-routes"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const key = categoryFromSlug(category, "en")
  if (!key) return {}
  return {
    title: { absolute: `${CATEGORY_TITLES[key]?.en} | Filografie` },
    alternates: {
      canonical: categoryPath(key, "en"),
      languages: { en: categoryPath(key, "en"), cs: categoryPath(key, "cs") },
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  if (categoryFromSlug(category, "en")) return <PortfolioHome />

  // Czech slugs typed without the /cs prefix (e.g. /eventy) go to the Czech page.
  const czechKey = categoryFromSlug(category, "cs")
  if (czechKey) permanentRedirect(categoryPath(czechKey, "cs"))

  notFound()
}
