import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortfolioHome } from "@/components/portfolio-home"
import { CATEGORY_TITLES, categoryFromSlug, categoryPath } from "@/lib/category-routes"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const key = categoryFromSlug(category, "cs")
  if (!key) return {}
  return {
    title: { absolute: `${CATEGORY_TITLES[key]?.cs} | Filografie` },
    alternates: {
      canonical: categoryPath(key, "cs"),
      languages: { en: categoryPath(key, "en"), cs: categoryPath(key, "cs") },
    },
  }
}

export default async function CzechCategoryPage({ params }: Props) {
  const { category } = await params
  if (!categoryFromSlug(category, "cs")) notFound()
  return <PortfolioHome />
}
