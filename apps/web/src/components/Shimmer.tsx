'use client';

export function Shimmer({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-black/5 ${className}`} />;
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-black/5 bg-white">
          <Shimmer className="aspect-square" />
          <div className="space-y-3 p-4">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-5 w-full" />
            <Shimmer className="h-5 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <Shimmer className="mb-4 h-5 w-1/3" />
      <Shimmer className="mb-2 h-4 w-full" />
      <Shimmer className="mb-2 h-4 w-2/3" />
      <Shimmer className="h-4 w-1/2" />
    </div>
  );
}
