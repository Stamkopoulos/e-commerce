# Qloset

A full-stack e-commerce platform for clothing, built with a focus on clean API design, secure authentication, and real-world functionality.

Live Demo: https://qloset-smoky.vercel.app

---

## Features

- Product browsing and filtering  
- Image sliders and collections (men, women, accessories)  
- Shopping cart system  
- Stripe checkout integration  
- Authentication with Clerk  
- Order management  
- Admin dashboard (products, users, orders)  
- Responsive design  

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Clerk (authentication)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Stripe (payments)
- Clerk (auth middleware)

### Tools
- Concurrently (run frontend & backend together)

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Clerk account  
- Stripe account  

---

### Installation

```bash
git clone https://github.com/Stamkopoulos/e-commerce.git
cd e-commerce

npm install

cd server && npm install
cd ../client && npm install
```

---

### Environment Variables

#### Server (`server/.env`)

```env
MONGODB_USERNAME=your_username
MONGODB_PASSWORD=your_password
MONGODB_URI=your_connection_string

CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
CLERK_WEBHOOK_SIGNING_SECRET=your_secret

STRIPE_SECRET_KEY=your_key

BREVO_API_KEY=your_key
BREVO_LIST_ID=your_list_id

PORT=5000
FRONTEND_URL=http://localhost:5173
```

#### Client (`client/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_key
VITE_API_URL=http://localhost:5000
```

---

### Run the Application

You can run both frontend and backend from the root using:

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  

---

## API Overview

### Products
- GET /api/products  
- GET /api/products/:id  
- POST /api/products (Admin)  
- PUT /api/products/:id (Admin)  
- DELETE /api/products/:id (Admin)  

---

### Cart
- GET /api/cart  
- POST /api/cart  
- PATCH /api/cart/:itemId  
- PUT /api/cart  

---

### Orders
- POST /api/orders  
- GET /api/orders/my-orders  
- GET /api/orders/user/:userId  
- GET /api/orders/:id  

Admin:
- GET /api/orders  
- PUT /api/orders/:id  
- DELETE /api/orders/:id  

---

### Users
- POST /api/users  
- PUT /api/users/:id  
- DELETE /api/users/:id  

Admin:
- GET /api/users  
- GET /api/users/:id  

---

### Checkout
- POST /api/checkout/create-checkout-session  
- GET /api/checkout/session/:id  

---

### Collections & Categories
- GET /api/collections/:type  
- GET /api/categories  

---

### Admin
- GET /api/admin/dashboard/overview  
- GET /api/admin/products  
- GET /api/admin/orders  
- GET /api/admin/users  

---

### Webhooks
- POST /api/webhook/clerk/users  

---

## Contributors

- Giannis Stamkopoulos ([Stamkopoulos](https://github.com/Stamkopoulos))
- Dimitris Chios ([ChiosDim](https://github.com/ChiosDim))
- Giannis Tzaris ([tzarhs](https://github.com/tzarhs))


