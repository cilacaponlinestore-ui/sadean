'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder: number;
}

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const length = banners.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % length), [length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + length) % length), [length]);

  useEffect(() => {
    if (length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [length, next]);

  if (!length) return null;

  const banner = banners[current];

  const inner = (
    <div
      className="relative h-[320px] w-full overflow-hidden rounded-[2rem] bg-gray-800 bg-cover bg-center shadow-soft sm:h-[400px]"
      style={{ backgroundImage: `url(${banner.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="max-w-lg text-white">
           <h2 className="text-3xl font-black tracking-tight md:text-5xl">{banner.title}</h2>
          {banner.subtitle && <p className="text-sm md:text-lg text-gray-200 mb-4">{banner.subtitle}</p>}
          {banner.linkUrl && (
            <span className="inline-block px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition">
              Lihat Selengkapnya
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {banner.linkUrl ? <Link href={banner.linkUrl}>{inner}</Link> : inner}

      {length > 1 && (
        <>
           <button aria-label="Banner sebelumnya" onClick={prev} className="focus-ring absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition hover:bg-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
           <button aria-label="Banner berikutnya" onClick={next} className="focus-ring absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow transition hover:bg-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
               <button key={i} aria-label={`Tampilkan banner ${i + 1}`} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
