# GHURBO — Pages Build Order

> Work through this list in order, one page at a time.
> Attach the matching JPG export from Stitch when prompting for each page.
> Use mock data for all pages — no real API calls until backend is ready.
> Mark each page [x] done before moving to the next.

---

## Shared Setup (Do This First)

Before building any page, complete these:

- [x] S1. `tailwind.config.js` — add all color tokens from AGENTS.md
- [x] S2. `src/index.css` — import Plus Jakarta Sans + Inter from Google Fonts
- [x] S3. `src/App.jsx` — set up React Router with all routes listed below
- [x] S4. `src/context/AuthContext.jsx` — user state, login/logout functions
- [x] S5. `src/context/BookingContext.jsx` — trip state across booking flow steps
- [x] S6. `src/api/axios.js` — configured Axios instance with base URL + auth header

---

## Group 1 — Entry & Auth

- [x] 01. **Home / Landing Page**
  - Path: `/`
  - File: `src/pages/Home/index.jsx`
  - Components needed: `Navbar`, `SearchWidget`, `BottomNav`
  - Functions: origin/destination inputs, travel date, return date (optional),
    one-way / round-trip toggle, search button, popular destinations section,
    login/register CTA

- [x] 02. **Login Page**
  - Path: `/login`
  - File: `src/pages/Auth/Login.jsx`
  - Functions: email or phone input, password input, login button,
    forgot password link, link to register

- [x] 03. **Register Page**
  - Path: `/register`
  - File: `src/pages/Auth/Register.jsx`
  - Functions: name, email, phone, password, confirm password,
    role selector (Traveler / Partner), register button

---

## Group 2 — Core Booking Flow

- [x] 04. **Search Results Page**
  - Path: `/search`
  - File: `src/pages/Search/index.jsx`
  - Components needed: `TransportCard`, `StepProgressBar`
  - Functions: display outbound route results, filter by price / transport
    type / time, select outbound transport, if round-trip → continue to
    return selection

- [x] 05. **Outbound Transport Selection Page**
  - Path: `/search/outbound`
  - File: `src/pages/Search/OutboundSelect.jsx`
  - Components needed: `TransportCard`
  - Functions: bus / train / ship options, operator name, departure time,
    price, seat availability, select transport button

- [x] 06. **Return Transport Selection Page**
  - Path: `/search/return`
  - File: `src/pages/Search/ReturnSelect.jsx`
  - Components needed: `TransportCard`
  - Functions: same as outbound but destination → origin direction,
    uses return date, transport list, select return transport
  - Note: only shown when trip_type === 'round_trip'
  - Example flow: Moulvibazar → Chittagong (ship) → Saint Martin (hotel)
    → Saint Martin → Chittagong → Moulvibazar

- [x] 06b. **Return Seat Selection Page**
  - Path: `/search/return-seats`
  - File: `src/pages/Search/ReturnSeatSelect.jsx`
  - Components needed: `SeatMap`
  - Functions: select seats for the return journey, select seat type,
    shows return route destination → origin, updates pricing return_transport
    and grand_total, proceed to hotels button

- [x] 07. **Hotel Selection Page**
  - Path: `/hotels`
  - File: `src/pages/Hotels/index.jsx`
  - Components needed: `HotelCard`
  - Functions: hotel list, filter by star category (3★ 4★ 5★), price per
    night, rating, location, select hotel, select stay duration
    (auto-calculated from travel date → return date)

- [x] 08. **Trip Summary Page** ⚠️ Very Important
  - Path: `/booking/summary`
  - File: `src/pages/Booking/TripSummary.jsx`
  - Components needed: `TripSummaryCard`
  - Functions: show outbound transport details, show return transport details
    (if round-trip), show hotel + room + dates + nights, show total cost
    breakdown (forward transport + hotel total + return transport + grand
    total), edit buttons for each section, confirm booking button

- [x] 09. **Payment Page**
  - Path: `/booking/payment`
  - File: `src/pages/Booking/Payment.jsx`
  - Functions: display full cost summary, payment method selector (bKash /
    Nagad / Card), phone number input for mobile wallets, confirm payment
    button, security badge

- [x] 10. **Booking Confirmation Page**
  - Path: `/booking/confirmation`
  - File: `src/pages/Booking/Confirmation.jsx`
  - Components needed: `BookingStatusBadge`
  - Functions: booking reference ID (GHB-XXXX-XXXX), outbound ticket details,
    return ticket details, hotel booking voucher, QR code placeholder,
    download ticket button, go to dashboard button

---

## Group 3 — User Account

- [x] 11. **User Dashboard**
  - Path: `/dashboard`
  - File: `src/pages/User/Dashboard.jsx`
  - Components needed: `BookingStatusBadge`
  - Functions: current / upcoming trips section, past trips section,
    cancel booking option, refund status indicator, profile settings link

- [x] 12. **Booking History Page**
  - Path: `/dashboard/history`
  - File: `src/pages/User/BookingHistory.jsx`
  - Functions: list of all trips, status badge per booking (CONFIRMED /
    CANCELLED / PENDING), view details button, cancel button

- [x] 13. **Cancel / Refund Page**
  - Path: `/dashboard/cancel/:id`
  - File: `src/pages/User/CancelRefund.jsx`
  - Functions: show trip being cancelled, options to cancel outbound only /
    return only / full trip, refund policy info, confirm cancellation button

- [x] 14. **Profile Page**
  - Path: `/profile`
  - File: `src/pages/User/Profile.jsx`
  - Functions: edit name, edit phone, edit email, change password section,
    save changes button

---

## Group 4 — Admin & Partner

- [ ] 15. **Admin Dashboard**
  - Path: `/admin`
  - File: `src/pages/Admin/index.jsx`
  - Functions: manage users table, manage partners table, manage transport
    routes, manage hotels, view revenue reports, approve / reject partner
    applications

- [x] 16a. **Hotel Partner Dashboard**
  - Path: `/partner/hotel`
  - File: `src/pages/Partner/HotelDashboard.jsx`
  - Functions: View rooms, bookings history, active status, add hotel details

- [x] 16b. **Transport Partner Dashboard**
  - Path: `/partner/transport`
  - File: `src/pages/Partner/TransportDashboard.jsx`
  - Functions: View tickets sold, schedule routes, active routes, add operator details

---

## Group 5 — Static

- [x] 17. **About Page**
  - Path: `/about`
  - File: `src/pages/About/index.jsx`
  - Functions: Editorial story of GHURBO, genesis, pillars, and metrics

- [x] 18. **FAQ & Contact Us Page**
  - Path: `/contact`
  - File: `src/pages/Contact/index.jsx`
  - Functions: Interactive accordion support topics, office locations, and inquiries form

---

## Shared Components (build as needed during page work)

- [x] `Navbar.jsx` — glassmorphism floating nav (surface-container-lowest 80% opacity + blur 24px)
- [x] `BottomNav.jsx` — mobile bottom navigation bar
- [x] `SearchWidget.jsx` — origin / destination / dates / trip type / search button
- [x] `TransportCard.jsx` — operator, mode, time, price, seats, select button
- [x] `HotelCard.jsx` — name, location, stars, rating, price/night, amenities, book button
- [x] `TripSummaryCard.jsx` — collapsible summary of one leg or hotel booking
- [x] `StepProgressBar.jsx` — step indicator for booking flow (Search → Hotel → Summary → Payment)
- [x] `SeatMap.jsx` — interactive 2+2 bus seat grid with available / selected / booked states
- [x] `BookingStatusBadge.jsx` — colored pill: CONFIRMED (green) / PENDING (yellow) / CANCELLED (red)

---

## React Router Setup (App.jsx)

```jsx
<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />

  {/* Search & Booking Flow */}
  <Route path="/search" element={<SearchResults />} />
  <Route path="/search/outbound" element={<OutboundSelect />} />
  <Route path="/search/return" element={<ReturnSelect />} />
  <Route path="/search/return-seats" element={<ReturnSeatSelect />} />
  <Route path="/hotels" element={<HotelSelection />} />
  <Route path="/booking/summary" element={<TripSummary />} />
  <Route path="/booking/payment" element={<Payment />} />
  <Route path="/booking/confirmation" element={<Confirmation />} />

  {/* Protected — User */}
  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
  <Route path="/dashboard/history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
  <Route path="/dashboard/cancel/:id" element={<ProtectedRoute><CancelRefund /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

  {/* Protected — Partner */}
  <Route path="/partner/hotel" element={<PartnerRoute type="hotel"><HotelPartnerDashboard /></PartnerRoute>} />
  <Route path="/partner/transport" element={<PartnerRoute type="transport"><TransportPartnerDashboard /></PartnerRoute>} />

  {/* Protected — Admin */}
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
</Routes>
```




