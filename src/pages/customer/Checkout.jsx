import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../store/slices/cartSlice'
import { addNotification } from '../../store/slices/notificationSlice'
import { useCreateOrder } from '../../queries/useCreateOrder'
import { checkoutSchema } from '../../validation/schemas'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(
    state => state.auth.user,
  )

  const items = useSelector(
    state => state.cart.items,
  )

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    },
  })

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useCreateOrder()

  const total = items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  )

  function handleOrderSubmit(data) {
    const order = {
      customerEmail: data.email,
      customerName: data.name,
      customerPhone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,

      products: items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
      })),

      total,
    }

    mutate(order, {
      onSuccess: createdOrder => {
        dispatch(clearCart())

        dispatch(
          addNotification({
            title: 'Order placed',
            message: `Your order ${createdOrder.id} has been placed successfully.`,
          }),
        )

        navigate('/order-success', {
          state: {
            order: createdOrder,
            customer: data,
            total,
          },
        })
      },
    })
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold">
          Your cart is empty
        </h1>

        <Link
          to="/products"
          className="mt-4 inline-block rounded bg-blue-600 px-5 py-2 text-white"
        >
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit(handleOrderSubmit)}
          noValidate
          className="space-y-5 rounded-lg bg-white p-6 shadow lg:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Shipping Information
          </h2>

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium"
            >
              Full name
            </label>

            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Full name"
              className={`w-full rounded border px-4 py-3 outline-none focus:border-blue-500 ${
                errors.name
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="text"
              {...register('email')}
              placeholder="Email"
              readOnly={!!user}
              className={`w-full rounded border px-4 py-3 outline-none focus:border-blue-500 read-only:bg-gray-100 ${
                errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium"
            >
              Phone
            </label>

            <input
              id="phone"
              type="text"
              {...register('phone')}
              placeholder="Phone number"
              className={`w-full rounded border px-4 py-3 outline-none focus:border-blue-500 ${
                errors.phone
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium"
            >
              Address
            </label>

            <textarea
              id="address"
              {...register('address')}
              placeholder="Address"
              rows="4"
              className={`w-full resize-none rounded border px-4 py-3 outline-none focus:border-blue-500 ${
                errors.address
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="mb-1 block text-sm font-medium"
              >
                City
              </label>

              <input
                id="city"
                type="text"
                {...register('city')}
                placeholder="City"
                className={`w-full rounded border px-4 py-3 outline-none focus:border-blue-500 ${
                  errors.city
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />

              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="mb-1 block text-sm font-medium"
              >
                Postal code
              </label>

              <input
                id="postalCode"
                type="text"
                {...register('postalCode')}
                placeholder="Postal code"
                className={`w-full rounded border px-4 py-3 outline-none focus:border-blue-500 ${
                  errors.postalCode
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />

              {errors.postalCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>

          {isError && (
            <p className="text-sm text-red-600">
              {error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending
              ? 'Placing order...'
              : 'Place Order'}
          </button>
        </form>

        <div className="h-fit rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Order Summary
          </h2>

          <div className="space-y-3">
            {items.map(item => (
              <div
                key={item.id}
                className="flex justify-between gap-4"
              >
                <span className="text-gray-600">
                  {item.title} × {item.quantity}
                </span>

                <span className="font-medium">
                  $
                  {(
                    item.price * item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="my-5 border-t" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
