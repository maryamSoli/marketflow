import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromWishlist } from '../../store/slices/wishlistSlice'

function Wishlist() {
  const dispatch = useDispatch()

  const items = useSelector(
    state => state.wishlist.items,
  )

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold">
          My Wishlist
        </h1>

        <p className="mt-4 text-gray-500">
          Your wishlist is empty.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(item => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <Link to={`/products/${item.id}`}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
            </Link>

            <div className="p-4">
              <h2 className="font-semibold">
                {item.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {item.category}
              </p>

              <p className="mt-3 text-lg font-bold">
                ${item.price}
              </p>

              <button
                onClick={() =>
                  dispatch(
                    removeFromWishlist(item.id),
                  )
                }
                className="mt-4 w-full rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist