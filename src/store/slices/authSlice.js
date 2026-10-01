import { createSlice } from '@reduxjs/toolkit'

function getSavedUser() {
  const savedUser = localStorage.getItem('user')

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

const savedUser = getSavedUser()

const initialState = {
  user: savedUser,
  isLoggedIn: !!savedUser,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload
      state.isLoggedIn = true

      localStorage.setItem(
        'user',
        JSON.stringify(action.payload),
      )
    },

    updateProfile(state, action) {
      if (!state.user) {
        return
      }

      state.user = {
        ...state.user,
        ...action.payload,
      }

      localStorage.setItem(
        'user',
        JSON.stringify(state.user),
      )
    },

    logout(state) {
      state.user = null
      state.isLoggedIn = false

      localStorage.removeItem('user')
    },
  },
})

export const {
  login,
  updateProfile,
  logout,
} = authSlice.actions

export default authSlice.reducer