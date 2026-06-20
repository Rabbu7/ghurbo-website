```markdown
# 🌿 GHURBO — Integrated Tourism & Travel Management System

> *The Verdant Curator of Bangladesh*

GHURBO is a full-stack web platform that reimagines domestic travel planning in Bangladesh. It unifies transportation booking (bus, train, ship), hotel reservations, and secure digital payments into a single, AI-powered journey — all wrapped in a high-end editorial design inspired by the lush, riverine beauty of the delta.

Unlike traditional booking engines, GHURBO uses **Google Gemini 2.5 Flash** to intelligently plan multi-leg routes across Bangladesh's 64 districts, then matches those routes against a real inventory of transport operators and hotels. The result is a seamless, end-to-end travel experience — from search to e-ticket with QR code.

---

## ✨ Features

### 🧭 For Travelers
- **AI-Powered Route Planning** — Gemini generates optimal multi-leg routes between any two districts, with seasonal notes and connection city suggestions
- **Smart Route Caching** — 30-day cache layer prevents redundant AI calls for popular routes
- **Multi-Modal Transport** — Book buses, trains, and ships/launches with interactive 2+2 seat maps
- **Round-Trip Support** — Full outbound + return flow with independent seat selection per leg
- **Hotel Booking** — Filter by star rating, city, and amenities; select room types with dynamic pricing
- **Skip-Hotel Option** — "Own Arrangement" flow for travelers who book accommodation separately
- **Real-Time Cost Breakdown** — Transparent pricing across transport + hotel + taxes
- **Simulated Digital Payments** — bKash, Nagad, and Card flows with phone/card validation
- **E-Ticket with QR Code** — Downloadable QR-based tickets for check-in
- **Google Calendar Integration** — One-click "Add to Calendar" for trip dates
- **Booking History & Cancellation** — Full trip management with refund status tracking
- **User Profile** — Edit name, phone, email, and password

### 🏨 For Hotel Partners
- **Dedicated Partner Dashboard** — Real-time stats: rooms available today, occupancy rate, check-ins
- **Revenue Analytics** — 30-day revenue chart, total revenue, average daily rate
- **Recent Bookings Feed** — Live list of guests with status badges (Confirmed / Pending / Cancelled)
- **Partner Application Flow** — Apply for partner status, get approved by admin
- **Hotel Listing Management** — Add and update hotel properties with room types and pricing

### 🚌 For Transport Partners
- **Fleet Overview** — Active routes, next departure with live seat countdown
- **Per-Leg Revenue Tracking** — Revenue attributed correctly even on multi-operator round trips
- **Busiest Route Analytics** — Automatically identifies top-performing routes from real booking data
- **Recent Ticket Sales** — Flattened per-leg view showing exactly which legs of which bookings belong to the partner
- **Revenue Trend Comparison** — Today vs. yesterday with percentage change

### 👑 For Admins
- **Platform-Wide Dashboard** — Total users, bookings, monthly revenue, partner count with 30-day change metrics
- **Partner Approval Queue** — Review and approve pending partner applications
- **Booking Trends Visualization** — 30-day bar chart of booking volume
- **Recent Bookings Table** — Platform-wide view of all transactions

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), functional components only |
| **Styling** | Tailwind CSS — utility classes, custom tonal color tokens |
| **Routing** | React Router v6 with role-based guards |
| **Server State** | TanStack React Query |
| **HTTP Client** | Axios with JWT interceptor |
| **Dates** | dayjs |
| **Notifications** | react-hot-toast |
| **Backend** | Node.js + Express.js (REST API) |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Authentication** | JWT + bcrypt, role-based (user / partner / admin) |
| **AI Routing** | Google Gemini 2.5 Flash API |
| **Email** | Nodemailer |
| **QR Code** | `qrcode` npm package |

---

## 🎨 Design Philosophy: "The Verdant Curator"

GHURBO follows a custom design system that treats the interface like a premium travel magazine rather than a utility app.

- **No 1px Borders** — Depth is achieved through tonal background shifts (`surface` → `surface-container-low` → `surface-container-lowest`)
- **Organic Asymmetry** — Imagery bleeds off-canvas and overlaps containers for 3D depth
- **Glassmorphism Navigation** — Floating navbar with `backdrop-filter: blur(24px)`
- **Tonal Color Palette** — Paddy greens, riverine blues, and sunset ochres extracted from the Bangladeshi landscape
- **Typography Pairing** — Plus Jakarta Sans (headlines) + Inter (body) for editorial authority
- **Tinted Shadows** — All drop shadows use a green-tinted `on-surface` hue for a "natural light" effect

The full specification lives in `DESIGN.md`.

---

## 📁 Repository Structure

```
ghurbo/
├── AGENTS.md                  # AI agent instructions & coding rules
├── DESIGN.md                  # Design system specification
├── PAGES.md                   # Build order for all 17 pages
├── README.md
│
├── server/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── gemini.js          # Gemini API client
│   ├── models/
│   │   ├── User.js
│   │   ├── Operator.js        # Transport operators & routes
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Partner.js
│   │   └── RouteCache.js      # AI-generated route cache
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── search.routes.js
│   │   ├── booking.routes.js
│   │   ├── payment.routes.js
│   │   ├── hotel.routes.js
│   │   ├── partner.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── search.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── hotel.controller.js
│   │   ├── partner.controller.js
│   │   └── admin.controller.js
│   ├── services/
│   │   ├── gemini.service.js  # AI routing logic
│   │   ├── search.service.js  # Route cache + DB matching
│   │   ├── ticket.service.js  # QR + e-ticket generation
│   │   └── email.service.js   # Nodemailer
│   ├── middleware/
│   │   ├── auth.middleware.js # JWT verification
│   │   ├── role.middleware.js # Role guard
│   │   └── error.middleware.js
│   ├── utils/
│   │   ├── generateRef.js     # GHB-YYYY-XXXX booking codes
│   │   └── normalizeCity.js   # City name normalization
│   ├── seed/
│   │   ├── operators.seed.js  # ~40 seeded transport operators
│   │   └── hotels.seed.js     # 21 seeded hotels across 9 cities
│   ├── .env
│   ├── package.json
│   └── index.js
│
└── client/
    ├── public/
    ├── index.html
    ├── tailwind.config.js     # Custom tonal color tokens
    ├── package.json
    └── src/
        ├── api/               # Axios wrappers per domain
        │   ├── axios.js
        │   ├── auth.api.js
        │   ├── search.api.js
        │   ├── booking.api.js
        │   ├── payment.api.js
        │   ├── hotel.api.js
        │   ├── partner.api.js
        │   └── admin.api.js
        ├── components/        # Reusable UI components
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── PartnerRoute.jsx
        │   ├── AdminRoute.jsx
        │   └── PartnerGate.jsx
        ├── pages/
        │   ├── Home/
        │   ├── Auth/          # Login, Register
        │   ├── Search/        # Results, Outbound, Return, Return Seats
        │   ├── Hotels/
        │   ├── Booking/       # Summary, Payment, Confirmation
        │   ├── User/          # Dashboard, History, Cancel, Profile
        │   ├── Partner/       # HotelDashboard, TransportDashboard
        │   ├── Admin/
        │   ├── About/
        │   └── Contact/
        ├── context/
        │   ├── AuthContext.jsx
        │   └── BookingContext.jsx
        ├── App.jsx
        └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key for Gemini

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ghurbo.git
cd ghurbo
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ghurbo
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_key_from_aistudio
EMAIL_USER=ghurbo.noreply@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

Seed the database with transport operators and hotels:
```bash
node seed/operators.seed.js
node seed/hotels.seed.js
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Start the dev server:
```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 🔐 Roles & Access

| Role | Access |
|---|---|
| **User** | Full booking flow, dashboard, profile, booking history |
| **Partner** | Dashboard with real-time stats for their hotels or transport routes |
| **Admin** | Platform-wide analytics, user management, partner approvals |

Admin accounts must be created manually in MongoDB (set `role: "admin"` on a User document) since the public registration API only allows `user` and `partner` roles.

---

## 🧪 Testing the Demo

To see the full partner dashboard experience:

1. Register a partner account (select "Partner" → "Hotel Partner" or "Transport Partner")
2. In MongoDB Atlas, set `is_approved: true` on the new Partner document
3. Link a seeded hotel or operator to this partner by setting its `partner_id` to the Partner's `_id`
4. Log in as the partner — you'll be redirected to their dashboard
5. As a separate traveler account, complete a booking for that hotel/route
6. Watch the partner dashboard update in real time

---

## 📄 License

This project was developed as a semester project and is intended for educational purposes.

---

<p align="center">
  <em>Built with care for the verdant beauty of Bangladesh.</em>
</p>
```