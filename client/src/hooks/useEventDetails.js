import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const API = "http://localhost:5000/api/events"

export function useEventDetails(eventId) {
  const { user, token }       = useSelector((s) => s.auth)
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Fetch single event
  const fetchEvent = useCallback(() => {
    setLoading(true)
    axios
      .get(`${API}/${eventId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setEvent(data); setLoading(false) })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load event")
        setLoading(false)
      })
  }, [eventId, token])

  useEffect(() => { fetchEvent() }, [fetchEvent])

  // Register then re-fetch to update capacity
  const registerForEvent = async () => {
    try {
      await axios.post(
        `${API}/register/${eventId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchEvent()
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    }
  }

  // Unregister then re-fetch
  const unregisterForEvent = async () => {
    try {
      await axios.post(
        `${API}/unregister/${eventId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchEvent()
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed")
    }
  }

  return { event, loading, error, registerForEvent, unregisterForEvent, user }
}
