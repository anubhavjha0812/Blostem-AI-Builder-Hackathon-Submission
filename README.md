# BuildX — The Outcome-Based Freelancing Platform

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Ready-brightgreen)](https://github.com/)
[![React Version](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Next.js Version](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma Version](https://img.shields.io/badge/Prisma-7-purple)](https://www.prisma.io/)

**BuildX** is a cutting-edge, outcome-based freelancing platform designed for the modern gig economy. Unlike traditional platforms, BuildX integrates a **Rule-Based Evaluation Engine** and a **Simulated Financial Trust Layer (Blostem)** to ensure that payments are only released when milestones are met.

---

## 🌟 Key Features

### 🛡️ Blostem Trust Layer (Simulated)
- **KYC Verification**: Instant identity validation badges for high-trust users.
- **Escrow Locking**: Project budgets are automatically deducted and locked in a synthetic escrow upon project approval.
- **Payment Capacity Scoring**: Clients are assigned scores (0-100) based on their simulated financial history, visible to freelancers.

### 🤖 Rule-Based Evaluation Engine
- **Instant Feedback**: Freelancers receive instant scoring on their Stage 1 proposals (Architecture & Plan) via an AI-less rule engine.
- **Multi-Stage Workflow**: Seamlessly transition from "Open" to "Stage 1 Evaluation" to "Stage 2 Final Build".

### ⚡ God-Mode Admin Panel
- **Project Approvals**: Admins must approve new projects before they go live.
- **Winner Overrides**: Built-in safety switch for Admins to override winner selection in case of disputes.
- **User Insights**: Complete oversight of all registered users and their transaction history.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router) + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | Neon PostgreSQL + Prisma 7 ORM |
| **Authentication** | JWT + Secure HTTP-only Cookie Storage |
| **API Documentation** | Swagger UI (OpenAPI 3.0) |
| **Testing** | Jest + Supertest (Integration Suite) |

---

## 📂 Project Architecture

```text
/
├── backend/            # Express.js REST API
│   ├── src/
│   │   ├── index.ts             # Server entry & CORS Config
│   │   ├── routes/              # Modular Router logic
│   │   │   ├── admin.ts         # God-mode endpoints
│   │   │   ├── submissions.ts   # Rule-engine & Multi-stage logic
│   │   └── lib/prisma.ts        # Prisma v7 Singleton with Env Guards
│   ├── prisma/schema.prisma     # Standardized v7 Schema
│   └── tests/                   # Jest Integration Suite
└── frontend/           # Next.js Application
    ├── src/app/        # App Router pages
    │   ├── admin/      # Management Dashboard
    │   ├── dashboard/  # Role-specific user views
    │   └── project/    # Submission & Selection flows
    └── src/context/    # Auth & State management
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- A Neon PostgreSQL Connection String

### 2. Backend Setup
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env   # Update with your DATABASE_URL & JWT_SECRET
npx prisma generate    # Generate Client for Prisma 7
npm run dev            # API runs on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev            # App runs on port 3000
```

---

## 🧪 Testing & Documentation

### API Exploration
Access the interactive Swagger documentation while the backend is running:
👉 `http://localhost:5000/api-docs`

### Running Integration Tests
BuildX comes with a pre-configured Jest suite that mocks Prisma for reliable local testing.
```bash
cd backend
npm test
```
*Outputs a visual report to `backend/test-report.html`.*

---

## 🔄 Core Workflows

### 🎖️ The Credibility Cycle
1. **Registration**: Upon joining, the **Blostem Simulation Service** assigns users unique trust metrics:
   - **Synthetic Balance**: ₹10,000 - ₹60,000.
   - **KYC Status**: Randomly assigned (Verified/Pending) to test trust-based features.
   - **Capacity Score**: Calculated based on simulated asset liquidity.
2. **Participation**: Every submission is logged in the `ProfileHistory` table.
3. **Winning**: Winning a project increases the `stageReached` metric to level 3 (Winner), significantly boosting public credibility.

### 💰 The Outcome-Based Escrow Flow
1. **Locking**: When a Client's project is approved by an **Admin**, the budget is immediately "reserved" (deducted from their synthetic balance).
2. **Shortlisting**: Clients move candidates to Stage 2, filtering for quality.
3. **Execution**: Freelancers submit final builds in the high-stakes Stage 2.
4. **Release**: Choosing a winner automatically transfers the locked escrow funds to the Freelancer's synthetic account balance.

---

## 🏗️ Technical Highlights

- **Prisma v7 Config**: Uses the cutting-edge `datasourceUrl` runtime injection for cloud-native deployment.
- **Zod v4 Validation**: Robust input sanitization for all public endpoints.
- **Role-Based Middlewares**: Granular `authorize(['ADMIN', 'CLIENT'])` gates on every sensitive route.
- **Rule Engine**: Deterministic scoring logic that rewards effort (length), technical understanding (keyword density), and verification (link checks).

---

## 📈 Running the Test Report

To see the stability of the platform, run:
```bash
cd backend
npm test
```
Then open `backend/test-report.html` in your browser for a full breakdown of the 13+ integration tests.

---

## 🌍 Deployment

| Component | Provider | URL |
|---|---|---|
| **Backend** | Render | `https://blostem-ai-builder-hackathon-submission.onrender.com` |
| **API Docs** | Swagger | `.../api-docs` |
| **Frontend** | Vercel | *(Ready for your Vercel Import)* |

---

*Built with ❤️ for the Blostem AI Builder Hackathon.*
