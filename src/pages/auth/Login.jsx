import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../../store/slices/authSlice'
import { loginSchema } from '../../validation/schemas'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function handleLogin(data) {
    let role = ''

    if (
      data.email === 'admin@example.com' &&
      data.password === 'password123'
    ) {
      role = 'admin'
    }

    if (
      data.email === 'seller@example.com' &&
      data.password === 'password123'
    ) {
      role = 'seller'
    }

    if (
      data.email === 'customer@example.com' &&
      data.password === 'password123'
    ) {
      role = 'customer'
    }

    if (!role) {
      setError('root', {
        type: 'manual',
        message: 'Invalid email or password.',
      })

      return
    }

    const user = {
      id: Date.now(),
      email: data.email,
      role,
    }

    dispatch(login(user))

    if (role === 'admin') {
      navigate('/admin')
      return
    }

    if (role === 'seller') {
      navigate('/seller')
      return
    }

    navigate('/')
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
          onSubmit={handleSubmit(handleLogin)}
          noValidate
          className="mt-6 space-y-5"
        >
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
              placeholder="Enter your email"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 ${
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
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={`w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 ${
                errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p className="text-sm text-red-600">
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? 'Logging in...'
              : 'Login'}
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-semibold">
            Demo accounts
          </p>

          <p className="mt-2">
            customer@example.com
          </p>

          <p>
            seller@example.com
          </p>

          <p>
            admin@example.com
          </p>

          <p className="mt-2 text-gray-500">
            Password: password123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
