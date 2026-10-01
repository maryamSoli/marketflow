import { Link, useParams } from 'react-router'
import {
  useCustomerOrder,
} from '../../queries/useCustomerOrders'

function OrderDetails() {
  const { id } = useParams()

  const {
    data: order,
    isPending,
    isError,
  } = useCustomerOrder(id)

  if (isPending) {
    return <p>Loading order...</p>
  }

  if (isError || !order) {
    return (
      <div>
        <p className="text-red-600">
          Order not found.
        </p>

        <Link
          to="/orders"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/orders"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Back to orders
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Order {order.id}
          </h1>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
          <h2 className="mb-5 text-xl font-semibold">
            Products
          </h2>

          <div className="space-y-5">
            {order.products.map(product => (
              <div
                key={product.id}
                className="flex flex-col gap-4 border-b pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-24 w-24 rounded object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {product.title}
                  </h3>

                  <p className="mt-1 text-gray-500">
                    ${product.price.toFixed(2)} ×{' '}
                    {product.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  $
                  {(
                    product.price *
                    product.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="break-all font-medium">
                {order.customerEmail}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium">
                {order.customerPhone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-medium">
                {order.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                City
              </p>

              <p className="font-medium">
                {order.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Postal Code
              </p>

              <p className="font-medium">
                {order.postalCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails