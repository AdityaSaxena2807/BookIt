# 🎫 BookIt - Travel Experiences Booking Platform

A full-stack web application for browsing and booking travel experiences with real-time slot availability, promo code validation, and secure booking confirmation.


## 🔗 Live Application Links

**📱 Frontend (User Interface):** [YOUR_FRONTEND_URL_HERE]  

**🔌 Backend API:** [https://bookit-backend-w4v6.onrender.com]  

**📚 API Documentation:** [https://book-it-amber.vercel.app/]  
*Health check endpoint to verify backend is running*

---

### Test Credentials
No authentication required - Just browse and book!

### Test Promo Codes
- **SAVE10** - 10% off (minimum $100)
- **FLAT100** - $100 off (minimum $500)
- **WELCOME20** - 20% off (minimum $200)

---

## 🎯 Features

### User Features
- 🔍 **Browse & Search** - Explore 6+ curated travel experiences
- 🗓️ **Real-time Availability** - See available slots and book instantly
- 💰 **Promo Codes** - Apply discount codes at checkout
- 📱 **Responsive Design** - Seamless experience on all devices
- ✅ **Instant Confirmation** - Get booking confirmation immediately
- 📧 **Email Notifications** - Receive booking details via email

### Technical Features
- 🔒 **Transaction Safety** - Prevents double-booking with database transactions
- ⚡ **Fast Performance** - Optimized with Vite and efficient API design
- 🎨 **Modern UI** - Built with TailwindCSS for beautiful, consistent design
- 📊 **TypeScript** - Full type safety across frontend and backend
- 🗃️ **PostgreSQL** - Reliable relational database with Prisma ORM

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Render PostgreSQL

---

## 🚀 Quick Start (Local Development)

### Prerequisites

Ensure you have these installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download)
- **Git** - [Download](https://git-scm.com)

Check versions:
```bash
node --version  # Should be v18+
psql --version  # Should be v14+
git --version
```

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bookit.git
cd bookit
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb bookit

# Set up environment variables
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/bookit"

# Generate Prisma Client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Seed database with sample data
npm run prisma:seed

# Start backend server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

Test it: Open `http://localhost:5000/health` - Should show `{"status":"ok"}`

### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# .env should contain:
# VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

### 4️⃣ Test the Application

1. Open browser: `http://localhost:5173`
2. Browse experiences on the home page
3. Click any experience (e.g., "Sunset Desert Safari")
4. Select a date and time slot
5. Choose number of guests
6. Click "Book Now"
7. Fill in your details:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "7497654280"
8. Try promo code: "SAVE10"
9. Complete booking
10. See confirmation page! 🎉

---

## 📁 Project Structure

```
bookit/
├── backend/                 # Backend API
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Sample data
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   │   ├── experiences.ts
│   │   │   ├── bookings.ts
│   │   │   └── promo.ts
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── DetailsPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── ResultPage.tsx
│   │   ├── services/       # API integration
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md              # This file
```

---

## 🔌 API Endpoints

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `YOUR_BACKEND_URL/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experiences` | Get all experiences |
| GET | `/api/experiences/:id` | Get experience details with slots |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/:id` | Get booking details |
| POST | `/api/promo/validate` | Validate promo code |

### Example API Call

```bash
# Get all experiences
curl http://localhost:5000/api/experiences

# Validate promo code
curl -X POST http://localhost:5000/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","amount":500}'
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root
   - Add environment variable:
     - `VITE_API_URL`: `YOUR_BACKEND_URL/api`
   - Click "Deploy"

3. **Get your live URL**
   - Vercel will provide a URL like: `https://bookit-xxxx.vercel.app`
   - **This is your FRONTEND URL** - Share this for users to access the app

### Backend Deployment (Render)

1. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select the `backend` directory as root
   - Configure:
     - **Build Command:** `npm install && npm run prisma:generate && npm run build`
     - **Start Command:** `npm start`

2. **Add PostgreSQL Database**
   - In Render dashboard: "New +" → "PostgreSQL"
   - Copy the "Internal Database URL"

3. **Set Environment Variables**
   - In Web Service → Environment:
     - `DATABASE_URL`: Paste internal database URL
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Your Vercel frontend URL
     - `PORT`: `5000`

4. **Seed Database**
   - After first deployment, go to Shell tab
   - Run:
     ```bash
     npm run prisma:push
     npm run prisma:seed
     ```

5. **Get your live URL**
   - Render will provide a URL like: `https://bookit-api.onrender.com`
   - **This is your BACKEND API URL**

### Update Frontend with Backend URL

After backend deployment:
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Update `VITE_API_URL` with your Render backend URL
4. Redeploy frontend

---

## 🎯 Hosted Application Links

**When submitting, provide BOTH links:**

### 1. Frontend URL (Main Application)
This is the link users visit to use your app:
```
https://your-app-name.vercel.app
```
**Example:** `https://bookit-experiences.vercel.app`

This is the **primary link** to share - it's your complete application that users interact with.

### 2. Backend API URL (API Service)
This is the backend service URL that frontend calls:
```
https://your-backend-name.onrender.com
```
**Example:** `https://bookit-api.onrender.com`

You should also provide the health check endpoint:
```
https://your-backend-name.onrender.com/health
```

**Why both?**
- **Frontend URL** = What users see and interact with
- **Backend URL** = The API service that powers the frontend
- Both need to be live for the app to work correctly

---

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/bookit"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Run Tests Locally

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```
---

### 🔧 Local Development Setup

After setting up your database and running the migrations/seeding, you can use Prisma Studio to inspect and manage your data visually.

```bash
# Open Prisma Studio (GUI for your database)
npx prisma studio
```

### Manual Testing Checklist

- [ ] Home page loads with experiences
- [ ] Search functionality works
- [ ] Experience details page shows slots
- [ ] Can select date and time
- [ ] Checkout form validates inputs
- [ ] Promo code "SAVE10" applies discount
- [ ] Booking confirmation displays

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Verify database exists
psql -l | grep bookit

# Regenerate Prisma Client
npm run prisma:generate
```

### Frontend can't connect to backend
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `.env` has correct `VITE_API_URL`
3. Ensure no CORS errors in browser console

### Database errors
```bash
# Reset database (⚠️ deletes all data)
npm run prisma:migrate reset

# Or push schema again
npm run prisma:push
npm run prisma:seed
```

### Port already in use
```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173
kill -9 <PID>
```

---

## 📖 Documentation

- [Backend README](https://github.com/AdityaSaxena2807/BookIt/blob/master/bookit-backend/README.md) - Detailed backend documentation
- [Frontend README](https://github.com/AdityaSaxena2807/BookIt/blob/master/bookit-frontend/README.md) - Detailed frontend documentation
- [API Documentation](./docs/API.md) - Complete API reference (create this)

---

## 📊 Project Status

✅ **Complete and Production Ready**

### Completed Features
- [x] Experience browsing with search and filters
- [x] Real-time slot availability
- [x] Booking system with validation
- [x] Promo code integration
- [x] Responsive design
- [x] Deployed to production

### Future Enhancements
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Review and rating system
- [ ] Booking cancellation
- [ ] Multi-language support
---

**⭐ If you find this project helpful, please give it a star!**

---

Made with by Aditya 
