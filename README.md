# Personal Finance Visualizer

A modern, responsive personal finance tracking web application built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

Track your expenses, manage budgets, and get clear visual insights into your spending habits.

---

## 🚀 Project Structure

```
/finance-visualizer
  /frontend   → Frontend code (Next.js, React, shadcn/ui)
  /backend    → Backend API (Next.js API routes, MongoDB, Mongoose)
```

---

## 📦 Tech Stack

- Frontend: Next.js 14 (App Router) + React + shadcn/ui + Recharts + Tailwind CSS
- Backend: Next.js API Routes + MongoDB (Atlas) + Mongoose
- Forms: react-hook-form + zod
- Charts: Recharts
- Animations: Framer Motion
- Styling: Tailwind CSS

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/finance-visualizer.git
cd finance-visualizer
```

---

### 2. Install and run Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend will run on: `http://localhost:8080/`

---

### 3. Install and run Backend

```bash
cd backend
npm install
npm run dev
```

- Backend API will run on: `http://localhost:3000` (or configured port)

---

### 4. Environment Variables

Create a `.env.local` file in both `frontend/` and `backend/` folders.

#### For Frontend (`frontend/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### For Backend (`backend/.env.local`):

```bash
MONGODB_URI=your_mongodb_connection_string
```

---

## ✨ Features

- Add, edit, delete transactions
- View transaction list (modern cards or table)
- Monthly expenses bar chart
- Category-wise expense pie chart
- Budget setting and tracking
- Budget vs actual spending comparison
- Simple smart spending insights
- Fully responsive design
- Clean and professional UI/UX
- Form validation (client and server side)
- Error handling, loading states, and empty states

---
