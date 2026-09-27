import { Link } from 'react-router'

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white p-5 shadow-lg transition-transform lg:static lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 text-xl font-bold">
          MarketFlow
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            to="/"
            className="rounded px-3 py-2 hover:bg-gray-100"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="rounded px-3 py-2 hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            to="/orders"
            className="rounded px-3 py-2 hover:bg-gray-100"
          >
            Orders
          </Link>

          <Link
            to="/wishlist"
            className="rounded px-3 py-2 hover:bg-gray-100"
          >
            Wishlist
          </Link>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar