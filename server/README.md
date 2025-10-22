# Mini E-Commerce Server

Run the server:

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies: `npm install`.
3. Seed DB: `npm run seed`.
4. Start server: `npm run dev` (requires nodemon) or `npm start`.

API endpoints:
- POST /api/auth/register {name,email,password}
- POST /api/auth/login {email,password}
- GET /api/products
- GET /api/products/:id
- POST /api/orders (Authorization: Bearer <token>) {items, address}
