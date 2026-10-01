import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import authReducer from './slices/authSlice'
import wishlistReducer from './slices/wishlistSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    notifications: notificationReducer,
  },
})

store.subscribe(() => {
  const notifications =
    store.getState().notifications.items

  localStorage.setItem(
    'marketflowNotifications',
    JSON.stringify(notifications),
  )
})