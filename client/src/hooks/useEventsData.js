import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const API        = "http://localhost:5000/api/events"
const CATEGORIES = ["All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Tech Fest", "Other"]

export function useEventsData() {
  const { user, token }         = useSelector((s) => s.auth)
  const [rawEvents, setRaw]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [searchQuery, setSearch]        = useState("")
  const [selectedCategory, setCategory] = useState("All")

  // Fetch all events
  const fetchEvents = useCallback(() => {
    setLoading(true)
    axios
      .get(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setRaw(data); setLoading(false) })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load")
        setLoading(false)
      })
  }, [token])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // Register for event then refresh
  const registerForEvent = async (eventId) => {
    try {
      await axios.post(
        `${API}/register/${eventId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchEvents()
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed")
    }
  }

  // Unregister from event then refresh
  const unregisterForEvent = async (eventId) => {
    try {
      await axios.post(
        `${API}/unregister/${eventId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchEvents()
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed")
    }
  }

  // ── Derived filtering ────────────────────────────────
  const filtered = rawEvents.filter((ev) => {
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      ev.title.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q)
    const matchCat =
      selectedCategory === "All" || ev.category === selectedCategory
    return matchSearch && matchCat
  })

  // Standalone events
  const standaloneEvents = filtered.filter((e) => e.eventType === "standalone")

  // Main events with nested children (children from raw — not filtered)
  const mainEvents = filtered
    .filter((e) => e.eventType === "main")
    .map((main) => ({
      ...main,
      children: rawEvents.filter(
        (e) => e.eventType === "sub" &&
               String(e.parentEvent) === String(main._id)
      ),
    }))

  return {
    loading, error,
    standaloneEvents, mainEvents,
    searchQuery, setSearch,
    selectedCategory, setCategory,
    categories: CATEGORIES,
    registerForEvent, unregisterForEvent,
    user,
    refetch: fetchEvents,
  }
}
