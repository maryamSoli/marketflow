import { Routes, Route } from 'react-router'

import CustomerLayout from './layouts/CustomerLayout'
import DashboardLayout from './layouts/DashboardLayout'
import SellerLayout from './layouts/SellerLayout'

import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderSuccess from './pages/customer/OrderSuccess'

import Login from './pages/auth/Login'

import Dashboard from './pages/dashboard/Dashboard'
import SellerDashboard from './pages/dashboard/SellerDashboard'
import AdminProducts from './pages/dashboard/AdminProducts'
import Orders from './pages/dashboard/Orders'
import Users from './pages/dashboard/Users'
import SellerProducts from './pages/dashboard/SellerProducts'
import SellerOrders from './pages/dashboard/SellerOrders'

import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
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
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']} />
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
            element={<Orders />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={['seller']} />
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
        </Route>
      </Route>
    </Routes>
  )
}

export default App