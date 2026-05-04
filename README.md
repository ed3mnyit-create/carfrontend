# C4R Platform - Frontend

The modern, responsive frontend for the **C4R Car Rental Platform**, designed for premium user experiences and robust administrative controls.

## 🚀 Features
- **User Booking Flow:** Seamless booking experience with tiered pricing, conditional document upload, and interactive calendar.
- **Car with Driver Support:** Specialized booking flow for hourly or daily rentals featuring automated driver cost calculations.
- **Admin Dashboard:** Comprehensive control panel for managing Cars, Bookings, Promos, Blogs, Users, and SEO Settings. Pagination and robust error handling included.
- **Localization:** Full Dual-Language support (Arabic & English) via `react-i18next`.
- **Performance & SEO:** Server-Side Rendering (SSR) capabilities powered by Next.js App Router, dynamic JSON-LD generation, and metadata optimization.

## 🛠️ Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** (Styling)
- **Material-UI (MUI)** (Dashboard Components)
- **React Query** (Server State Management)
- **Axios** (API Requests)

## 📦 Installation & Setup

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run the Application:**
   ```bash
   # Development Mode
   npm run dev

   # Build for Production
   npm run build
   npm start
   ```

## 🌐 Project Structure
- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI elements (Navbar, Footer, Modals).
- `/services`: API interaction layers (`api.js`).
- `/public/locales`: Arabic and English JSON translation files.

## 🚢 Deployment
Optimized for zero-config deployment on Vercel.
