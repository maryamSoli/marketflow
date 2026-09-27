
import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../store/slices/cartSlice'

function Cart() {
  const dispatch = useDispatch()

  const items = useSelector(
    state => state.cart.items,
  )

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        <p className="mt-4 text-gray-500">
          Your cart is empty.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-left text-sm text-red-600 hover:underline sm:text-right"
        >
          Clear cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-24 w-24 rounded object-cover"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">
                {item.title}
              </h2>

              <p className="mt-1 text-gray-600">
                ${item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  dispatch(
                    decreaseQuantity(item.id),
                  )
                }
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>

              <span className="min-w-6 text-center">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  dispatch(
                    increaseQuantity(item.id),
                  )
                }
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <p className="font-semibold">
              $
              {(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() =>
                dispatch(removeFromCart(item.id))
              }
              className="text-left text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>

          <span>
            ${total.toFixed(2)}
          </span>
        </div>

        <Link
          to="/checkout"
          className="mt-5 block rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
