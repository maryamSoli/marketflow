import { Link, useLocation } from 'react-router'

function OrderSuccess() {
  const location = useLocation()

  const order = location.state?.order
  const customer = location.state?.customer
  const total = location.state?.total

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 text-center shadow">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
        ✓
      </div>

      <h1 className="mt-5 text-3xl font-bold">
        Order Placed
      </h1>

      <p className="mt-2 text-gray-600">
        Thank you for your purchase, {customer?.name}.
      </p>

      {order?.id && (
        <p className="mt-4">
          Order ID:{' '}
          <span className="font-semibold">
            {order.id}
          </span>
        </p>
      )}

      {total !== undefined && (
        <p className="mt-2">
          Total:{' '}
          <span className="font-semibold">
            ${total.toFixed(2)}
          </span>
        </p>
      )}

      <Link
        to="/products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  )
}

export default OrderSuccess