# Free Fly & Tourism — Munnar Early Bird Landing Page

A standalone promotional enquiry page (separate from the main tourism site) for the
current Munnar early-bird offer. React + Tailwind frontend, FastAPI + MongoDB backend.

```
free-fly-tourism/
├── backend/     FastAPI app (enquiries API)
└── frontend/    React + Tailwind landing page
```

## 1. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then edit .env with your real MongoDB URI
uvicorn app.main:app --reload --port 8000
```

- API base: `http://localhost:8000`
- Health check: `GET /api/health`
- Enquiry endpoint: `POST /api/enquiries`

Nothing is hardcoded — `MONGO_URI`, `MONGO_DB_NAME`, and `CORS_ORIGINS` all come from
`.env` (see `backend/app/config.py`).

## 2. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env            # set VITE_API_BASE_URL to your backend URL
npm run dev
```

- Runs at `http://localhost:3000` by default.
- `src/api/enquiries.js` reads `VITE_API_BASE_URL` and calls `POST /api/enquiries`.

## 3. Updating the offer later

Everything about the current offer lives in one file:
`frontend/src/config/offer.js` — destination, prices, total seats, and the
countdown end time (`offerEndsAt`). **`offerEndsAt` here must always match
`EARLY_BIRD_OFFER_ENDS_AT` in `backend/app/models.py`** — the backend is the
source of truth for whether Early Bird pricing still applies; the frontend
value is only used for display and to build the fixed countdown, which is a
hard deadline (not a rolling window) and does not reset on page refresh.

Seats booked/remaining are **not** configured here — they come live from
`GET /api/enquiries/early-bird`, backed by MongoDB (see section 5).

## 4. Hero background image

The hero section currently links to a stock Unsplash tea-garden photo as a
placeholder. Swap the `backgroundImage` URL in
`frontend/src/components/Hero.jsx` for your own licensed photo before going live.

## 5. Admin Enquiries page

Available at `/admin` (e.g. `http://localhost:3000/admin`) — now behind a login
at `/admin/login`. See section 9 for the auth setup.

It shows every enquiry in a table (name, phone, destination, travel date,
travellers, offer type, price, status, actions) with:
- A **status dropdown** per row (Pending / Contacted / Confirmed / Booked /
  Cancelled) that calls `PATCH /api/enquiries/{id}` on change.
- **View Details**, **WhatsApp**, and **Call** buttons per row.
- Three **Early Bird availability** cards at the top: Total, Booked, Remaining
  — sourced live from `GET /api/enquiries/early-bird`, the same endpoint the
  customer landing page reads, so the two pages never disagree.
- The same fixed countdown shown on the customer page.
- A **Notifications** bell with an unread badge — one notification is created
  automatically whenever a customer submits the enquiry form.

### Early Bird logic (important)

The Munnar Early Bird offer is capped at the first **15 CONFIRMED** bookings —
not the first 15 enquiries, and not total trip capacity. A new enquiry always
starts as `Pending`; it is never automatically counted as a booking.

Only when an admin sets an enquiry's status to `Confirmed / Booked` does the
backend decide its price:
- If it's the 1st–15th enquiry ever confirmed for Munnar, **and** the
  countdown hasn't expired → **₹2,699** (Early Bird)
- From the 16th confirmed Munnar booking onwards, **or** once the countdown
  has expired (whichever comes first) → **₹2,999** (Regular)

That decision is made once, at the moment of confirmation, and stored on the
enquiry (`offer_type`, `price`) so it doesn't change retroactively. The "Early
Bird Booked" / "Early Bird Remaining" counts are always a live count of
currently-confirmed Early Bird bookings, so cancelling a confirmed Early Bird
booking frees that seat back up for the next customer.

This logic lives in `backend/app/routes/enquiries.py` and the constants in
`backend/app/models.py` (`EARLY_BIRD_SEAT_LIMIT`, `EARLY_BIRD_PRICE`,
`REGULAR_PRICE`, `EARLY_BIRD_OFFER_ENDS_AT`) if you need to tune it later.

### Duplicate confirmed booking protection

If a customer already has a `Confirmed / Booked` enquiry for the same
destination (matched on phone number, case/whitespace-insensitive), submitting
the enquiry form again for that destination returns **HTTP 409** and does not
create a second enquiry. `Pending` or `Contacted` enquiries never trigger
this — only a locked-in booking does. This is enforced entirely server-side
in `_find_existing_confirmed_booking` (`backend/app/routes/enquiries.py`), so
it can't be bypassed by calling the API directly.

## 6. What's intentionally NOT included

Per the brief, this build has no payments, a full dashboard, reports, or
employee management — just the promotional page, the enquiry-collection API,
a simple admin list view with basic auth, and simple new-enquiry notifications.

## 7. MongoDB document shape

Each enquiry is saved as:

```json
{
  "name": "string",
  "phone": "string",
  "email": "string | null",
  "destination": "string",
  "travel_date_from": "date",
  "travel_date_to": "date",
  "travellers": "number",
  "trip_type": "string",
  "message": "string | null",
  "created_at": "datetime (UTC, auto-set)",
  "status": "Pending | Contacted | Confirmed / Booked | Cancelled",
  "offer_type": "Early Bird | Regular | null (until confirmed)",
  "price": "number | null (until confirmed)"
}
```

Each notification is saved as:

```json
{
  "enquiry_id": "string",
  "message": "string, e.g. 'New enquiry received from Ashok'",
  "customer_name": "string",
  "destination": "string",
  "created_at": "datetime (UTC, auto-set)",
  "read": "boolean"
}
```

## 8. API summary

| Method | Path                          | Auth        | Purpose                                       |
|--------|-------------------------------|-------------|------------------------------------------------|
| POST   | `/api/enquiries`               | Public      | Customer submits the enquiry form (409 if a confirmed booking already exists) |
| GET    | `/api/enquiries/early-bird`    | Public      | Live Early Bird availability + pricing + countdown, used by both pages |
| GET    | `/api/enquiries`               | Admin (JWT) | List all enquiries + early-bird stats           |
| PATCH  | `/api/enquiries/{id}`          | Admin (JWT) | Update an enquiry's status (assigns price on first confirmation) |
| POST   | `/api/auth/login`              | Public      | Admin login - returns a bearer token            |
| GET    | `/api/notifications`           | Admin (JWT) | List new-enquiry notifications, newest first    |
| PATCH  | `/api/notifications/{id}/read` | Admin (JWT) | Mark one notification as read                   |
| GET    | `/api/health`                  | Public      | Health check                                    |

## 9. Admin authentication

Simple, single-account, environment-variable based auth — no user table.

**Backend setup** (`backend/.env`):

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<a real password - never commit this>
ADMIN_SECRET_KEY=<random secret - generate with the command below>
ADMIN_TOKEN_EXPIRE_MINUTES=480
```

Generate a secret key:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

The backend refuses admin requests with a clear 500 message if
`ADMIN_PASSWORD` or `ADMIN_SECRET_KEY` are left unset — it will not fall back
to a default password.

**How it works:** `POST /api/auth/login` checks the submitted username/password
against the env vars (constant-time comparison) and returns a signed JWT
(HS256, `backend/app/auth.py`). The frontend stores that token in
`localStorage` (`frontend/src/api/client.js`) and sends it as
`Authorization: Bearer <token>` on every admin API call. The
`require_admin` FastAPI dependency validates the token on each protected
route and returns 401 if it's missing, invalid, or expired. On the frontend,
`ProtectedRoute` (`frontend/src/components/ProtectedRoute.jsx`) redirects to
`/admin/login` if no token is stored, and any 401/403 response from an admin
API call also redirects there and clears the stored token. Logout simply
clears the token.

The admin credentials/secret are never sent to or bundled into the React
frontend — they only ever live in the backend's environment.

## 10. Notifications

A simple `notifications` collection: one document per new enquiry. Created
automatically inside `POST /api/enquiries` right after the enquiry is saved,
so it never depends on frontend behaviour. The admin page's notification bell
badge shows the unread count and lets the admin mark individual notifications
as read.
