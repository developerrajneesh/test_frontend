# Frontend (`test_frontend`)

React + Vite frontend for the assessment app.

---

## Project setup instructions

### Option A: Run as a standalone repository

```bash
git clone https://github.com/developerrajneesh/test_frontend.git
cd test_frontend
npm install
npm run dev
```

> Note: The `.env` file is already included in the `test_frontend` repository.

### Option B: Run from the monorepo

```bash
cd test_frontend
npm install
npm run dev
```

---

## Environment variable configuration

The frontend reads environment variables via Vite.

Required (for auth):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Required (to call backend APIs):

- `VITE_API_URL` (example: `http://localhost:3001`)

---

## Supabase usage explanation (frontend)

The frontend uses Supabase Auth (email/password):

- Creates a Supabase client from `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Manages session state in `AuthContext`
- Adds `Authorization: Bearer <access_token>` to requests made via the shared axios instance

---

