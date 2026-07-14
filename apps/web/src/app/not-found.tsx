import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-md text-center">
        <p className="text-8xl font-black text-primary-200">404</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-3 leading-7 text-gray-500">
          Sepertinya kamu nyasar. Halaman yang kamu cari sudah dipindahkan atau tidak pernah ada.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="focus-ring rounded-xl bg-primary-700 px-6 py-3 font-bold text-white hover:bg-primary-800">
            Kembali ke Beranda
          </Link>
          <Link href="/products" className="focus-ring rounded-xl border border-black/10 bg-white px-6 py-3 font-bold hover:bg-gray-50">
            Lihat Produk
          </Link>
        </div>
      </div>
    </main>
  );
}
