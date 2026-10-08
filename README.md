# MarketFlow

MarketFlow is a React-based e-commerce frontend project built for practicing modern frontend development.

The project has three user roles:

- **Customer:** browse products, search and filter, manage cart and wishlist, checkout, view orders, and manage profile
- **Seller:** manage products and view orders
- **Admin:** manage products, orders, and users

## Tech Stack

- React
- React Router
- Redux Toolkit
- TanStack React Query
- Axios
- React Hook Form
- Zod
- Material UI
- Tailwind CSS
- Vite
- JavaScript

## Main Features

- Product listing and product details
- Search, category filtering, sorting, and pagination
- Shopping cart
- Wishlist
- Checkout and orders
- Product reviews
- Login and role-based access
- Admin and seller product CRUD
- Form validation
- Responsive layout
- Loading, error, and empty states
- localStorage for frontend persistence
- React Query caching and prefetching

## Project Structure

```text
src/
├── components/    # Reusable UI components
├── layouts/       # Customer, seller, and admin layouts
├── pages/         # Application pages
├── queries/       # React Query hooks
├── services/      # API functions
├── store/         # Redux store and slices
├── routes/        # Protected routes
├── utils/         # Storage and helper functions
├── validation/    # Zod schemas
└── theme/         # Material UI theme
```

## Setup

Clone the repository:

```bash
git clone https://github.com/maryamSoli/marketflow.git
cd marketflow
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the URL shown by Vite.

## Production Build

To create a production build:

```bash
npm run build
```

The output is generated in the `dist` folder.

## Demo Accounts

### Customer

```text
Email: customer@example.com
Password: password123
```

### Seller

```text
Email: seller@example.com
Password: password123
```

### Admin

```text
Email: admin@example.com
Password: password123
```

## Routes

```text
/login

/products
/products/:id
/cart
/checkout
/orders
/orders/:id
/wishlist
/profile

/admin
/admin/products
/admin/orders
/admin/users

/seller
/seller/products
/seller/orders
```

## Notes

This project uses a demo API for product data. Since some API mutations are simulated, selected changes are also stored in `localStorage`.


## Git Branch

Development work is done on the `dev` branch.


