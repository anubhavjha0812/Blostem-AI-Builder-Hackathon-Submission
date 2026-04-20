# BuildX — The Outcome-Based Freelancing Platform

## 💡 The Idea
**BuildX** is a revolutionary outcome-based freelancing platform designed to solve the "trust gap" in the gig economy. By shifting the focus from hours logged to **verified outcomes**, BuildX ensures that clients only pay for deliverables that meet their technical standards. 

Using a **Multi-Stage Evaluation Pipeline** and the **Blostem Trust Layer**, BuildX provides:
- **For Clients**: Automated escrow protection and technical validation of every submission.
- **For Freelancers**: Instant credibility building through verifiable history and automated skill scoring.

---

## 🌍 Live Deployment

| Component | URL |
|---|---|
| **Frontend App** | [Live on Vercel](https://blostem-ai-builder-hackathon-submission-rhgq5v2os.vercel.app/) |
| **Backend API** | `https://blostem-ai-builder-hackathon-submission.onrender.com` |
| **API Docs** | [Swagger Documentation](https://blostem-ai-builder-hackathon-submission.onrender.com/api-docs) |

---

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Ready-brightgreen)](https://github.com/)
[![React Version](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Next.js Version](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma Version](https://img.shields.io/badge/Prisma-7-purple)](https://www.prisma.io/)

---

## 🌟 Key Features

### 🛡️ Blostem Trust Layer (Simulated)
- **KYC Verification**: Instant identity validation badges for high-trust users.
- **Escrow Locking**: Project budgets are automatically reserved and locked in a synthetic escrow upon project approval.
- **Payment Capacity Scoring**: Clients are assigned scores (0-100) based on their simulated financial history, visible before freelancers apply.

### 🤖 Rule-Based Evaluation Engine
- **Instant Logic Scoring**: Freelancers receive instant scoring on Stage 1 proposals (Architecture & Plan) via an automated evaluation engine.
- **Milestone Gates**: Transitions from Stage 1 to Stage 2 are secured by Client/Admin shortlisting.

### ⚡ God-Mode Admin Panel
- **Project Governance**: Admins vet projects before they go live to ensure marketplace quality.
- **Conflict Resolution**: Built-in override capability for Admins to handle winner selection disputes.

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
    └── src/context/    # AuthContext & API Client
```

---

## 🔄 Core Workflows

### 🎖️ The Credibility Cycle
1. **Registration**: The **Blostem Simulation Service** assigns users unique trust metrics:
   - **Synthetic Balance**: ₹10,000 - ₹60,000.
   - **KYC Status**: Randomly assigned (Verified/Pending) to test trust-based features.
   - **Capacity Score**: Calculated based on simulated asset liquidity.
2. **Participation**: Every submission is logged in the `ProfileHistory` table.
3. **Winning**: Success increases the `stageReached` metric to level 3 (Winner), significantly boosting public credibility.

### 💰 The Outcome-Based Escrow Flow
1. **Locking**: When a project is approved, the budget is deducted from the Client's synthetic balance.
2. **Shortlisting**: Clients filter Stage 1 candidates to select the top talent for high-stakes execution.
3. **Release**: Choosing a winner automatically transfers the locked escrow funds to the Freelancer's account.

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v18+
- Neon PostgreSQL Connection String

### 2. Backend Setup
```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env   # Update with your DATABASE_URL & JWT_SECRET
npx prisma generate    # Generate Client for Prisma 7
npm run dev            # Runs on port 5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev            # Runs on port 3000
```

---

## 📈 Running the Test Report
```bash
cd backend
npm test
# Open backend/test-report.html in your browser
```

---

*Built with ❤️ for the Blostem AI Builder Hackathon.*
