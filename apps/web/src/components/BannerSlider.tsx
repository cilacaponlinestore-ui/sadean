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
      className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] bg-gray-800 bg-cover bg-center rounded-2xl overflow-hidden"
      style={{ backgroundImage: `url(${banner.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="max-w-lg text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
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
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow transition z-10">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow transition z-10">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
