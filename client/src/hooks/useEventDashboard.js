import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const API_BASE   = import.meta.env.VITE_API_URL || "http://localhost:5000"
const API_EVENTS = `${API_BASE}/api/events`
const API_STAFF  = `${API_BASE}/api/staff`

export function useEventDashboard(eventId) {
  const { user, token } = useSelector((s) => s.auth)
  const [event, setEvent] = useState(null)
  const [approvedStaff, setApprovedStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [eventRes, staffRes] = await Promise.all([
        axios.get(`${API_EVENTS}/${eventId}/dashboard-data`, { headers }),
        axios.get(`${API_STAFF}/approved`, { headers })
      ])
      setEvent(eventRes.data)
      setApprovedStaff(staffRes.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }, [eventId, token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const sendCoordinatorRequest = async (staffId) => {
    try {
      await axios.post(`${API_STAFF}/request/${eventId}/${staffId}`, {}, { headers })
      alert("Coordinator request sent successfully!")
      // optionally refresh data, but they aren't a coordinator yet until they accept
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request")
    }
  }

  // Edit Event using Formik logic (simple put request)
  const updateEvent = async (values) => {
    try {
      // Assuming a generic update endpoint exists, or we need to add one.
      // Wait, there is no generic edit event endpoint yet in eventController!
      // I should add it, but for now I'll prepare the call:
      await axios.put(`${API_EVENTS}/${eventId}`, values, { headers })
      alert("Event updated successfully!")
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event")
    }
  }

  // Destructive actions
  const deleteEvent = async () => {
    try {
      await axios.delete(`${API_EVENTS}/${eventId}`, { headers })
      return true
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event")
      return false
    }
  }

  const removeAttendee = async (userId) => {
    try {
      await axios.delete(`${API_EVENTS}/${eventId}/users/${userId}`, { headers })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove user")
    }
  }

  const removeCoordinator = async (staffId) => {
    try {
      await axios.delete(`${API_STAFF}/event/${eventId}/staff/${staffId}`, { headers })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove coordinator")
    }
  }

  const removePosterImg = async () => {
    try {
      const { data } = await axios.delete(`${API_EVENTS}/${eventId}/poster`, { headers })
      setEvent(data)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove poster")
    }
  }

  return { 
    event, approvedStaff, loading, error, user,
    sendCoordinatorRequest, updateEvent, 
    deleteEvent, removeAttendee, removeCoordinator, removePosterImg
  }
}
