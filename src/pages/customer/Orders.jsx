import { Link } from 'react-router'
import {
  useCustomerOrders,
} from '../../queries/useCustomerOrders'

function Orders() {
  const {
    data: orders = [],
    isPending,
    isError,
  } = useCustomerOrders()

  if (isPending) {
    return <p>Loading orders...</p>
  }

  if (isError) {
    return (
      <p className="text-red-600">
        Failed to load orders.
      </p>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="mt-4 text-gray-500">
          You haven't placed any orders yet.
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
        My Orders
      </h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="rounded-lg bg-white p-5 shadow"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">
                  {order.id}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {new Date(
                    order.createdAt,
                  ).toLocaleString()}
                </p>
              </div>

              <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                {order.status}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {order.products.length} product
                  {order.products.length !== 1
                    ? 's'
                    : ''}
                </p>

                <p className="mt-1 text-lg font-bold">
                  ${order.total.toFixed(2)}
                </p>
              </div>

              <Link
                to={`/orders/${order.id}`}
                className="rounded-lg border px-4 py-2 text-center font-medium hover:bg-gray-100"
              >
                View Order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders