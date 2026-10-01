import { createSlice } from '@reduxjs/toolkit'

function getSavedNotifications() {
  const saved = localStorage.getItem(
    'marketflowNotifications',
  )

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved)
  } catch {
    localStorage.removeItem(
      'marketflowNotifications',
    )

    return []
  }
}

const initialState = {
  items: getSavedNotifications(),
}

const notificationSlice = createSlice({
  name: 'notifications',

  initialState,

  reducers: {
    addNotification(state, action) {
      state.items.unshift({
        id: Date.now(),
        title: action.payload.title,
        message: action.payload.message,
        createdAt: new Date().toISOString(),
        read: false,
      })
    },

    markAsRead(state, action) {
      const notification = state.items.find(
        item => item.id === action.payload,
      )

      if (notification) {
        notification.read = true
      }
    },

    markAllAsRead(state) {
      state.items.forEach(notification => {
        notification.read = true
      })
    },

    removeNotification(state, action) {
      state.items = state.items.filter(
        notification =>
          notification.id !== action.payload,
      )
    },

    clearNotifications(state) {
      state.items = []
    },
  },
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer