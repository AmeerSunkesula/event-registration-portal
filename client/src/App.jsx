import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setUser, logout } from "./features/auth/authSlice"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import EventsExplorer from "./pages/EventsExplorer"
import CreateEvent from "./pages/CreateEvent"
import EventDetails from "./pages/EventDetails"
import EventDashboard from "./pages/EventDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import PortalFooter from "./components/PortalFooter"

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const [booting, setBooting] = useState(true)

  // Hydrate user from /me on app load
  useEffect(() => {
    if (!token) {
      setBooting(false)
      return
    }
    axios
      .get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => dispatch(setUser(data)))
      .catch(() => dispatch(logout()))
      .finally(() => setBooting(false))
  }, [])

  // Full-screen spinner while validating token
  if (booting) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div
          className="spinner-border"
          style={{ color: "var(--theme-navy)" }}
          role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventsExplorer />} />
        <Route path="/events/:id" element={<EventDetails />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/dashboard"
          element={
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <PortalFooter />
    </div>
  )
}

export default App
