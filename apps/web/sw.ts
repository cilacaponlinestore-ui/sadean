import { defaultCache } from '@serwist/next/worker'
import { installSerwist } from '@serwist/sw'

installSerwist({
  precacheEntries: (self as any).__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline',
        revision: '1',
        matcher: ({ request }) => request.mode === 'navigate',
      },
    ],
  },
})
