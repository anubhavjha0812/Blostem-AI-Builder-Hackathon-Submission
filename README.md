# BuildX — Outcome-Based Freelancing Platform

A hackathon-ready, full-stack freelancing platform with multi-stage evaluation, simulated escrow payments (Blostem), and role-based access control.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 15 (App Router) + Tailwind CSS |
| Backend    | Node.js + Express + TypeScript    |
| Database   | Neon PostgreSQL (via Prisma 7)    |
| Auth       | JWT + bcrypt                      |
| Validation | Zod v4                            |
| API Docs   | Swagger UI (`/api-docs`)          |
| Testing    | Jest + Supertest                  |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
/
├── backend/         # Express API + Prisma ORM
│   ├── src/
│   │   ├── index.ts          # App entry point
│   │   ├── middleware/auth.ts # JWT + RBAC
│   │   ├── routes/
│   │   │   ├── auth.ts       # Register / Login
│   │   │   ├── projects.ts   # Project CRUD + escrow
│   │   │   ├── submissions.ts # Submit MVP + scoring
│   │   │   ├── profile.ts    # User profile
│   │   │   └── admin.ts      # Admin god-mode routes
│   │   └── lib/prisma.ts     # Prisma client
│   ├── prisma/schema.prisma  # DB schema
│   ├── swagger.yaml          # OpenAPI spec
│   ├── tests/                # Jest unit tests
│   └── jest.config.js
└── frontend/        # Next.js App Router
    └── src/
        ├── app/
        │   ├── page.tsx         # Landing page
        │   ├── dashboard/       # Role-based dashboard
        │   ├── login/           # Auth pages
        │   ├── register/
        │   ├── project/[id]/    # Project detail + submit
        │   ├── project/new/     # Create project (Client)
        │   ├── profile/         # Freelancer credibility
        │   └── admin/           # Admin god mode panel
        ├── components/Navbar.tsx
        ├── context/AuthContext.tsx
        └── lib/api.ts           # API client
```

---

## Getting Started

### 1. Clone & Setup Backend

```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env   # add your DATABASE_URL and JWT_SECRET
npx prisma db push
npm run dev            # runs on http://localhost:5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local  # add NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev            # runs on http://localhost:3000
```

---

## User Flows

### Admin
1. Register with role `ADMIN`
2. Access `/admin` for full god-mode: approve projects, view all users, override winners

### Client
1. Register with role `CLIENT`
2. Create a project — simulated escrow locks budget from account
3. Project goes to ADMIN for approval → status: `OPEN`
4. Review Stage 1 submissions, shortlist users → status: `STAGE_2_OPEN`
5. Select winner — simulated payment released

### Freelancer
1. Register with role `FREELANCER`
2. Browse open projects at `/dashboard`
3. Submit MVP Link + Architecture + Execution Plan
4. Rule-engine scores submission (0–100) and provides instant feedback
5. If shortlisted, return for Stage 2
6. View full history and credibility at `/profile`

---

## API Documentation

When the backend is running:
```
http://localhost:5000/api-docs
```

---

## Running Tests & Generating Report

```bash
cd backend
npm install --legacy-peer-deps
npm test
```

Opens `test-report.html` in `/backend` with a full HTML summary.

---

## Blostem Escrow Simulation

- On Client registration: random `account_balance` (₹10k–₹60k), `kyc_verified`, `payment_capacity_score` are assigned
- On project creation: budget is deducted from Client's simulated balance — **Escrow Locked** ✓
- On winner selection: budget is transferred to the winner's account — **Payment Released** ✓

---

## Deployment

### Backend → Render
- Build Command: `npm install --legacy-peer-deps && npm run build`
- Start Command: `npm start`
- Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend → Vercel
- Framework: Next.js (auto-detected)
- Environment Variable: `NEXT_PUBLIC_API_URL` (your Render backend URL)
