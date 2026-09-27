import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { login } from '../../store/slices/authSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    let role = ''

    if (
      email === 'admin@example.com' &&
      password === 'password123'
    ) {
      role = 'admin'
    }

    if (
      email === 'seller@example.com' &&
      password === 'password123'
    ) {
      role = 'seller'
    }

    if (
      email === 'customer@example.com' &&
      password === 'password123'
    ) {
      role = 'customer'
    }

    if (!role) {
      setError('Invalid email or password.')
      return
    }

    const user = {
      id: Date.now(),
      email,
      role,
    }

    dispatch(login(user))

    if (role === 'admin') {
      navigate('/admin')
    }

    if (role === 'seller') {
      navigate('/seller')
    }

    if (role === 'customer') {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <p className="mt-2 text-gray-500">
          Sign in to your MarketFlow account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={event =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={event =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-semibold">
            Demo accounts
          </p>

          <p className="mt-2">
            customer@example.com
          </p>

          <p>seller@example.com</p>

          <p>admin@example.com</p>

          <p className="mt-2 text-gray-500">
            Password: password123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login