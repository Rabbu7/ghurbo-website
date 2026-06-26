# GHURBO — AI Agent Instructions

> Read this file completely before writing any code.
> Every decision in this file is final unless the developer explicitly overrides it.

---

## 1. Project Overview

**GHURBO** is an integrated domestic tourism and travel management system for Bangladesh.
Users can plan and book complete trips — transport (bus, train, ship/launch), hotel
accommodation, and return journey — in a single unified flow, from any of Bangladesh's
64 districts.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), functional components only |
| Styling | Tailwind CSS — utility classes only, no separate CSS files except globals |
| Routing | React Router v6 |
| HTTP Client | Axios (configured instance at /client/src/api/axios.js) |
| Server State | React Query (@tanstack/react-query) |
| Forms | react-hook-form |
| Dates | dayjs |
| Notifications | react-hot-toast |
| Backend | Node.js + Express.js (REST API) |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcrypt, role-based (user / partner / admin) |
| AI Routing | Google Gemini 2.5 Flash API (free tier) |
| Payment | Simulated bKash / Nagad / Card flow |
| Email | Nodemailer |
| QR Code | qrcode npm package |
| Deployment | Render (backend) + Vercel (frontend) |

---

## 3. Folder Structure

```
ghurbo/
├── AGENTS.md
├── DESIGN.md
├── PAGES.md
│
├── server/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── gemini.js              # Gemini API client
│   ├── models/
│   │   ├── User.js
│   │   ├── Operator.js            # Transport operators & routes
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Partner.js
│   │   └── RouteCache.js          # AI-generated route cache
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
│   │   ├── gemini.service.js      # AI routing logic
│   │   ├── search.service.js      # Route cache + DB matching
│   │   ├── ticket.service.js      # QR + e-ticket generation
│   │   └── email.service.js       # Nodemailer
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT verification
│   │   ├── role.middleware.js     # Role guard (admin / partner)
│   │   └── error.middleware.js    # Global error handler
│   ├── utils/
│   │   ├── generateRef.js         # GHB-YYYY-XXXX booking codes
│   │   └── normalizeCity.js       # City name normalization
│   ├── seed/
│   │   ├── operators.seed.js
│   │   └── hotels.seed.js
│   ├── .env
│   ├── package.json
│   └── index.js
│
└── client/
    ├── public/
    ├── index.html
    ├── tailwind.config.js
    ├── package.json
    └── src/
        ├── api/
        │   ├── axios.js            # Configured Axios instance
        │   ├── auth.api.js
        │   ├── search.api.js
        │   ├── booking.api.js
        │   ├── payment.api.js
        │   ├── hotel.api.js
        │   └── partner.api.js
        ├── components/             # Reusable UI components only
        │   ├── Navbar.jsx
        │   ├── BottomNav.jsx
        │   ├── SearchWidget.jsx
        │   ├── TransportCard.jsx
        │   ├── HotelCard.jsx
        │   ├── TripSummaryCard.jsx
        │   ├── StepProgressBar.jsx
        │   ├── SeatMap.jsx
        │   └── BookingStatusBadge.jsx
        ├── pages/
        │   ├── Home/
        │   ├── Auth/
        │   ├── Search/
        │   ├── Hotels/
        │   ├── Booking/
        │   ├── User/
        │   ├── Admin/
        │   ├── Partner/
        │   ├── About/
        │   └── Contact/
        ├── context/
        │   ├── AuthContext.jsx
        │   └── BookingContext.jsx
        ├── hooks/                  # Custom hooks
        ├── utils/                  # Frontend helpers
        ├── App.jsx
        └── main.jsx
```

---

## 4. Tailwind Color Tokens

Add all of these to `tailwind.config.js` under `theme.extend.colors`.
**Always use these token names — never hardcode hex values in components.**

```js
colors: {
  'primary':                    '#00694d',
  'primary-container':          '#9ef4d0',
  'on-primary':                 '#c7ffe5',
  'surface':                    '#d7fff3',
  'surface-container-lowest':   '#ffffff',
  'surface-container-low':      '#bdfeec',
  'surface-container':          '#b0f6e3',
  'surface-container-high':     '#a5f1dd',
  'surface-container-highest':  '#9aecd7',
  'on-surface':                 '#00362c',
  'on-surface-variant':         '#2d6558',
  'secondary-container':        '#94dffe',
  'on-secondary-container':     '#005065',
  'tertiary':                   '#a23802',
  'outline-variant':            '#80b8a9',
}
```

---

## 5. API Endpoints

**Base URL:** `/api`
All protected routes require `Authorization: Bearer <JWT>` header.

### Auth — `/api/auth`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | /register | public | Register, return JWT |
| POST | /login | public | Login, return JWT + user |
| GET | /me | [auth] | Current user profile |
| POST | /forgot-password | public | Send reset email |
| POST | /reset-password | public | Reset with token |

### Search — `/api/search`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | /route | public | AI routing + DB match + hotels |
| GET | /destinations | public | All supported destinations |

### Bookings — `/api/bookings`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | /create | [auth] | Create booking (PENDING) |
| GET | /my | [auth] | User's booking history |
| GET | /:id | [auth] | Single booking details |
| PATCH | /:id/cancel | [auth] | Cancel a booking |
| GET | /:id/ticket | [auth] | E-ticket + QR |

### Payments — `/api/payments`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | /initiate | [auth] | Start payment |
| POST | /webhook | public | Payment callback (simulated) |
| GET | /:bookingId | [auth] | Payment status |

### Hotels — `/api/hotels`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | / | public | List hotels (filter: city, category) |
| GET | /:id | public | Single hotel details |
| POST | / | [partner] | Add hotel listing |
| PUT | /:id | [partner] | Update hotel listing |

### Partner — `/api/partners`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | /apply | [auth] | Apply for partner account |
| GET | /dashboard | [partner] | Partner stats + bookings |
| POST | /operators | [partner] | Add transport route |
| PUT | /operators/:id | [partner] | Update route |

### Admin — `/api/admin`
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | /users | [admin] | All users |
| GET | /bookings | [admin] | All bookings |
| GET | /analytics | [admin] | Revenue + stats |
| PATCH | /partners/:id/approve | [admin] | Approve partner |

---

## 6. Key Data Shapes (Mock Data Reference)

### Search Response
```json
{
  "forward_legs": [
    {
      "from": "Dhaka",
      "to": "Cox's Bazar",
      "mode": "bus",
      "estimated_hours": 9,
      "operators": [
        {
          "name": "Green Line Paribahan",
          "seat_types": [
            { "type": "AC Sleeper", "price": 850, "available_seats": 12 }
          ],
          "schedules": [{ "departure": "21:00", "arrival": "06:00" }]
        }
      ]
    }
  ],
  "return_legs": [],
  "hotels": [
    {
      "name": "Long Beach Hotel",
      "city": "Cox's Bazar",
      "category": "luxury",
      "rating": 4.8,
      "price_per_night": 3200,
      "amenities": ["pool", "wifi", "restaurant"]
    }
  ],
  "seasonal_notes": null,
  "fully_bookable": true
}
```

### Booking Shape
```json
{
  "ref_code": "GHB-2026-4471",
  "trip_type": "round_trip",
  "forward_legs": [...],
  "hotel": {
    "hotel_name": "Long Beach Hotel",
    "room_type": "Deluxe Sea View",
    "check_in": "2026-03-15",
    "check_out": "2026-03-18",
    "nights": 3,
    "price_per_night": 3200,
    "total_price": 9600
  },
  "return_legs": [...],
  "pricing": {
    "forward_transport": 850,
    "hotel_total": 9600,
    "return_transport": 850,
    "grand_total": 11300
  },
  "status": "CONFIRMED"
}
```

---

## 7. Strict Coding Rules

### Always
- Functional components only — never class components
- Export as `export default` from every page and component file
- Use React Router `<Link>` and `useNavigate` — never `<a href>`
- Wrap all async calls in try/catch
- Use `AuthContext` for user state — never trust client-sent user IDs
- Normalize city names before any DB query (utils/normalizeCity.js)
- Check `RouteCache` before calling Gemini API — never call Gemini if cache exists

### Never
- Never put backend logic in `/client`
- Never put frontend logic in `/server`
- Never use `#000000` — use `on-surface` (`#00362c`)
- Never use 1px solid borders — use background color shifts (DESIGN.md rule)
- Never use class components
- Never hardcode color hex values in JSX — use Tailwind token classes
- Never install new packages without developer approval

---

## 8. Environment Variables

```env
# server/.env
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

---

## 9. Build Phase Roadmap

| Phase | Weeks | Focus | Status |
|---|---|---|---|
| Phase 1 | 1–3 | Folder structure, all Mongoose models, Express setup, Auth API, React scaffold, Auth UI | [x] Completed |
| Phase 2 | 4–6 | Search API (Gemini + cache + DB match), Operator/Hotel seeding, Search + Hotel UI | [x] Completed |
| Phase 3 | 7–9 | Booking engine, Payment simulation, QR + e-ticket, Email confirmation | [x] Completed |
| Phase 4 | 10–12 | Partner portal, Admin dashboard, Deployment | [x] Completed |
