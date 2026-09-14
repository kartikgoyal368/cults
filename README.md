# CULT'S STUDIOS ©

> Luxury Artisan Streetwear E-Commerce Platform

Built with **Next.js 16**, **React 19**, **Prisma ORM**, **PostgreSQL**, **NextAuth.js**, **Razorpay**, and **Cloudinary**.

---

## ⚡ Features

- **Luxury Pure-Black Aesthetic**: Custom typography, glassmorphism, crimson accents (`#ff3b3b`), responsive mobile & desktop layout.
- **Ultra-Smooth Scrolling**: ReactLenis high-sensitivity inertial scrolling.
- **Cloudinary Image CDN**: High-resolution catalog assets optimized and delivered via cloud CDN.
- **Real-Time Cart Drawer**: Slide-over cart drawer with live thumbnail sync, quantity controls, and threshold free-shipping bar.
- **Wishlist & Account Center**: Instant heart toggle, user isolation, and order tracking history with tracking numbers.
- **Multi-Step Checkout Flow**:
  1. **Delivery Address**: Email, phone, recipient name, address, city, state, pin code validation.
  2. **Payment Gateway**: Powered by **Razorpay** with live dynamic UPI QR code, 3D-Secure Cards (Visa, RuPay, Mastercard), Net Banking, and Cash on Delivery (COD).
  3. **Order Confirmation**: Live generated order number and courier AWB tracking.
- **Cryptographic Security**: HMAC-SHA256 signature verification preventing fraudulent orders.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g. Prisma Postgres / Supabase)
- `AUTH_SECRET`: Secret key for NextAuth sessions
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `RAZORPAY_KEY_ID`: Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: Razorpay Key Secret
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Razorpay Key ID for client

### 3. Database Migration
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.
