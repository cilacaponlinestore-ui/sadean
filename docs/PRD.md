# SADEAN — PRD (Product Requirement Document)

---

## Background

UMKM di Cilacap membutuhkan platform digital untuk memasarkan produk secara online. Saat ini, sebagian besar UMKM masih mengandalkan penjualan offline dan media sosial yang tidak terstruktur. SADEAN hadir sebagai solusi marketplace lokal yang terintegrasi dengan WhatsApp.

---

## Objective

Membangun marketplace V1 yang:
1. Memungkinkan UMKM mendaftar dan menjual produk secara online
2. Memudahkan pembeli menemukan dan membeli produk lokal
3. Mengintegrasikan WhatsApp sebagai saluran komunikasi utama
4. Menyediakan dashboard admin untuk verifikasi dan monitoring

---

## Scope V1

### Fitur Utama
- Autentikasi (Login/Register)
- Dashboard Buyer
- Dashboard Seller
- Dashboard Admin
- Profil UMKM
- Manajemen Produk
- Kategori Produk
- Keranjang Belanja
- Checkout
- Manajemen Order
- Riwayat Order
- WhatsApp Checkout Integration
- Banner Management

---

## Out of Scope

### V2
- Rating & Review
- Promo System
- Favorit

### V3
- Payment Gateway
- Notifikasi Push

### V4
- Delivery Integration
- Tracking

### V5
- AI Assistant
- Dashboard Analytics

---

## User Persona

### Buyer (Pembeli)
- **Usia:** 18-55 tahun
- **Karakteristik:** Masyarakat Cilacap yang ingin berbelanja produk lokal
- **Kebutuhan:** Belanja mudah, produk berkualitas, harga terjangkau
- **Pain Point:** Sulit menemukan produk UMKM lokal secara online

### Seller (Penjual/UMKM)
- **Usia:** 25-60 tahun
- **Karakteristik:** Pemilik UMKM di Cilacap
- **Kebutuhan:** Menjual produk secara online, mengelola pesanan
- **Pain Point:** Tidak paham teknologi, biaya platform mahal

### Admin
- **Usia:** 20-40 tahun
- **Karakteristik:** Pengelola platform
- **Kebutuhan:** Memverifikasi UMKM, monitoring transaksi
- **Pain Point:** Kesulitan memverifikasi banyak UMKM secara manual

---

## User Story

### Buyer
```
Sebagai pembeli
Saya ingin mencari dan membeli produk UMKM lokal
Agar saya bisa mendapatkan produk berkualitas dengan mudah
```

### Seller
```
Sebagai penjual UMKM
Saya ingin menjual produk saya secara online
Agar saya bisa menjangkau lebih banyak pembeli
```

### Admin
```
Sebagai admin
Saya ingin memverifikasi dan mengelola UMKM
Agar platform tetap terpercaya dan aman
```

---

## Functional Requirements

### Authentication
- [ ] User dapat mendaftar akun baru
- [ ] User dapat login dengan email dan password
- [ ] User dapat logout
- [ ] User dapat memilih role (Buyer/Seller) saat registrasi

### Product
- [ ] Buyer dapat melihat daftar produk
- [ ] Buyer dapat mencari produk
- [ ] Buyer dapat melihat detail produk
- [ ] Seller dapat menambah produk
- [ ] Seller dapat mengedit produk
- [ ] Seller dapat menghapus produk
- [ ] Seller dapat mengupload foto produk

### Category
- [ ] Buyer dapat melihat daftar kategori
- [ ] Buyer dapat filter produk berdasarkan kategori

### Cart
- [ ] Buyer dapat menambah produk ke keranjang
- [ ] Buyer dapat mengubah jumlah produk di keranjang
- [ ] Buyer dapat menghapus produk dari keranjang

### Order
- [ ] Buyer dapat checkout dari keranjang
- [ ] Order memiliki nomor unik
- [ ] Buyer dapat melihat riwayat order
- [ ] Seller dapat melihat order masuk
- [ ] Seller dapat mengubah status order

### WhatsApp Integration
- [ ] Buyer dapat menghubungi seller via WhatsApp setelah checkout
- [ ] Pesan WhatsApp otomatis terisi data order

### Admin
- [ ] Admin dapat melihat dashboard
- [ ] Admin dapat memverifikasi UMKM
- [ ] Admin dapat menonaktifkan toko
- [ ] Admin dapat mengelola banner

---

## Non Functional Requirements

### Performance
- Halaman harus load dalam < 3 detik
- API response time < 1 detik
- Dapat menangani 100 concurrent users

### Security
- Password di-hash dengan bcrypt
- JWT token untuk autentikasi
- HTTPS untuk semua komunikasi
- Input validation dan sanitization

### Scalability
- Dapat di-deploy di VPS murah (1 vCPU, 1GB RAM)
- Database dapat di-scale vertikal

### Usability
- Interface sederhana dan intuitif
- Mobile-friendly responsive design
- Bahasa Indonesia sebagai default

### Reliability
- Uptime 99% untuk V1
- Backup database harian
- Error handling yang proper

---

## Success Metrics

### Adoption
- 50 UMKM terdaftar dalam 3 bulan pertama
- 200 pembeli aktif dalam 3 bulan pertama
- 500 transaksi dalam 3 bulan pertama

### Engagement
- 60% UMKM aktif mengupload produk
- 40% pembeli melakukan repeat order
- Average order value > Rp 50.000

### Retention
- 70% UMKM aktif setelah 3 bulan
- 50% pembeli aktif setelah 3 bulan

---

## KPI

| Metric | Target | Timeline |
|--------|--------|----------|
| UMKM Terdaftar | 50 | 3 bulan |
| Pembeli Aktif | 200 | 3 bulan |
| Total Transaksi | 500 | 3 bulan |
| UMKM Aktif | 35 (70%) | 3 bulan |
| Repeat Buyer | 100 (50%) | 3 bulan |
| Average Order | > Rp 50.000 | 3 bulan |

---

**Status:** [x] Final