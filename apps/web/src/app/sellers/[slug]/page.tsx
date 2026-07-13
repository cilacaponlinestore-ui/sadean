import { SellerDetailClient } from './client'

interface Props {
  params: { slug: string }
}

async function getSeller(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers/${slug}`, {
    next: { revalidate: 120 },
  })
  if (!res.ok) return { seller: null, products: [] }
  return res.json()
}

export default async function SellerDetailPage({ params }: Props) {
  const data = await getSeller(params.slug)
  return <SellerDetailClient seller={data.seller} products={data.products || []} />
}
