# BookIt Frontend

Modern, responsive web application for booking travel experiences built with React, TypeScript, and TailwindCSS.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## 🛠️ Installation & Setup

### 1. Clone and Navigate

```bash
cd bookit-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Update `.env` with your backend API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

## 📁 Project Structure

```
bookit-frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.tsx    # Main layout with header/footer
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx       # Experience listing
│   │   ├── DetailsPage.tsx    # Experience details & slot selection
│   │   ├── CheckoutPage.tsx   # Booking form & payment
│   │   └── ResultPage.tsx     # Booking confirmation
│   ├── services/         # API services
│   │   └── api.ts        # API client and endpoints
│   ├── types/            # TypeScript types
│   │   └── index.ts      # Type definitions
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles & Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Features

### 1. Home Page (`/`)
- Browse all available experiences
- Search by title, location, or description
- Filter by category (Adventure, Water Sports, etc.)
- View ratings and pricing
- Responsive grid layout

### 2. Details Page (`/experience/:id`)
- View experience details, highlights, and inclusions
- Select date from available slots
- Choose time slot (Morning, Afternoon, Evening)
- Set number of guests
- Real-time availability checking
- Price calculation

### 3. Checkout Page (`/checkout`)
- Personal information form with validation
- Apply promo codes (SAVE10, FLAT100, WELCOME20)
- View booking summary
- Real-time discount calculation
- Secure booking submission

### 4. Result Page (`/result/:bookingId`)
- Booking confirmation with details
- Download/print confirmation
- Email notification confirmation
- Booking reference number

## 🎯 Key Components

### Layout Component
- Sticky header with navigation
- Footer with links
- Consistent spacing and styling

### Form Validation
- Email format validation
- Phone number validation (min 10 digits)
- Name validation (min 2 characters)
- Real-time error display

### Promo Code System
- Apply discount codes
- Real-time validation
- Display savings
- Remove applied codes

## 📱 Responsive Design

- **Mobile**: Single column, touch-friendly
- **Tablet**: Two-column grid
- **Desktop**: Three-column layout with sidebars

Built with mobile-first approach using Tailwind breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6, #2563eb)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Gray Scale**: 50-900

### Typography
- **Font**: Inter
- **Sizes**: text-sm, base, lg, xl, 2xl, 3xl

### Components
- Cards with hover effects
- Buttons (primary, secondary)
- Input fields with focus states
- Loading spinners
- Error states

## 🔌 API Integration

All API calls are centralized in `src/services/api.ts`:

```typescript
// Get all experiences
getExperiences(params?)

// Get single experience with slots
getExperienceById(id)

// Create booking
createBooking(data)

// Get booking details
getBookingById(id)

// Validate promo code
validatePromoCode(code, amount)
```

## 🧪 Testing the Application

### Test Flow
1. Start backend server on port 5000
2. Start frontend on port 5173
3. Browse experiences on home page
4. Click an experience to view details
5. Select date, time slot, and guests
6. Click "Book Now"
7. Fill in personal information
8. Apply promo code (optional): `SAVE10`
9. Confirm booking
10. View confirmation page

### Available Promo Codes
- `SAVE10` - 10% off (min $100)
- `FLAT100` - $100 off (min $500)
- `WELCOME20` - 20% off (min $200, max $500 discount)

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
5. Deploy

### Deploy to Netlify

1. Push code to GitHub
2. Create new site from Git
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend API URL
5. Deploy

### Environment Variables for Production

```env
VITE_API_URL=https://your-backend-api.com/api
```

## 🎯 User Experience Features

### Loading States
- Skeleton screens while loading
- Spinner animations
- Disabled button states

### Error Handling
- Form validation errors
- API error messages
- Network error handling
- Graceful fallbacks

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance

## 🐛 Troubleshooting

### Issue: API Connection Failed

**Solution**:
1. Ensure backend is running on port 5000
2. Check `VITE_API_URL` in `.env`
3. Verify CORS is enabled on backend

### Issue: Images Not Loading

**Solution**:
Images are loaded from Unsplash. Ensure internet connection is active.

### Issue: Build Fails

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite node_modules/.vite
npm run dev
```

### Issue: Promo Codes Not Working

**Solution**:
1. Check backend is seeded with promo codes
2. Verify minimum amount requirements
3. Check promo code spelling (case-sensitive)

## 🔧 Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Changes appear immediately without full page reload.

### TypeScript
All components are fully typed. Use TypeScript for better DX and fewer bugs.

### Tailwind IntelliSense
Install Tailwind CSS IntelliSense extension in VS Code for autocomplete.

## 📄 License

MIT

## 🙋 Support

For issues or questions:
1. Check this README
2. Review backend API documentation
3. Check browser console for errors
4. Verify backend is running and accessible