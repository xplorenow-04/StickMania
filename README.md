# StickMania 🚀 — Production-Grade Sticker E-Commerce Store

StickMania is a complete, end-to-end, production-ready sticker store designed for developers, designers, and sticker enthusiasts. Repurposed from a legacy chat platform, it provides client-side product browsing, category filtering, and direct-to-WhatsApp ordering alongside a robust administrator inventory manager.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite (Fast builds & optimized SPA bundle)
- **Routing**: React Router DOM v7 (Clean nested routes and route guards)
- **Styling**: Tailwind CSS (Harmonious violet/pink theme and layout spacing)
- **Animations**: Framer Motion (Smooth UI micro-actions & scroll transitions)
- **State Management**: Zustand (Clean, lightweight store states) + React Context (Authentication provider)
- **Forms**: React Hook Form + Zod (Validation & schema enforcement)

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose ORM
- **Authentication**: JWT-based cookie session auth
- **Security**: Helmet, Express Mongo Sanitize, Rate Limiting

---

## Directory Structure

```
StickMania/
├── client/                    # React 19 Frontend + Vite
│   ├── src/
│   │   ├── api/               # Category, Product, & User APIs
│   │   ├── components/        # Reusable UI elements (Navbar, Footer, Modals)
│   │   ├── context/           # Auth Context Provider
│   │   ├── pages/             # Shop, Home, Product Details, Category list, Admin Panel
│   │   └── store/             # Zustand state stores
│   └── vercel.json            # Vercel configuration routing rewrites
└── server/                    # Node/Express Backend API
    ├── src/
    │   ├── controllers/       # Business logic controllers
    │   ├── models/            # Category, Product, and User schemas
    │   ├── routes/            # Routes endpoints
    │   ├── middlewares/       # Multer, Auth check, and Admin guards
    │   ├── services/          # Cloudinary services
    │   └── utils/             # Express handlers, seeders, and wrappers
    └── .env                   # Server environment variables
```

---

## Configuration & Environment Variables

### Backend Configuration (`server/.env`)
Create a `.env` file inside the `server` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_ACCESS_SECRET=your_jwt_access_secret_key
EXPIRES_IN_ACCESS_TOKEN=1d
EXPIRES_IN_REFRESH_TOKEN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Cloudinary Credentials (for uploading sticker images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI / Chat fallbacks (Optional)
GOOGLE_GENAI_API_KEY=your_key

# WhatsApp ordering phone number (including country code, e.g. 9172346386)
WHATSAPP_NO=9172346386
```

### Frontend Configuration (`client/.env`)
Create a `.env` file inside the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_URL_PROD=https://your-deployed-api.onrender.com
VITE_ENV=development
```

---

## Getting Started

### 1. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Seed Admin Credentials
Before starting the application, run the MongoDB database seeder script to register the default administrator account.
```bash
cd server
node src/utils/seed.js
```
*Default admin credentials created:*
- **Email**: `admin@stickmania.com`
- **Password**: `Admin@123456`

### 3. Run Development Servers
Start both servers in parallel:
```bash
# In the server terminal
cd server
npm run dev

# In the client terminal
cd client
npm run dev
```

Visit the application at `http://localhost:5173`. Access `/login` to log into the administrator dashboard.

---

## Features Walkthrough

### Customer Flow
1. **Landing Page**: Highly styled Hero banner with trending product carousel highlights.
2. **Catalog Page**: Filter items by Categories, query search tags, and sort by price or latest arrival.
3. **Product details**: View multiple images, description checklists, and order direct to WhatsApp message.

### Administrator Flow
1. **Control Dashboard**: View stats (Active inventory, sale products, categories, featured stickers).
2. **Category Manager**: Create themes and upload category banner images.
3. **Product Inventory**: Add products with up to 5 images, pricing, discount values, and tags list.

---

## Deployment

### Backend
Deploy the `server` directory to **Render**, **Railway**, or **Heroku**.
- Ensure to configure the Environment variables inside the service control panel.
- Update `CLIENT_URL` to match the frontend deployed URL.

### Frontend
Deploy the `client` directory to **Vercel**.
- The `client/vercel.json` ensures that single-page client side routes `/shop`, `/admin`, and `/category/:slug` redirect to index.html properly.
- Update `VITE_BACKEND_URL_PROD` to reference the deployed backend API URL.
# StickMania
# StickMania
