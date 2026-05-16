import { createSlice } from "@reduxjs/toolkit"

// Only persist token — user fetched fresh via /me on load
const storedToken = localStorage.getItem("token")

const initialState = {
  user:            null,
  token:           storedToken || null,
  isAuthenticated: !!storedToken,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Persist token only on login / register
    loginSuccess: (state, action) => {
      state.user            = action.payload.user
      state.token           = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem("token", action.payload.token)
    },
    // Hydrate user from /me response
    setUser: (state, action) => {
      state.user            = action.payload
      state.isAuthenticated = true
    },
    // Patch specific user fields
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    // Clear everything on logout
    logout: (state) => {
      state.user            = null
      state.token           = null
      state.isAuthenticated = false
      localStorage.removeItem("token")
    },
  },
})

export const { loginSuccess, setUser, updateUser, logout } = authSlice.actions
export default authSlice.reducer
