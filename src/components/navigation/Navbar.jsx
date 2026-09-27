import { Link } from 'react-router'
import { Menu, ShoppingCart } from 'lucide-react'
import { useSelector } from 'react-redux'
import UserMenu from './UserMenu'

function Navbar({ onMenuClick }) {
  const cartItems = useSelector(
    state => state.cart.items,
  )

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <Link
          to="/"
          className="text-xl font-bold"
        >
          MarketFlow
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/cart"
          className="relative rounded-lg p-2 hover:bg-gray-100"
        >
          <ShoppingCart size={22} />

          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>

        <UserMenu />
      </div>
    </header>
  )
}

export default Navbar
