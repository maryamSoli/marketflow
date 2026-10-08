
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import {
  Alert,
  Button,
  Snackbar,
  TextField,
} from '@mui/material'
import { updateProfile } from '../../store/slices/authSlice'
import { profileSchema } from '../../validation/schemas'

function Profile() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)

  const [message, setMessage] = useState('')

  const savedSettings = localStorage.getItem(
    `marketflowSettings-${user?.id}`,
  )

  let settings = {
    emailNotifications: true,
    orderUpdates: true,
  }

  if (savedSettings) {
    try {
      settings = JSON.parse(savedSettings)
    } catch {
      localStorage.removeItem(
        `marketflowSettings-${user?.id}`,
      )
    }
  }

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      city: user?.city || '',
      address: user?.address || '',
      emailNotifications: settings.emailNotifications,
      orderUpdates: settings.orderUpdates,
    },
  })

  function handleSave(data) {
    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      city: data.city,
      address: data.address,
    }

    dispatch(updateProfile(profileData))

    localStorage.setItem(
      `marketflowSettings-${user.id}`,
      JSON.stringify({
        emailNotifications: data.emailNotifications,
        orderUpdates: data.orderUpdates,
      }),
    )

    setMessage('Profile updated successfully.')
  }

  if (!user) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Profile</h1>

        <p className="mt-2 text-gray-600">
          Please log in to view your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your personal information and account settings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        noValidate
        className="space-y-6"
      >
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold">
            Personal information
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <TextField
              label="First name"
              fullWidth
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <TextField
              label="Last name"
              fullWidth
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

            <TextField
              label="Phone"
              fullWidth
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              label="City"
              fullWidth
              {...register('city')}
              error={!!errors.city}
              helperText={errors.city?.message}
            />

            <TextField
              label="Email"
              fullWidth
              value={user.email}
              disabled
            />

            <TextField
              label="Role"
              fullWidth
              value={user.role}
              disabled
            />

            <TextField
              label="User ID"
              fullWidth
              value={user.id}
              disabled
            />

            <TextField
              label="Address"
              fullWidth
              multiline
              minRows={3}
              {...register('address')}
              error={!!errors.address}
              helperText={errors.address?.message}
              className="md:col-span-2"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-6 text-xl font-semibold">
            Account settings
          </h2>

          <div className="space-y-5">
            <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <p className="font-medium">
                  Email notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive account and promotional emails.
                </p>
              </div>

              <input
                type="checkbox"
                className="h-5 w-5"
                {...register('emailNotifications')}
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <p className="font-medium">
                  Order updates
                </p>

                <p className="text-sm text-gray-500">
                  Receive notifications about your orders.
                </p>
              </div>

              <input
                type="checkbox"
                className="h-5 w-5"
                {...register('orderUpdates')}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : 'Save changes'}
          </Button>
        </div>
      </form>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Profile
