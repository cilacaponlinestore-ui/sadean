# SADEAN — BUSINESS RULE

---

## Aturan Umum

### 1. Akun
- Satu akun dapat menjadi Buyer dan Seller
- Email harus unik untuk setiap akun
- Password minimal 8 karakter
- Email harus valid dan aktif

### 2. Registrasi
- Registrasi Buyer: Langsung aktif
- Registrasi Seller: Menunggu verifikasi admin
- Verifikasi admin maksimal 1x24 jam

### 3. Login
- Login gagal 5x → akun terkunci 15 menit
- Session timeout: 24 jam
- Remember me: 30 hari

---

## Aturan Produk

### 1. Pembuatan Produk
- Produk wajib memiliki foto (minimal 1, maksimal 5)
- Produk wajib memiliki nama
- Produk wajib memiliki harga (Rp 0 tidak diperbolehkan)
- Produk wajib memiliki stok (minimal 0)
- Produk wajib memiliki deskripsi
- Produk wajib memiliki kategori

### 2. Harga
- Harga dalam Rupiah (Rp)
- Harga harus positif
- Harga dapat diubah kapan saja
- Harga lama tidak mempengaruhi order yang sudah dibuat

### 3. Stok
- Stok harus non-negatif
- Stok berkurang saat order dibuat
- Stok dikembalikan saat order dibatalkan
- Stok 0 = produk tidak tersedia

### 4. Foto Produk
- Format: JPG, PNG, WEBP
- Ukuran maks: 5MB per foto
- Resolusi minimal: 800x800 px
- Foto pertama adalah foto utama

### 5. Status Produk
- **Draft:** Belum dipublikasikan
- **Active:** Sedang dijual
- **Inactive:** Tidak dijual sementara
- **Sold Out:** Stok habis

---

## Aturan Kategori

### 1. Struktur
- Kategori memiliki nama unik
- Kategori dapat memiliki sub-kategori (max 2 level)
- Setiap produk harus memiliki minimal 1 kategori

### 2. Contoh Kategori
```
Makanan
├── Dodol
├── Keripik
├── Kue
└── Minuman
├── Kopi
├── Teh
└── Jus

Kerajinan
├── Batik
├── Anyaman
└── Ukiran
```

---

## Aturan Order

### 1. Pembuatan Order
- Order dibuat saat checkout
- Order memiliki nomor unik: ORD-YYYYMMDD-XXXX
- Order terkait dengan 1 buyer
- Order dapat memiliki banyak items

### 2. Item Order
- 1 item = 1 produk dengan quantity
- Harga item = harga saat order dibuat
- Subtotal = Harga × Quantity

### 3. Status Order
```
pending → confirmed → processing → shipped → delivered → completed
    ↓         ↓           ↓          ↓
 cancelled  cancelled  cancelled  cancelled
```

### 4. Transisi Status
| Dari | Ke | Oleh | Kondisi |
|------|-----|------|---------|
| pending | confirmed | Seller | Setelah konfirmasi WhatsApp |
| confirmed | processing | Seller | Sedang diproses |
| processing | shipped | Seller | Sudah dikirim |
| shipped | delivered | Buyer | Sudah diterima |
| delivered | completed | Buyer | Konfirmasi selesai |
| pending | cancelled | Seller/Buyer | Sebelum dikirim |
| confirmed | cancelled | Seller/Buyer | Sebelum diproses |
| processing | cancelled | Seller | Sebelum dikirim |
| shipped | cancelled | Tidak bisa | - |
| delivered | cancelled | Tidak bisa | - |
| completed | cancelled | Tidak bisa | - |

### 5. Nomor Order
- Format: ORD-YYYYMMDD-XXXX
- YYYY = Tahun
- MM = Bulan
- DD = Tanggal
- XXXX = Sequential number (0001-9999)
- Contoh: ORD-20260711-0001

---

## Aturan WhatsApp

### 1. Integrasi
- WhatsApp digunakan sebagai media komunikasi utama
- Link WhatsApp otomatis dibuat saat checkout
- Pesan otomatis berisi: Nama pembeli, Produk, Total, Alamat

### 2. Format Pesan
```
Halo [Nama Seller],

Saya [Nama Buyer] ingin memesan:
- [Produk 1] x [Qty] = Rp [Harga]
- [Produk 2] x [Qty] = Rp [Harga]

Total: Rp [Total]

Alamat: [Alamat]

Terima kasih.
```

### 3. Link WhatsApp
- Format: https://wa.me/[NomorSeller]?text=[EncodedMessage]
- Nomor seller harus terdaftar di WhatsApp
- Pesan harus di-encode URL

---

## Aturan Keranjang

### 1. Penambahan
- Produk yang sama dari seller yang sama → quantity bertambah
- Produk yang sama dari seller yang beda → item terpisah
- Maksimal 10 produk berbeda dalam 1 keranjang
- Maksimal quantity per produk: 99

### 2. Penghapusan
- Buyer dapat menghapus item kapan saja
- Keranjang kosong = tidak bisa checkout

### 3. Validasi
- Stok harus tersedia saat checkout
- Harga harus aktif saat checkout
- Seller harus aktif saat checkout

---

## Aturan Alamat

### 1. Struktur
- Nama Penerima
- Nomor HP
- Alamat Lengkap
- Kecamatan
- Kota/Kabupaten
- Provinsi
- Kode Pos

### 2. Validasi
- Nomor HP harus valid (08xxxxxxxxxx)
- Alamat tidak boleh kosong
- Kode Pos harus 5 digit

---

## Aturan Banner

### 1. Pembuatan
- Banner dibuat oleh admin
- Banner memiliki judul, gambar, dan link
- Banner dapat diaktifkan/nonaktifkan

### 2. Tampilan
- Banner ditampilkan di halaman utama
- Banner dapat di-scroll
- Maksimal 5 banner aktif

### 3. Ukuran
- Resolusi: 1200x400 px
- Format: JPG, PNG
- Ukuran maks: 2MB

---

## Aturan Favorit

### 1. Penambahan
- Buyer dapat menyukai produk
- 1 produk hanya dapat disukai 1x per buyer
- Menyukai produk tidak mengubah harga

### 2. Penghapusan
- Buyer dapat batal menyukai produk
- Produk yang tidak tersedia tetap dapat di-like

---

## Aturan Promo (V2)

### 1. Jenis
- Diskon persen (%)
- Diskon nominal (Rp)
- Buy 1 Get 1
- Free Ongkir

### 2. Kondisi
- Promo berlaku untuk periode tertentu
- Promo berlaku untuk kategori tertentu
- Promo tidak dapat digabung

---

## Aturan Rating & Review (V2)

### 1. Rating
- Rating: 1-5 bintang
- Hanya buyer yang sudah order dapat memberi rating
- 1 order hanya dapat 1 rating

### 2. Review
- Review maksimal 500 karakter
- Review dapat memiliki foto (maks 3)
- Review tidak dapat dihapus, hanya di-edit

---

## Aturan Admin

### 1. Verifikasi UMKM
- Admin memverifikasi data UMKM
- Data yang diverifikasi: Nama, Alamat, No. HP, Foto KTP
- Status: Pending, Approved, Rejected

### 2. Penonaktifan
- Admin dapat menonaktifkan toko
- Alasan penonaktifan wajib diisi
- Toko yang dinonaktifkan tidak muncul di pencarian

### 3. Monitoring
- Admin melihat semua transaksi
- Admin dapat melihat laporan
- Admin dapat export data

---

## Aturan Keamanan

### 1. Password
- Minimal 8 karakter
- Harus mengandung huruf besar, kecil, dan angka
- Tidak boleh menggunakan email sebagai password

### 2. Session
- JWT token: 24 jam
- Refresh token: 30 hari
- Token harus disimpan aman

### 3. Data
- Password di-hash dengan bcrypt
- Data sensitif tidak ditampilkan di frontend
- Semua API menggunakan HTTPS

---

## Aturan Notifikasi (V3)

### 1. Email
- Welcome email saat registrasi
- Order confirmation
- Status update
- Password reset

### 2. Push (V3)
- Order baru untuk seller
- Status order berubah
- Promo baru

---

**Status:** [x] Final