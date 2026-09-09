# 💰 Expense Tracker Pro — Full Stack MERN Application

A full-featured, modern financial management dashboard and expense tracker built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), **Chart.js**, **Styled-Components**, and **JWT Authentication**.

---

## 🌟 Key Features

- 🔐 **Secure JWT Authentication**: User registration and login with encrypted passwords using `bcryptjs` and stateless JWT tokens.
- 🛡️ **Multi-User Data Isolation**: Completely isolated financial records for each registered user on MongoDB Atlas.
- 📊 **Interactive Chart.js Analytics**: Smooth Income vs. Expense cash flow trend line chart & Category breakdown Doughnut chart.
- ⚡ **Quick Add Transactions**: Log income or expenses in 1-click directly from the Dashboard.
- 🎯 **Monthly Budget Goal Tracker**: Set monthly spending targets, track burn rates, and receive dynamic visual progress alerts (persisted in `localStorage`).
- 🗓️ **Time-Period Filters**: Filter your financial command center by *All Time*, *This Month*, *Last 30 Days*, or *This Year*.
- 🧠 **Smart Financial Insights**: Dynamic recommendations and spending advice calculated from your actual savings rate and top expenses.
- ✏️ **Full Update (Edit) Operations**: Edit any transaction in 1-click with real-time MongoDB Atlas sync.
- 🔍 **View Transactions Explorer**: Full-text search, multi-filter by type & category, sorting, and **one-click Export to CSV** (Excel / Google Sheets compatible).
- 📝 **Optional Comment / Reference**: Transactions can be added and updated with or without reference notes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Styled-Components, Chart.js & react-chartjs-2, React-DatePicker, React-Icons, Axios, Moment.js
- **Backend**: Node.js, Express.js, MongoDB (Mongoose ORM), JSON Web Tokens (JWT), BcryptJS, CORS, Dotenv
- **Database**: MongoDB Atlas (Cloud)

---

## 📁 Project Structure

```text
Expense-Tracker-App/
├── backend/                  # Express.js REST API & MongoDB models
│   ├── controllers/          # Auth, Income & Expense controllers
│   ├── db/                   # MongoDB connection handler
│   ├── middleware/           # JWT Auth verification middleware
│   ├── models/               # User, Income, and Expense Mongoose models
│   ├── routes/               # Auth and Transaction API routes
│   ├── app.js                # Express server entry point
│   ├── package.json
│   └── .gitignore
├── frontend/                 # React single page application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Auth, Dashboard, Charts, Modals, etc.
│   │   ├── context/          # Global React Context & Auth state
│   │   ├── styles/           # Global styles and layouts
│   │   └── utils/            # Icons, menu items, date formatters
│   ├── package.json
│   └── .gitignore
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)

### 2. Clone the Repository
```bash
git clone https://github.com/VirajBPatel22/Expense-Tracker-App.git
cd Expense-Tracker-App
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5001
MONGO_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:5001
```

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install --legacy-peer-deps
npm start
# App running at http://localhost:3000
```

---

## 🚢 Deployment Guide

### Backend on [Render.com](https://render.com)
1. Create a **New Web Service** and connect this repository.
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URL`: `<your-mongodb-atlas-uri>`
   - `JWT_SECRET`: `<your-jwt-secret>`

### Frontend on [Vercel.com](https://vercel.com)
1. Import repository on Vercel.
2. Set **Root Directory**: `frontend`
3. Set **Framework Preset**: `Create React App`
4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://your-render-backend.onrender.com/api/v1/`
5. Click **Deploy**.

---

## 👤 Author

**Viraj Patel**
- GitHub: [@VirajBPatel22](https://github.com/VirajBPatel22)
- Repository: [Expense-Tracker-App](https://github.com/VirajBPatel22/Expense-Tracker-App)

---

## 📄 License
This project is open source and available under the ISC License.
