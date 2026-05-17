import { useState, useEffect } from "react"
import axios from "axios"
import { useSelector } from "react-redux"

export function useAdminDashboard() {
  const [data, setData] = useState({
    pendingStaff: [],
    events: [],
    users: [],
    passwordResets: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const token = useSelector((state) => state.auth.token)

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [staffRes, eventsRes, usersRes, resetsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/staff/pending", { headers }),
        axios.get("http://localhost:5000/api/events", { headers }),
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/users/password-resets", { headers })
      ])

      setData({
        pendingStaff: staffRes.data,
        events: eventsRes.data,
        users: usersRes.data,
        passwordResets: resetsRes.data
      })
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const approveStaff = async (staffId) => {
    try {
      await axios.put(`http://localhost:5000/api/staff/approve/${staffId}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Error approving staff")
    }
  }

  const revokeStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to revoke this staff's access?")) return
    try {
      await axios.put(`http://localhost:5000/api/staff/revoke/${staffId}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Error revoking staff")
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user")
    }
  }

  const approveReset = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/approve-reset/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } })
      alert("Reset approved! A temporary password has been sent to the user's email.")
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Error approving password reset")
    }
  }

  return {
    data,
    loading,
    error,
    approveStaff,
    revokeStaff,
    deleteUser,
    approveReset
  }
}
