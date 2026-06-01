# [Phase 2] Backend, Database, Credit System & Payment Integration

## 📌 Context
Phase 1 (Core Studio MVP) telah selesai. Saat ini aplikasi sudah memiliki UI Studio yang berfungsi, integrasi Auth menggunakan Clerk, dan integrasi AI Generation menggunakan OpenRouter. 

**Masalah saat ini:** 
1. Hasil gambar (history) hilang saat page di-refresh karena hanya disimpan di *local state*.
2. Gambar langsung di-serve dari URL sementara OpenRouter (bisa expired).
3. Siapapun yang login bisa generate gambar tanpa batas (bisa menguras saldo OpenRouter kita).

**Tujuan Phase 2:** 
Mengubah prototipe ini menjadi produk SaaS sungguhan dengan mengimplementasikan Database, penyimpanan gambar permanen (ImageKit), sistem kuota/kredit, dan gerbang pembayaran.

---

## 🛠 Tech Stack untuk Phase 2
- **Database ORM:** Prisma (sangat direkomendasikan untuk Junior/AI karena type-safety dan dokumentasi yang jelas).
- **Database Engine:** PostgreSQL (bisa pakai Supabase / Neon / Vercel Postgres).
- **Image Storage:** ImageKit Node.js SDK.
- **Payments:** Stripe (untuk global) atau Midtrans (untuk lokal Indonesia).

---

## 📋 Step-by-Step Implementation Guide
*(Pesan untuk Junior Engineer / AI Assistant: Kerjakan langkah-langkah ini secara berurutan. Jangan melompat ke step berikutnya sebelum step sebelumnya di-test dan berhasil).*

### Step 1: Inisialisasi Database & Schema (Prisma)
1. Install Prisma: `npm install prisma --save-dev` dan `npm install @prisma/client`.
2. Inisialisasi: `npx prisma init`.
3. Buat schema di `prisma/schema.prisma` dengan tabel berikut:
   - **`User`**: `id` (String, pk, match dengan Clerk ID), `email`, `credits` (Int, default 15), `createdAt`, `updatedAt`.
   - **`Generation`**: `id`, `userId` (fk ke User), `prompt`, `style`, `imageUrl` (URL dari ImageKit), `createdAt`.
   - **`Transaction`**: `id`, `userId` (fk ke User), `amount` (Int), `creditsAdded` (Int), `status` (PENDING, SUCCESS, FAILED), `createdAt`.
4. Jalankan migrasi: `npx prisma db push` atau `npx prisma migrate dev`.
5. Buat file `lib/prisma.ts` untuk global Prisma Client instance (hindari connection exhaustion di Next.js dev mode).

### Step 2: Sinkronisasi User (Clerk Webhooks)
*Tujuan: Saat user baru mendaftar di Clerk, otomatis buat record-nya di database lokal kita agar bisa diberi saldo awal.*
1. Buat endpoint `app/api/webhooks/clerk/route.ts`.
2. Gunakan `svix` untuk memverifikasi signature webhook.
3. Tangkap event `user.created`.
4. Saat event terjadi, jalankan `prisma.user.create({ data: { id: evt.data.id, email: ..., credits: 15 } })`.

### Step 3: Integrasi ImageKit (Permanent Storage)
*Tujuan: URL gambar dari OpenRouter bersifat sementara. Kita harus menyimpannya di ImageKit kita sendiri.*
1. Install SDK: `npm install imagekit`.
2. Setup ImageKit instance di `lib/imagekit.ts` menggunakan environment variables `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, dan `IMAGEKIT_URL_ENDPOINT`.
3. Buat helper function `uploadImageFromUrl(openRouterUrl)` yang men-download gambar dari OpenRouter dan meng-uploadnya ke ImageKit. Fungsi ini harus me-return URL permanen dari ImageKit.

### Step 4: Refactor `/api/generate` (Credit Logic & DB Save)
*Tujuan: Memastikan user punya kredit, memotong kredit, dan menyimpan hasil generate.*
1. Di `app/api/generate/route.ts`, ambil `userId` menggunakan `auth()` dari `@clerk/nextjs/server`.
2. Query ke database: Cek apakah `User` ada dan `credits >= 5` (asumsi 1 generate = 5 kredit). Jika tidak, kembalikan error `402 Payment Required`.
3. Jika kredit cukup, lakukan call ke OpenRouter (kode ini sudah ada dari Phase 1).
4. Setelah dapat URL dari OpenRouter, panggil fungsi `uploadImageFromUrl()` dari Step 3.
5. Gunakan **Prisma Transaction** untuk memastikan konsistensi data:
   - Kurangi `credits` user sebanyak 5.
   - Buat record baru di tabel `Generation` dengan URL gambar dari ImageKit.
6. Kembalikan URL ImageKit ke frontend.

### Step 5: Update Frontend (`app/studio/page.tsx`)
1. **Fetch History**: Buat endpoint `/api/history` untuk mengambil data tabel `Generation` milik user yang sedang login. Tampilkan di bagian "Recent Generations".
2. **Tampilkan Kredit**: Fetch data kredit user saat ini dan tampilkan di UI (misalnya di header/navbar atau di atas tombol Generate).
3. **Error Handling**: Jika API mengembalikan error `402`, tampilkan modal/toast yang mengarahkan user ke halaman Top-up/Pricing.

### Step 6: Payment Gateway Setup (Stripe / Midtrans)
1. Buat halaman `/pricing` (bisa menggunakan komponen `Pricing.tsx` yang sudah ada).
2. Buat endpoint `/api/checkout` yang akan membuat payment session dan mengembalikan URL checkout.
3. Buat endpoint webhook `/api/webhooks/payment` untuk mendengarkan notifikasi sukses pembayaran.
4. Jika sukses, tambahkan kredit ke `User` dan update status `Transaction` menjadi SUCCESS.

---

## 🛑 Aturan & Batasan Penting (Rules for AI/Dev)
- **Jangan merusak UI Phase 1**: Komponen `ImageUpload`, `StyleSelector`, dan `GenerationDisplay` sudah bagus. Hanya ubah cara data di-fetch/dikirim.
- **Keamanan Webhook**: Webhook wajib diverifikasi (Clerk menggunakan `svix`, Stripe menggunakan crypto signature). Jangan pernah memproses webhook tanpa verifikasi.
- **Prisma Transactions**: Saat memotong saldo dan mencatat history (Step 4), gunakan `$transaction` agar jika salah satu gagal, saldo tidak terpotong sia-sia.
- **Graceful Error Handling**: Jika upload ke ImageKit gagal, pastikan saldo user di-refund atau logic-nya ditangani dengan baik agar user tidak dirugikan.

---
*Dokumen ini dibuat secara khusus agar dapat dieksekusi dengan mudah oleh tim engineering atau asisten AI.*
