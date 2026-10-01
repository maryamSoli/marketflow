import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const product = action.payload

      const exists = state.items.some(
        item => item.id === product.id,
      )

      if (!exists) {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          category: product.category,
        })
      }
    },

    removeFromWishlist(state, action) {
      state.items = state.items.filter(
        item => item.id !== action.payload,
      )
    },

    clearWishlist(state) {
      state.items = []
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions

export default wishlistSlice.reducer