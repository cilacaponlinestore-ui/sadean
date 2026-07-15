import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SADEAN - Platform Digital UMKM Cilacap',
    short_name: 'SADEAN',
    description: 'Dodolane Wong Cilacap - Marketplace UMKM Cilacap',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f6f1',
    theme_color: '#059669',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
