import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../store/slices/cartSlice'
import { useCreateOrder } from '../../queries/useCreateOrder'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const items = useSelector(
    state => state.cart.items,
  )

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [formError, setFormError] = useState('')

  const {
    mutate,
    isPending,
    isError,
    error,
  } = useCreateOrder()

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.postalCode
    ) {
      setFormError('Please fill in all fields.')
      return
    }

    setFormError('')

    const order = {
      products: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
      })),
    }

    mutate(order, {
      onSuccess: data => {
        dispatch(clearCart())

        navigate('/order-success', {
          state: {
            order: data,
            customer: form,
            total,
          },
        })
      },
    })
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center">
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
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white p-6 shadow lg:col-span-2"
        >
          <h2 className="mb-4 text-xl font-semibold">
            Shipping Information
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded border px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded border px-4 py-3 outline-none focus:border-blue-500"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full rounded border px-4 py-3 outline-none focus:border-blue-500"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            rows="4"
            className="w-full resize-none rounded border px-4 py-3 outline-none focus:border-blue-500"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full rounded border px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postal code"
              className="w-full rounded border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600">
              {formError}
            </p>
          )}

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
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout