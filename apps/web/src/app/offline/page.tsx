import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">📡</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Koneksi Terputus</h1>
        <p className="mb-6 text-gray-600">
          Kamu sedang offline. Beberapa halaman mungkin tidak bisa diakses.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-emerald-600 px-6 py-3 text-white transition hover:bg-emerald-700"
        >
          Coba Lagi
        </Link>
      </div>
    </div>
  )
}
