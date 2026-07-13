import { ProductDetailClient } from './client'

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug)
  return <ProductDetailClient product={product} />
}
