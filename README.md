# ZenPotion — Natural Beverage Landing Page

A modern, animated landing page for a premium natural beverage brand targeting the Indian market. Built with **Next.js 14 App Router**, TypeScript, Tailwind CSS, Framer Motion, and a PostgreSQL + Prisma backend for lead capture. Includes an interactive **Juice Runner game** for engagement and product recommendation.

---

## ✨ Features

- **Hero Section** — Floating bottle animation with mouse-parallax orbs and headline CTA
- **3-Layer Parallax Scroll** — Framer Motion scroll-triggered parallax with ingredient emoji floats
- **Ingredients Section** — Animated cards (Coconut Water, Lemon, Mint, Tulsi) with fade+slide
- **Benefits Section** — Dark-themed icon cards with hover micro-interactions
- **Social Proof** — Testimonials, city tags, launch stats (India-focused)
- **CTA / Waitlist Form** — Name + Phone + Email → API → PostgreSQL via Prisma
- **Responsive Navbar** — Transparent → frosted glass on scroll, mobile hamburger
- **Juice Runner Game** — Chrome Dino–style endless runner; collect ingredients, avoid sugar, unlock product recommendation
- **SEO-ready** — Metadata, Open Graph, fast font loading
- **Performance** — Framer Motion lazy animations, `viewport: { once: true }` throughout

---

## 🎮 Juice Runner Game

An interactive canvas-based endless runner embedded in the landing page. Powered by real game-physics — no external game engine.

### Gameplay
| Action | Control |
|--------|---------|
| Jump | Space / ↑ Arrow / Tap / Click |
| High jump | Hold the jump key during ascent |

### Mechanics
- **Collect** 🍊 Orange · 🌱 Ginger · 💚 Amla to fill the juice meter
- **Avoid** 🍬 Sugar · 🍕 Junk Food · 🥤 Soda (3 lives)
- Collect **15 ingredients** to win → reveals your ZenPotion product match
- Speed increases gradually at score milestones (not continuously)

### Physics systems implemented
| System | Description |
|--------|-------------|
| Asymmetric gravity | Light gravity on ascent, heavy on descent — snappy, game-feel jumps |
| Variable jump height | Hold jump key for a higher arc; tap for a quick dodge |
| Jump buffer | 10-frame input buffer — jump queues if pressed just before landing |
| Terminal velocity | Fall speed is capped — no rocket drops |
| Squash/stretch spring | Physics-based deformation on land/takeoff; volume-preserving |
| Screen shake | Magnitude-decay shake on obstacle hits |
| Particle system | Burst particles on ingredient pickup, dust trail while running, hit sparks |
| Distance-based spawning | Obstacles spawn by pixel gap (not frame count) — difficulty stays consistent at all speeds |
| Score-based speed stages | Speed increases at 8 discrete score milestones, not per-frame |
| Parallax clouds | 5 cloud layers at independent speeds — clear depth perception |

### Conversion flow
After the game ends, the dominant collected ingredient maps to a product recommendation:

| Ingredient | Product |
|------------|---------|
| 🍊 Orange | ZenPotion Citrus Burst |
| 🌱 Ginger | ZenPotion Ginger Zing |
| 💚 Amla | ZenPotion Amla Shield |
| (default) | ZenPotion Original |

---

## 🗂 Project Structure

```
zenpotion-next/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, metadata
│   ├── page.tsx                      # Assembles all sections
│   ├── globals.css                   # Tailwind base + CSS variables
│   ├── components/
│   │   ├── Navbar.tsx                # Sticky frosted navbar
│   │   ├── Hero.tsx                  # Hero with floating bottle + mouse parallax
│   │   ├── ParallaxSection.tsx       # 3-layer scroll parallax
│   │   ├── Ingredients.tsx           # Ingredient cards
│   │   ├── Benefits.tsx              # Benefits grid (dark bg)
│   │   ├── SocialProof.tsx           # Testimonials + launch banner
│   │   ├── CTA.tsx                   # Waitlist form + success state
│   │   ├── Footer.tsx                # Footer with links
│   │   ├── GameSection.tsx           # Game state controller (idle/playing/finished)
│   │   └── game/
│   │       ├── GameCanvas.tsx        # Canvas renderer + RAF game loop
│   │       ├── GameHUD.tsx           # Score / juice meter / lives overlay
│   │       ├── ResultOverlay.tsx     # Post-game product recommendation card
│   │       ├── Player.ts             # PlayerState type + factory
│   │       ├── Physics.ts            # All physics constants + helper functions
│   │       ├── Obstacles.ts          # Obstacle types, spawning, movement
│   │       └── Ingredients.ts        # Ingredient types, spawning, movement
│   ├── hooks/
│   │   ├── useGameLoop.ts            # requestAnimationFrame loop hook
│   │   └── useCollision.ts           # AABB collision detection hook
│   ├── utils/
│   │   └── gameHelpers.ts            # Product mapping, juice meter calc
│   ├── api/
│   │   └── lead/
│   │       └── route.ts              # POST /api/lead — saves to DB
│   └── lib/
│       └── prisma.ts                 # Singleton Prisma client
├── prisma/
│   ├── schema.prisma                 # Lead, Product, Order, OrderItem models
│   └── seed.ts                       # Seeds 3 sample products
├── CLAUDE.md                         # Architecture analysis + integration notes
├── .env.example                      # Copy → .env
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.17 |
| npm / pnpm / yarn | latest |
| PostgreSQL | ≥ 14 (local or cloud) |

---

### 1. Clone & Install

```bash
git clone https://github.com/Innzout-Technologies/zenpotion-next.git
cd zenpotion-next
npm install
```

---

### 2. Environment Setup

```bash
cp .env.example .env
```

Open `.env` and set your database URL:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/zenpotion"

# OR Supabase (free tier works great)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# OR Neon (serverless, free tier)
DATABASE_URL="postgresql://[user]:[password]@[host]/zenpotion?sslmode=require"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 3. Database Setup

```bash
# Option A — push schema directly (development / prototyping)
npm run db:push

# Option B — proper migrations (recommended for production)
npm run db:migrate

# Generate Prisma client after schema changes
npm run db:generate

# Optional: seed with sample product data
npm run db:seed

# Open Prisma Studio to browse data visually
npm run db:studio
```

---

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Reference

### `POST /api/lead`

Captures a waitlist signup and persists it to the database.

**Request Body**
```json
{
  "name": "Arjun Sharma",       // required, min 2 chars
  "email": "arjun@email.com",   // optional (email or phone required)
  "phone": "9876543210"         // optional (email or phone required)
}
```

**Responses**

| Status | Meaning |
|--------|---------|
| `201` | Lead created successfully |
| `200` | Email already registered (idempotent) |
| `400` | Validation error (missing name, invalid email, etc.) |
| `500` | Internal server error |

**Success (201)**
```json
{
  "success": true,
  "message": "You're on the list! Early access coming soon.",
  "id": "clxyz123abc"
}
```

---

## 🗄 Database Schema

```prisma
model Lead {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  price       Float
  slug        String      @unique
  description String?
  imageUrl    String?
  inStock     Boolean     @default(false)
  createdAt   DateTime    @default(now())
  orders      OrderItem[]
}

model Order {
  id        String      @id @default(cuid())
  status    String      @default("pending")
  total     Float       @default(0)
  leadId    String?
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int     @default(1)
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `brand-dark` | `#1a2e1a` | Primary text, CTA buttons, navbar |
| `brand-mid` | `#5a7a4e` | Accents, labels, hover states |
| `brand-light` | `#a8d5a2` | Highlights on dark backgrounds |
| `cream` | `#f8f5ef` | Page background |

### Typography

| Font | Usage |
|------|-------|
| Playfair Display (700–900) | All headings |
| DM Sans (300–700) | Body, labels, UI text |

### Animation Principles

- **Stagger children** — section headers animate in with `staggerChildren: 0.12–0.18`
- **Fade + slide up** — universal entrance: `opacity 0→1`, `y 40→0`, 700ms, custom ease `[0.22, 1, 0.36, 1]`
- **Hover lift** — interactive cards: `y -8px`, 300ms
- **Parallax layers** — 3 speeds: background 30%, mid -20%, foreground -40% of scroll progress
- **Floating bottle** — continuous `y: [0, -20, 0]` + `rotate: [-2, 2, -2]`, 5s loop

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set `DATABASE_URL` in **Vercel Dashboard → Settings → Environment Variables**.

### Docker (Self-hosted)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/zenpotion
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: zenpotion
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

```bash
docker compose up --build
```

---

## 🗺 Roadmap

| Phase | Feature | Status |
|-------|---------|--------|
| **1** | Landing page + waitlist | ✅ Done |
| **1** | Juice Runner game + product recommendation | ✅ Done |
| **2** | Product catalog page (`/products`) | Prisma model ready |
| **2** | Shopping cart | Zustand + localStorage |
| **3** | Checkout flow | Razorpay / PayU integration |
| **3** | Order management | `Order` + `OrderItem` models scaffolded |
| **4** | Admin dashboard | Leads, orders, inventory |
| **4** | Email notifications | Resend / Nodemailer |
| **5** | Auth | NextAuth.js — Google / phone OTP |
| **5** | Analytics | PostHog or Mixpanel |

---

## 🛠 Commands

```bash
npm run dev           # Dev server on :3000
npm run build         # Production build
npm run start         # Production server
npm run lint          # ESLint

npm run db:push       # Push schema to DB (no migration history)
npm run db:migrate    # Create + run migration
npm run db:generate   # Regenerate Prisma client
npm run db:seed       # Seed sample products
npm run db:studio     # Open Prisma Studio GUI
npm run db:reset      # ⚠️ Drop & recreate DB (dev only)
```

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.2.5 | App Router framework |
| `framer-motion` | ^11.3 | Animations, parallax, transitions |
| `tailwindcss` | ^3.4.6 | Utility-first styling |
| `@prisma/client` | ^5.14 | Type-safe DB ORM |
| `typescript` | ^5.5 | Type safety |

---

## 📝 Content Customization

| What to change | Where |
|----------------|-------|
| Brand name | All component files — `"ZenPotion"` |
| Hero headline | `app/components/Hero.tsx` |
| Ingredient data | `app/components/Ingredients.tsx` → `ingredients` array |
| Benefit cards | `app/components/Benefits.tsx` → `benefits` array |
| Testimonials | `app/components/SocialProof.tsx` → `testimonials` array |
| Color palette | `tailwind.config.ts` + `app/globals.css` |
| Game products | `app/utils/gameHelpers.ts` → `PRODUCT_MAP` |
| Game speed/difficulty | `app/components/game/Physics.ts` → `SPEED_STAGES` |

---

## 📄 License

MIT — use freely for commercial and personal projects.

---

*Built with 💚 for India's next premium beverage brand.*
