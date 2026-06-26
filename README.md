# LuxeLiving - Real Estate Platform

A modern, full-stack real estate management platform built with the MERN stack (MongoDB, Express, React, Node.js). LuxeLiving enables property owners to list properties, users to browse and search for properties, and admins to manage the entire platform.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Flow & Architecture](#user-flow--architecture)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Key Features Explained](#key-features-explained)

## Features

### User Features
- Browse properties for sale and rent
- Real-time search and filtering by city, area, price, category, and size
- Add properties to favorites for later review
- Explore detailed area guides with statistics
- Post property wanted listings to find specific properties
- User profile and property management
- Secure authentication with JWT tokens

### Admin Features
- Property approval and rejection workflow
- Manage properties, users, and platform data
- Comprehensive dashboard with analytics and statistics
- Manage area guides and location information
- Advanced filtering and search capabilities
- Real-time property statistics by category and city

### Property Features
- Multi-image upload with Cloudinary CDN
- Categorization options (Residential, Commercial, Plot)
- Price and size range filtering
- Detailed property information and descriptions
- Target audience selection (Buyer, Renter, Investor)

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js & Express** - Server runtime and framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Cloudinary** - Image storage and CDN
- **CORS** - Cross-origin resource sharing

### DevTools
- **Vite** - Fast frontend bundler
- **Tailwind CSS** - Styling

## Project Structure

```
LuxeLiving/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── propertyController.js # Property management
│   │   ├── adminController.js    # Admin operations
│   │   ├── areaController.js     # Area management
│   │   ├── favoriteController.js # Favorites
│   │   ├── wantedController.js   # Wanted listings
│   │   └── adminPropertyController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── upload.js             # File upload middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Property.js           # Property schema
│   │   ├── Area.js               # Area schema
│   │   ├── Favorite.js           # Favorites schema
│   │   └── Wanted.js             # Wanted listings schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── propertyRoutes.js     # Property endpoints
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── areaRoutes.js         # Area endpoints
│   │   ├── favoriteRoutes.js     # Favorite endpoints
│   │   └── wantedRoutes.js       # Wanted endpoints
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express app setup
│   └── seedAdmin.js              # Database seeding script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI/               # Reusable UI components
│   │   │   ├── Layout/           # Layout components
│   │   │   └── Admin/            # Admin components
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Home page
│   │   │   ├── Buy.jsx           # Buy properties page
│   │   │   ├── Rent.jsx          # Rent properties page
│   │   │   ├── Sell.jsx          # Sell property form
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── AreaGuide.jsx     # Area details
│   │   │   └── Wanted.jsx        # Wanted listings
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css               # Global styles
│   │   └── index.html            # HTML entry point
│   ├── public/                   # Static assets
│   ├── package.json
│   └── vite.config.js
│
└── README.md                     # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Git

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables (see below)

4. Start the server:
```bash
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/luxeliving

# Server
PORT=5000

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env if needed)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication `/api/auth`
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (protected)

### Properties `/api/properties`
- `GET /` - Get all approved properties (public)
- `GET /filter` - Filter properties by criteria
- `POST /` - Create new property (protected)
- `GET /my-properties` - Get user's properties (protected)

### Admin - Properties `/api/admin/properties`
- `GET /` - Get all properties with filters (admin only)
- `GET /pending` - Get pending properties (admin only)
- `PATCH /:id/approval` - Approve/reject property (admin only)
- `DELETE /:id` - Delete property (admin only)

### Admin - Users `/api/admin/users`
- `GET /` - Get all users (admin only)
- `DELETE /:id` - Delete user (admin only)

### Areas `/api/areas`
- `GET /cities` - Get all cities
- `GET /city/:city` - Get areas in a city
- `GET /:city/:area` - Get area statistics

### Favorites `/api/favorites`
- `GET /` - Get user favorites (protected)
- `POST /` - Add to favorites (protected)
- `DELETE /:id` - Remove from favorites (protected)

### Wanted `/api/properties/wanted`
- `GET /` - Get wanted listings
- `POST /` - Create wanted listing (protected)
- `DELETE /:id` - Delete wanted listing (protected)

## User Flow & Architecture

### 1. Authentication Flow
```
User Registration/Login
    ↓
JWT Token Generated
    ↓
Token Stored in localStorage
    ↓
Attached to API Requests via Authorization Header
    ↓
Protected Routes Verified
```

### 2. Property Listing Flow
```
User fills form → 
Images uploaded to Cloudinary → 
Property saved to MongoDB (pending) →
Admin reviews in dashboard →
Admin approves/rejects →
Property visible on platform (if approved)
```

### 3. Search & Filter Flow
```
User applies filters →
Real-time debounced search (300ms) →
API query with filter parameters →
Results updated instantly →
Properties displayed in carousel
```

### 4. Admin Approval Workflow
```
Pending Properties Tab →
Admin reviews property details →
Click Approve/Reject →
Property status updates →
Row animates out smoothly →
Statistics updated instantly
```

## Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  role: String (user/admin, default: user),
  createdAt: Date
}
```

### Property Schema
```javascript
{
  title: String (required),
  description: String (required),
  purpose: String (sale/rent, required),
  mainCategory: String (residential/commercial/plot, required),
  subCategory: String (house/flat/etc, required),
  price: Number (required),
  city: String (required),
  area: String,
  address: String,
  areaSize: Number,
  areaUnit: String (sqft/marla/kanal),
  bedrooms: Number,
  bathrooms: Number,
  features: [String],
  images: [{url, public_id}],
  owner: ObjectId (references User),
  approvalStatus: String (pending/approved/rejected),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

### Area Schema
```javascript
{
  name: String (required, unique),
  city: String (required),
  description: String,
  images: [{url, public_id}],
  createdAt: Date
}
```

### Favorite Schema
```javascript
{
  user: ObjectId (references User),
  property: ObjectId (references Property),
  createdAt: Date
}
```

### Wanted Schema
```javascript
{
  title: String,
  purpose: String (rent/sale),
  mainCategory: String,
  city: String,
  area: String,
  budget: String,
  description: String,
  user: ObjectId (references User),
  createdAt: Date
}
```

## Authentication

### JWT Implementation
- Tokens are generated on login/registration
- Tokens expire after 7 days (configurable)
- All protected routes verify JWT in Authorization header
- Format: `Authorization: Bearer <token>`

### Password Security
- Passwords are hashed using bcrypt
- Never stored in plain text
- Verified on login

### Protected Routes
Routes requiring authentication use `protect` middleware:
```javascript
router.get('/my-properties', protect, getMyProperties);
```

## Key Features Explained

### 1. Real-Time Filtering
- **Debounce Implementation**: Filters update every 300ms to reduce API calls
- **Dynamic Dropdowns**: Filter options populate from existing data
- **Price & Size Ranges**: Independent input fields for flexible filtering
- **Search Integration**: Searches title, description, city, area, address

### 2. Property Carousels
- **Responsive Design**: 
  - Mobile: 1 card per view
  - Tablet: 2 cards per view
  - Desktop: 4 cards per view
- **Smooth Navigation**: Chevron buttons with animations
- **Dot Indicators**: Visual pagination dots
- **Image Carousel**: Hover to navigate images within properties

### 3. Admin Dashboard
- **Real-Time Updates**: Properties disappear immediately after action
- **Smooth Animations**: 
  - Row opacity: 0.5 during action
  - Row scale: 0.95 during action
  - 300ms transition for smooth effect
- **Success Messages**: Toast notifications with emojis
- **Comprehensive Stats**: Properties by category, purpose, and city

### 4. Area Guides
- **Detailed Information**: Description and images for each area
- **Statistics**: Shows properties for rent/sale in each area
- **City Organization**: Areas grouped by city
- **Beautiful Display**: Image gallery with property counts

### 5. Image Upload
- **Cloudinary Integration**: Images stored on CDN
- **Automatic Optimization**: Images resized to 1200px
- **Multiple Formats**: JPG, PNG, WEBP supported
- **File Size Limit**: 5MB per image, max 5 images

## How Things Work

### Creating a Property
1. User navigates to Sell page
2. Fills form with all property details
3. Selects category (Residential/Commercial/Plot)
4. Uploads up to 5 images
5. Submits form
6. Images uploaded to Cloudinary
7. Property saved to MongoDB with `pending` status
8. Admin notified (in dashboard)
9. Admin approves/rejects in Admin Dashboard
10. Once approved, visible on Buy page

### Searching for Properties
1. User navigates to Buy page
2. Properties organized by city with category filters
3. Three filter buttons: Residential, Commercial, Plots
4. Clicking filter updates carousel in real-time
5. When approved properties added, they appear automatically
6. Search bar filters by location, price range
7. Results update as user types (debounced)

### Admin Approval Process
1. Admin logs in to dashboard
2. Navigates to "Pending Approval" tab
3. Sees all properties awaiting approval
4. Reviews property details
5. Clicks "✓" to approve or "✕" to reject
6. Row animates out (shrinks + fades)
7. Success message appears
8. Property removed from list
9. Stats update instantly
10. Approved properties appear on Buy page for users

### Favorites System
1. User browses properties
2. Clicks heart icon on property card
3. Property added to favorites
4. Synced to user's profile
5. User can view all favorites anytime
6. Can remove from favorites with one click

## Deployment Considerations

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder
```

### Backend Deployment (Heroku/Railway/Render)
- Set environment variables in platform
- Ensure MongoDB connection is public
- Configure CORS for frontend URL
- Cloudinary credentials required

## Notes

- JWT tokens stored in localStorage (consider moving to httpOnly cookies for production)
- Images stored on Cloudinary (not in database)
- Admin role set during user creation or via direct database update
- Area guides can be created through admin panel or database seeding

## Contributing

Feel free to fork, modify, and improve this project!

## License

This project is open source and available for educational purposes.

---

Built by Abdullah Ejaz

For questions or issues, please create an issue on GitHub.
