import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">SADEAN</h1>
        <p className="text-xl text-gray-600 mb-8">Dodolane Wong Cilacap</p>
        <p className="text-gray-500 mb-8 max-w-md">
          Platform Digital UMKM Cilacap. Temukan produk lokal berkualitas dari UMKM terpercaya.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}