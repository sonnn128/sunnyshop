import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Start with an empty cart; items will be added by real user actions only
  cartItems: [],
  // No pre-populated saved items
  savedItems: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload
      const existing = state.cartItems.find(i => i.id === item.id && i.size === item.size && i.color?.name === item.color?.name)
      if (existing) {
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1)
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 })
      }
    },
    removeItem: (state, action) => {
      const id = action.payload
      state.cartItems = state.cartItems.filter(i => i.id !== id)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find(i => i.id === id)
      if (item) item.quantity = quantity
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    saveForLater: (state, action) => {
      const id = action.payload
      const item = state.cartItems.find(i => i.id === id)
      if (item) {
        state.savedItems.push({ ...item, quantity: 1 })
        state.cartItems = state.cartItems.filter(i => i.id !== id)
      }
    },
    moveToCart: (state, action) => {
      const id = action.payload
      const item = state.savedItems.find(i => i.id === id)
      if (item) {
        state.cartItems.push({ ...item, quantity: 1 })
        state.savedItems = state.savedItems.filter(i => i.id !== id)
      }
    },
    removeSavedItem: (state, action) => {
      const id = action.payload
      state.savedItems = state.savedItems.filter(i => i.id !== id)
    }
  }
})

export const { addItem, removeItem, updateQuantity, clearCart, saveForLater, moveToCart, removeSavedItem } = cartSlice.actions
export default cartSlice.reducer
