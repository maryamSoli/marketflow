import { Routes, Route } from 'react-router'

import CustomerLayout from './layouts/CustomerLayout'
import DashboardLayout from './layouts/DashboardLayout'
import SellerLayout from './layouts/SellerLayout'
import ErrorBoundary from './components/ErrorBoundary'

import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderSuccess from './pages/customer/OrderSuccess'
import Orders from './pages/customer/Orders'
import OrderDetails from './pages/customer/OrderDetails'
import Wishlist from './pages/customer/Wishlist'
import NotFound from './pages/NotFound'

import Profile from './pages/account/Profile'

import Login from './pages/auth/Login'

import Dashboard from './pages/dashboard/Dashboard'
import SellerDashboard from './pages/dashboard/SellerDashboard'
import AdminProducts from './pages/dashboard/AdminProducts'
import OrdersAdmin from './pages/dashboard/Orders'
import Users from './pages/dashboard/Users'
import SellerProducts from './pages/dashboard/SellerProducts'
import SellerOrders from './pages/dashboard/SellerOrders'

import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<CustomerLayout />}>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={['customer']}
              />
            }
          >
            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['admin']}
            />
          }
        >
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<Dashboard />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/orders"
              element={<OrdersAdmin />}
            />

            <Route
              path="/admin/users"
              element={<Users />}
            />

            <Route
              path="/admin/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={['seller']}
            />
          }
        >
          <Route element={<SellerLayout />}>
            <Route
              path="/seller"
              element={<SellerDashboard />}
            />

            <Route
              path="/seller/products"
              element={<SellerProducts />}
            />

            <Route
              path="/seller/orders"
              element={<SellerOrders />}
            />

            <Route
              path="/seller/profile"
              element={<Profile />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default App