# BookIt Backend API

RESTful API for the BookIt travel experiences booking platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **CORS**: cors

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd bookit-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/bookit?schema=public"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace `username` and `password` with your PostgreSQL credentials.

### 4. Set up the database

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# OR run migrations (for production)
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 5. Start the development server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 6. Verify installation

Open your browser or use curl to test:

```bash
curl http://localhost:5000/health
```

You should see: `{"status":"ok","message":"BookIt API is running"}`

## 📁 Project Structure

```
bookit-backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── routes/
│   │   ├── experiences.ts # Experience endpoints
│   │   ├── bookings.ts    # Booking endpoints
│   │   └── promo.ts       # Promo code endpoints
│   └── index.ts           # Main application entry
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Experiences

#### GET `/api/experiences`
Get all experiences with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search in title, description, location

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Sunset Desert Safari",
    "description": "...",
    "location": "Dubai Desert",
    "category": "Adventure",
    "price": 299,
    "duration": "6 hours",
    "image": "https://...",
    "rating": 4.8,
    "reviewCount": 234,
    "highlights": ["..."],
    "included": ["..."]
  }
]
```

#### GET `/api/experiences/:id`
Get single experience with available slots.

**Response:**
```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "slotsByDate": {
    "2025-11-01": [
      {
        "id": "uuid",
        "startTime": "08:00",
        "endTime": "12:00",
        "capacity": 10,
        "booked": 3,
        "available": 7,
        "isFull": false,
        "price": 299
      }
    ]
  }
}
```

### Bookings

#### POST `/api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "experienceId": "uuid",
  "slotId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "guests": 2,
  "promoCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "experienceTitle": "Sunset Desert Safari",
    "date": "2025-11-01",
    "time": "08:00 - 12:00",
    "guests": 2,
    "totalPrice": 538.2,
    "discount": 59.8,
    "status": "confirmed"
  }
}
```

#### GET `/api/bookings/:id`
Get booking details by ID.

### Promo Codes

#### POST `/api/promo/validate`
Validate a promo code and calculate discount.

**Request Body:**
```json
{
  "code": "SAVE10",
  "amount": 598
}
```

**Response:**
```json
{
  "valid": true,
  "code": "SAVE10",
  "type": "percentage",
  "value": 10,
  "discount": 59.8,
  "finalAmount": 538.2,
  "message": "10% off applied!"
}
```

## 🎯 Available Promo Codes

The seeded database includes these promo codes:

- **SAVE10**: 10% off (min. $100)
- **FLAT100**: $100 flat discount (min. $500)
- **WELCOME20**: 20% off up to $500 (min. $200)

## 🗄️ Database Schema

### Models

1. **Experience**: Travel experiences/activities
2. **Slot**: Available time slots for experiences
3. **Booking**: Customer bookings
4. **PromoCode**: Promotional discount codes

See `prisma/schema.prisma` for detailed schema.

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Add PostgreSQL database (Render provides free tier)
6. Update `DATABASE_URL` in environment variables
7. Run seed command manually after first deploy:
   ```bash
   npm run prisma:push && npm run prisma:seed
   ```

### Deploy to Railway

1. Create new project on Railway
2. Add PostgreSQL database
3. Deploy from GitHub
4. Add environment variables
5. Configure build:
   - Build Command: `npm install && npm run prisma:generate && npm run build`
   - Start Command: `npm start`
6. Run migrations and seed through Railway CLI

## 🧪 Testing

Test the API using the provided endpoints:

```bash
# Get all experiences
curl http://localhost:5000/api/experiences

# Get experience details
curl http://localhost:5000/api/experiences/{id}

# Validate promo code
curl -X POST http://localhost:5000/api/promo/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE10","amount":500}'
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:push` - Push schema to database (dev)
- `npm run prisma:seed` - Seed database with sample data

## 🔧 Troubleshooting

### Database Connection Issues

If you get connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # On macOS
   brew services list
   
   # On Linux
   sudo systemctl status postgresql
   ```

2. Check your DATABASE_URL in `.env`
3. Ensure database exists:
   ```bash
   psql -U postgres
   CREATE DATABASE bookit;
   ```

### Port Already in Use

If port 5000 is busy:

1. Change PORT in `.env`
2. Or kill the process:
   ```bash
   # Find process
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

## 📄 License

MIT

## 👥 Support

For issues or questions, please create an issue in the GitHub repository.