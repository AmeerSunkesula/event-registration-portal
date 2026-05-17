import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { setUser } from "../features/auth/authSlice"

const API = "http://localhost:5000/api"

export function useCoordinatorPanel() {
  const dispatch      = useDispatch()
  const { user, token } = useSelector((s) => s.auth)
  const [loading, setLoading] = useState(false)

  // Derive from Redux user object (already populated)
  const pendingRequests = user?.coordinatorRequests || []
  const assignedEvents  = user?.coordinatedEvents    || []

  // Re-hydrate user from server
  const refresh = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      dispatch(setUser(data))
    } catch (_) {
      // silent refresh failure
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.role === "staff") refresh()
  }, [])

  const acceptRequest = async (eventId) => {
    try {
      await axios.put(
        `${API}/staff/handle-request/${eventId}`,
        { action: "accept" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await refresh()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request")
    }
  }

  const rejectRequest = async (eventId) => {
    try {
      await axios.put(
        `${API}/staff/handle-request/${eventId}`,
        { action: "reject" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await refresh()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request")
    }
  }

  return { pendingRequests, assignedEvents, acceptRequest, rejectRequest, loading }
}
