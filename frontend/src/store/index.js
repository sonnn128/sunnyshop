import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import cartReducer from './slices/cartSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer
  }
})
