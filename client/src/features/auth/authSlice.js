import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call this when your backend sends back a successful login
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    // Call this when the user clicks "Logout"
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
