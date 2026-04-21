# Lambda Studio — Project Schema & Roadmap

> **AI Image Generator** — Upload once, pick a curated style, get a polished restyle.

---

## 🚀 Project Overview

**Lambda Studio** adalah platform AI Image Generator berbasis web yang memungkinkan user mengupload foto dan mengubahnya ke berbagai art style (Storybook 3D, Anime Cel, Clay Render, Pixart, dll.) secara instan. Dibangun dengan stack modern dan arsitektur yang scalable.

**Repository:** [TriYuniawan/lambda-studio](https://github.com/TriYuniawan/lambda-studio)
**Branch Aktif:** `feat/project-schema-and-implementation`

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router + Turbopack) | 16.2.4 |
| **Language** | TypeScript | ^5 |
| **UI Library** | React | ^19.2.5 |
| **Styling** | Tailwind CSS v4 + tw-animate-css | ^4 |
| **Component System** | shadcn/ui + Radix UI | radix-ui ^1.4.3 |
| **Animation** | Framer Motion (motion/react) | ^12.38.0 |
| **Authentication** | Clerk (v7 — `@clerk/nextjs`) | ^7.1.0 |
| **Error Monitoring** | Sentry (`@sentry/nextjs`) | ^10.48.0 |
| **Image CDN** | ImageKit | via env vars |
| **Fonts** | Inter + Plus Jakarta Sans (Google Fonts) | — |
| **Icons** | lucide-react | ^1.8.0 |
| **Utilities** | clsx, tailwind-merge, class-variance-authority | latest |

---

## ✅ Fitur Terimplementasi (Current State)

### 1. Authentication & Authorization
- [x] **Clerk Integration** — `ClerkProvider` wrapping seluruh app di `layout.tsx`
- [x] **Middleware (proxy.ts)** — `clerkMiddleware()` dengan `createRouteMatcher`
- [x] **Protected Route** — `/studio(.*)` dilindungi via `auth.protect()`
- [x] **Conditional UI** — `<Show when="signed-in">` / `<Show when="signed-out">` (Clerk v7 pattern)
- [x] **Sign In / Sign Up / UserButton** — Terintegrasi di Navbar & Hero

### 2. Landing Page Components
- [x] **Navbar** — Responsive navbar dengan logo, navigation links, mobile hamburger drawer, dan Clerk auth buttons
- [x] **Hero Section** — Full-screen video background (via ImageKit CDN), headline, CTA buttons (Get Started / Open Studio), demo preview image
- [x] **Gallery Showcase** — 4-column interactive gallery grid dengan hover animations (Framer Motion), video background overlay
- [x] **How It Works** — 3-step workflow breakdown (Upload → Choose Style → Generate) dengan icons dan featured step highlight
- [x] **Testimonials** — 9 testimonial cards dalam 3 kolom dengan avatar dari Unsplash
- [x] **Pricing Section** — 3-tier pricing cards (Free / Pro / Studio) dengan annual/monthly toggle dan 20% annual discount
- [x] **Footer** — Premium footer dengan 4-column link grid, social media icons, App Store/Play Store CTA buttons

### 3. Routing & Pages
| Route | Status | Deskripsi |
|-------|--------|-----------|
| `/` | ✅ Implemented | Landing page — semua showcase components terassembly |
| `/studio` | ⚠️ Placeholder | Protected workspace area (hanya `<div>Studio</div>`) |
| `/pricing` | ❌ Belum ada | Halaman pricing terpisah (saat ini hanya section di landing) |
| `/style` | ❌ Belum ada | Halaman browse styles |
| `/how-it-works` | ❌ Belum ada | Halaman detail workflow |
| `/privacy` | ❌ Belum ada | Privacy policy |
| `/faq` | ❌ Belum ada | FAQ page |
| `/api/sentry-example-api` | ✅ Implemented | Sentry test endpoint |

### 4. Design System & Assets
- [x] **Dark Mode** — Default dark theme via `html.dark` class
- [x] **Custom CSS** — `globals.css` (6.9KB) + `navbar.css` (6.5KB) dengan design tokens
- [x] **Typography** — Inter (body) + Plus Jakarta Sans (headings) via `next/font/google`
- [x] **Public Assets:**
  - Logo: `logo2.png`, `logo4.png`
  - Gallery: `gallery-1.png` s/d `gallery-4.png`
  - Style Examples: `anime-cel-example.png`, `clay-render-example.png`, `marble-sculpture-example.png`, `pixart-example.png`, `storybook-example.png`, `voxel-block-example.png`
  - Demo: `demo.png`, `demo2.png`
  - Videos: `hero.mp4`, `hero2.mp4`, `hero3.mp4`, `showcase.mp4`
  - Original reference: `original.png`

### 5. Infrastructure & Monitoring
- [x] **Sentry Error Tracking** — Client, server, dan edge configs
- [x] **Sentry Tunnel Route** — `/monitoring` untuk bypass ad-blockers
- [x] **Source Map Upload** — Configured untuk CI
- [x] **ImageKit CDN** — Video assets di-serve via ImageKit (`ik.imagekit.io`)

### 6. Constants & Data Layer
- [x] **Centralized Constants** (`lib/constants.ts`) — Gallery images, testimonials, nav links, footer links, how-it-works steps, featured styles, video sources
- [x] **Type Definitions** — `MarketingTestimonial`, `HowItWorksStep`, `LucideIcon` types
- [x] **MIME Type Validation** — `ACCEPTED_SOURCE_IMAGE_MIME_TYPES` (jpeg, png, webp)

---

## 📁 Directory Structure

```text
lambda-studio/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── sentry-example-api/   # Sentry test endpoint
│   ├── studio/                   # Protected workspace (placeholder)
│   │   └── page.tsx
│   ├── sentry-example-page/      # Sentry test page
│   ├── layout.tsx                # Root layout (ClerkProvider + Navbar)
│   ├── page.tsx                  # Landing page assembly
│   ├── globals.css               # Global styles & design tokens
│   ├── navbar.css                # Navbar-specific styles
│   ├── global-error.tsx          # Global error boundary
│   └── favicon.ico
├── components/                   # React components
│   ├── navbar.tsx                # Responsive navigation bar
│   ├── GalleryShowcaseSection.tsx # Gallery grid with video BG
│   ├── HowItWorks.tsx            # 3-step workflow section
│   ├── Pricing.tsx               # Pricing cards with toggle
│   ├── Testimonials.tsx          # Testimonial columns
│   ├── DemoOne.tsx               # Demo layout component
│   └── ui/                       # shadcn/ui primitives
│       ├── HeroSection.tsx       # Hero with video background
│       ├── button.tsx            # Button with CVA variants
│       ├── card.tsx              # Card component
│       ├── avatar.tsx            # Avatar component
│       ├── footer-2.tsx          # Premium footer
│       ├── app-store-button.tsx  # iOS App Store CTA
│       └── play-store-button.tsx # Google Play CTA
├── lib/
│   ├── constants.ts              # Centralized data & constants
│   └── utils.ts                  # Utility functions (cn)
├── public/                       # Static assets (images, videos, SVGs)
├── proxy.ts                      # Clerk middleware + route protection
├── next.config.ts                # Next.js + Sentry config
├── instrumentation.ts            # Sentry server instrumentation
├── instrumentation-client.ts     # Sentry client instrumentation
├── .env.example                  # Environment variable template
├── package.json
└── tsconfig.json
```

---

## 💰 Strategi Pricing & OpenRouter API (AI Image Generation)

### Estimasi Biaya Modal per Gambar (OpenRouter)

| Model Tier | Model Contoh | Biaya/Gambar | Rupiah (est.) |
|------------|-------------|-------------|---------------|
| **Cepat & Murah** | SDXL, Flux.1 Schnell | $0.003 – $0.01 | Rp 45 – Rp 150 |
| **High-Quality** | Flux.1 Dev, ByteDance Seed | $0.02 – $0.04 | Rp 300 – Rp 600 |
| **Professional** | Flux.1 Pro, DALL-E 3 | $0.05 – $0.08 | Rp 750 – Rp 1.200 |

> **Catatan:** OpenRouter tidak menambahkan markup ke harga provider. Platform fee ~5.5% hanya saat beli kredit.

### Rekomendasi Paket Harga (Target: Indonesia + Global)

#### 🆓 Paket FREE
| Item | Detail |
|------|--------|
| **Harga** | Rp 0 / bulan |
| **Limit** | 3 generations total (sesuai `Pricing.tsx` saat ini) |
| **Model** | SDXL / Flux.1 Schnell (model termurah) |
| **Fitur** | Standard speed, watermarked outputs, community support |
| **Tujuan** | Trial — memberikan *wow factor* agar user upgrade |
| **Biaya kamu** | ~Rp 15 – Rp 450 per user (negligible) |

#### ⚡ Paket PRO — $12/mo ($9.60/mo annual)
| Item | Detail |
|------|--------|
| **Harga** | $12/bulan atau $9.60/bulan (annual) — **Rp 149.000 – Rp 185.000** |
| **Limit** | 100 generations / bulan |
| **Model** | Campuran (Schnell default + Dev untuk high-quality) |
| **Fitur** | Fast processing, high-res downloads, no watermarks, priority support |
| **Biaya kamu** | 100 × $0.02 = ~$2 (Rp 30.000) → **Profit ~Rp 120.000+/user** |

#### 🎬 Paket STUDIO — $27/mo ($21.60/mo annual)
| Item | Detail |
|------|--------|
| **Harga** | $27/bulan atau $21.60/bulan (annual) — **Rp 330.000 – Rp 415.000** |
| **Limit** | 300 generations / bulan |
| **Model** | Semua model termasuk Professional (Flux.1 Pro) |
| **Fitur** | Fastest processing, 4K resolution, commercial usage rights, API access, 24/7 dedicated support |
| **Biaya kamu** | 300 × $0.04 = ~$12 (Rp 185.000) → **Profit ~Rp 145.000+/user** |

### 💡 Sistem Kredit (Rekomendasi Kuat)

Daripada menjual "jumlah gambar", gunakan **sistem kredit** agar lebih fleksibel:

| Paket | Kredit/Bulan | Harga |
|-------|-------------|-------|
| Free | 15 Kredit | Rp 0 |
| Pro | 500 Kredit | Rp 149.000 |
| Studio | 1.500 Kredit | Rp 330.000 |

| Model Quality | Kredit per Generate |
|--------------|-------------------|
| Standar (SDXL/Schnell) | 5 Kredit |
| HD (Flux Dev) | 20 Kredit |
| Pro (Flux Pro/DALL-E 3) | 50 Kredit |

**Keuntungan Sistem Kredit:**
1. **Psikologis** — "500 kredit" terdengar lebih banyak daripada "25 gambar HD"
2. **Proteksi Margin** — Jika harga API naik, cukup naikkan konsumsi kredit tanpa mengubah harga paket
3. **Fleksibilitas** — User bisa mix-and-match model sesuai kebutuhan
4. **Top-up Revenue** — Jual extra kredit (contoh: $5 untuk 250 kredit) sebagai tambahan revenue

### ⚠️ Hal yang Perlu Diperhatikan
- **Payment Gateway Fee** — Stripe (~2.9% + $0.30) atau Midtrans (~3% + Rp 5.000)
- **Kurs USD/IDR** — Monitor kurs karena OpenRouter tagih dalam USD
- **Fair Usage Policy** — Tetapkan rate limit (max 5 concurrent generations) untuk mencegah abuse
- **OpenRouter Dashboard** — Gunakan built-in dashboard untuk track spending per API key

---

## 🚧 Roadmap — Fitur yang Perlu Dibangun

### Phase 1: Core Studio (MVP) — Priority: 🔴 Critical
- [ ] **Studio Workspace UI** — Halaman utama untuk upload, pilih style, dan generate
- [ ] **Image Upload** — Drag-and-drop + file picker (validate MIME types dari `constants.ts`)
- [ ] **Style Selector** — Grid/carousel pilih style (Storybook 3D, Anime Cel, Clay Render, Pixart, dll.)
- [ ] **OpenRouter API Integration** — Backend route handler untuk image generation
- [ ] **Generation Result Display** — Before/after comparison, download button
- [ ] **Generation History** — Riwayat semua hasil generate user

### Phase 2: Backend & Data — Priority: 🟡 High
- [ ] **Database Schema** — User, Generation, Subscription tables (DATABASE_URL sudah di `.env`)
- [ ] **Credit/Usage Tracking** — Middleware untuk track dan enforce credit limits
- [ ] **Payment Integration** — Stripe/Midtrans untuk subscription management
- [ ] **Webhook Handlers** — Stripe/Clerk webhooks untuk sync subscription status
- [ ] **Image Storage** — ImageKit/S3 integration untuk menyimpan generated images

### Phase 3: Halaman Tambahan — Priority: 🟢 Medium
- [ ] **`/pricing`** — Halaman pricing terpisah (full-page version)
- [ ] **`/style`** — Browse & preview semua available styles
- [ ] **`/how-it-works`** — Detail page workflow + video demo
- [ ] **`/privacy`** — Privacy policy page
- [ ] **`/faq`** — FAQ page dengan accordion

### Phase 4: Polish & Scale — Priority: 🔵 Low
- [ ] **Responsive Testing** — Pastikan semua halaman mobile-friendly
- [ ] **SEO Optimization** — Meta tags, Open Graph, structured data
- [ ] **Rate Limiting** — API rate limiting per user/tier
- [ ] **Email Notifications** — Welcome, usage alerts, subscription reminders
- [ ] **Analytics** — User behavior tracking, conversion funnel
- [ ] **Mobile App** — React Native / PWA (App Store & Play Store buttons sudah ada di footer)

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="<your_database_url>"

# ImageKit CDN
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="<your_imagekit_public_key>"
IMAGEKIT_PRIVATE_KEY="<your_imagekit_private_key>"

# Sentry Error Monitoring
SENTRY_AUTH_TOKEN="<your_sentry_auth_token>"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="<your_clerk_publishable_key>"
CLERK_SECRET_KEY="<your_clerk_secret_key>"

# AI Generation (OpenRouter / OpenAI)
OPEN_AI_API_KEY="<your_openai_api_key>"

# TODO: Tambahkan
# OPENROUTER_API_KEY="<your_openrouter_api_key>"
# STRIPE_SECRET_KEY="<your_stripe_secret_key>"
# STRIPE_WEBHOOK_SECRET="<your_stripe_webhook_secret>"
```

---

## 📊 Current Pricing Display vs Recommended

| | Free | Pro | Studio |
|---|---|---|---|
| **Harga di UI saat ini** | $0 | $12/mo | $27/mo |
| **Harga annual di UI** | $0 | $9.60/mo | $21.60/mo |
| **Generations di UI** | 3 total | 100/mo | 300/mo |
| **Rekomendasi (Kredit)** | 15 kredit | 500 kredit | 1.500 kredit |
| **Est. Profit Margin** | — | ~80% | ~55% |

---

*Last updated: 2026-04-21*
