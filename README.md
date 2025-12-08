# Onyx - Advanced Habit Tracker 🚀

![Onyx Banner](docs/images/banner.png)
*(Recommended: Add a banner image here)*

**Live Demo:** [https://your-vercel-frontend-url.app](https://your-vercel-frontend-url.app)
**Backend API:** [https://onyx-production-8a8f.up.railway.app](https://onyx-production-8a8f.up.railway.app)

## 📌 Overview

Onyx is a premium, full-stack habit tracking application designed to help users "Stay Locked In". It goes beyond simple checkboxes by integrating with your digital life—tracking music (Spotify), productivity (Notion), and social commitments.

Built with a focus on **User Experience**, **Robust Architecture**, and **Modern Design**, Onyx features a dark-mode aesthetic, real-time updates, and seamless third-party integrations.

## ✨ Features

-   **Core Habit Tracking**: Create, update, and delete habits with streak tracking.
-   **Smart Integrations**:
    -   🟢 **Spotify**: Track listening habits automatically.
    -   ⚪ **Notion**: Sync productivity goals.
-   **Email Reminders**: Automated notifications via Brevo for missed habits (Bonus Feature).
-   **Authentication**: Secure JWT-based auth with encrypted passwords.
-   **Responsive Design**: Mobile-first UI tailored for all devices.
-   **Containerized**: Fully Dockerized backend for easy deployment.

## 🛠️ Technology Stack

| Component | Tech |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase/Railway), Prisma ORM |
| **Integrations** | Spotify Web API, Notion API, Brevo (Email) |
| **DevOps** | Docker, Railway (Backend), Vercel (Frontend) |




## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL
-   Spotify/Notion Developer Credentials

### 1. Clone the Repository

```bash
git clone https://github.com/Hardik180704/habit-tracker-exp.club-.git
cd habit-tracker-exp.club-
```

### 2. Environment Setup

Create `.env` files in both `backend` and `frontend` directories based on the `.env.example` files provided.

**Backend (`backend/.env`):**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/habit_tracker"
JWT_SECRET="super_secret"
PORT=5001
# ... Add Client IDs and Secrets for Spotify/Notion/Brevo
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL="http://localhost:5001/api"
```

### 3. Run Locally

**Backend:**
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 🐳 Docker Setup

To run the backend in a container:

```bash
docker build -t onyx-backend .
docker run -p 5001:5001 --env-file backend/.env onyx-backend
```

## 🧪 Deployment

This project is deployed using a modern CI/CD pipeline:
-   **Frontend**: Hosted on Vercel (Auto-deploy on push)
-   **Backend**: Containerized and hosted on Railway (Auto-deploy via Dockerfile)

## 📄 Documentation

For a detailed breakdown of the architectural decisions, challenges faced, and problem-solving approach, please refer to [PROJECT_REPORT.md](./PROJECT_REPORT.md).

---
*Internship Assignment - 2025*
