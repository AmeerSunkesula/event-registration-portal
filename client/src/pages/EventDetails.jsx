import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useEventDetails } from "../hooks/useEventDetails"

const POSTER_PH = "https://placehold.co/1200x400/303b57/debc58?text=Event"

// Resolve poster URL
const posterSrc = (poster) => poster
  ? (poster.includes("/")
      ? `http://localhost:5000/${poster}`
      : `http://localhost:5000/uploads/events/${poster}`)
  : POSTER_PH

// Format date helper
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
})

// Sidebar action button
function SidebarButton({ event, user, onRegister, onUnregister }) {
  const navigate = useNavigate()

  // Hidden for main events
  if (event.eventType === "main") {
    return (
      <p className="text-muted small mb-0 text-center fst-italic">
        Scroll down to view sub-events.
      </p>
    )
  }

  if (!user) {
    return (
      <button className="btn w-100"
        style={{ backgroundColor: "var(--theme-navy)", color: "#fff", fontFamily: "var(--font-heading)" }}
        onClick={() => navigate("/login")}>
        Login to Register
      </button>
    )
  }

  const isMain       = event.eventType === "main"
  const spotsLeft    = event.capacity - (event.registeredStudents?.length ?? 0)
  const isRegistered = event.registeredStudents?.some(
    (id) => String(id) === String(user?._id)
  )
  const soldOut  = !isMain && spotsLeft <= 0 && !isRegistered
  const daysLeft = (new Date(event.date) - Date.now()) / (1000 * 3600 * 24)

  if (isRegistered) {
    if (daysLeft <= 7) {
      return (
        <button className="btn w-100" disabled
          style={{ backgroundColor: "#aaa", color: "#fff", fontFamily: "var(--font-heading)" }}>
          🔒 Locked (&lt; 1 Week)
        </button>
      )
    }
    return (
      <button className="btn w-100"
        style={{ backgroundColor: "var(--theme-rust)", color: "#fff", fontFamily: "var(--font-heading)" }}
        onClick={onUnregister}>
        Unsubscribe
      </button>
    )
  }

  if (soldOut) {
    return (
      <button className="btn w-100" disabled
        style={{ backgroundColor: "#aaa", color: "#fff", fontFamily: "var(--font-heading)" }}>
        Sold Out
      </button>
    )
  }

  return (
    <button className="btn w-100"
      style={{ backgroundColor: "var(--theme-navy)", color: "#fff",
               fontFamily: "var(--font-heading)", fontWeight: 600 }}
      onClick={onRegister}>
      Register Now
    </button>
  )
}

function EventDetails() {
  const { id } = useParams()
  const { event, loading, error, registerForEvent, unregisterForEvent, user } =
    useEventDetails(id)

  // Sub-event local search
  const [subSearch, setSubSearch] = useState("")

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status" style={{ color: "var(--theme-navy)" }}>
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/events" className="btn btn-outline-secondary">← Back to Events</Link>
      </div>
    )
  }

  const isMain    = event.eventType === "main"
  const spotsLeft = event.capacity - (event.registeredStudents?.length ?? 0)

  // Filtered sub-events
  const filteredChildren = (event.children || []).filter((c) =>
    c.title.toLowerCase().includes(subSearch.toLowerCase())
  )

  return (
    <div className="container mt-5 mb-5">

      {/* Back link */}
      <Link to="/events" className="text-decoration-none small mb-3 d-inline-block"
        style={{ color: "var(--theme-navy)" }}>
        ← Back to Events
      </Link>

      {/* Banner image */}
      <img
        src={posterSrc(event.poster)}
        alt={event.title}
        className="w-100 rounded-3 mb-4"
        style={{ maxHeight: 380, objectFit: "cover" }}
      />

      <div className="row mt-2 g-4">

        {/* ── Left: Details ───────────────────────── */}
        <div className="col-md-8">

          {/* Category + type badges */}
          <div className="d-flex gap-2 mb-2">
            <span className="badge"
              style={{ backgroundColor: "var(--theme-sage)", fontSize: "0.75rem" }}>
              {event.category}
            </span>
            {event.eventType !== "standalone" && (
              <span className="badge"
                style={{ backgroundColor: "var(--theme-navy)", fontSize: "0.75rem" }}>
                {event.eventType === "main" ? "🎪 Festival" : "Sub-Event"}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
            {event.title}
          </h1>

          {/* Description */}
          <h6 className="mt-4 mb-2 fw-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--theme-navy)" }}>
            About this Event
          </h6>
          <p style={{ lineHeight: 1.8 }}>{event.description}</p>

          {/* Rules & Guidelines */}
          {event.rules && (
            <>
              <hr />
              <h6 className="fw-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)", color: "var(--theme-navy)" }}>
                📋 Rules &amp; Guidelines
              </h6>
              <div className="p-3 rounded-3"
                style={{ backgroundColor: "#f4f6f9", whiteSpace: "pre-wrap",
                         fontSize: "0.9rem", lineHeight: 1.7 }}>
                {event.rules}
              </div>
            </>
          )}

          {/* Sub-events with local search */}
          {isMain && (
            <>
              <hr />
              <h6 className="fw-semibold mb-3"
                style={{ fontFamily: "var(--font-heading)", color: "var(--theme-navy)" }}>
                Sub-Events ({event.children?.length || 0})
              </h6>

              {/* Local search bar */}
              {event.children?.length > 0 && (
                <input
                  type="search"
                  className="form-control mb-3"
                  placeholder="Search sub-events…"
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                />
              )}

              {filteredChildren.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {filteredChildren.map((child) => (
                    <li key={child._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                      <div>
                        <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                          {child.title}
                        </p>
                        <small className="text-muted">
                          {child.venue} · {new Date(child.date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                        </small>
                      </div>
                      <Link to={`/events/${child._id}`}
                        className="btn btn-sm btn-outline-secondary">
                        View
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small">No sub-events match your search.</p>
              )}
            </>
          )}
        </div>

        {/* ── Right: Sticky sidebar ───────────────── */}
        <div className="col-md-4">
          <div className="card auth-card sticky-top p-4" style={{ top: "80px" }}>

            {/* Spots badge — hidden for main */}
            {!isMain && (
              <span className="badge mb-3"
                style={{
                  backgroundColor: spotsLeft <= 0 ? "var(--theme-rust)" : "var(--theme-mustard)",
                  color: "var(--theme-navy)", fontSize: "0.85rem",
                }}>
                {spotsLeft <= 0 ? "Sold Out" : `${spotsLeft} / ${event.capacity} spots left`}
              </span>
            )}

            {/* Date — smart range */}
            <p className="mb-2">
              <span className="fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>📅 Date</span><br />
              <span className="text-muted">
                {event.endDate
                  ? `${fmt(event.date)} – ${fmt(event.endDate)}`
                  : fmt(event.date)}
              </span>
            </p>

            {/* Venue */}
            <p className="mb-2">
              <span className="fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>📍 Venue</span><br />
              <span className="text-muted">{event.venue}</span>
            </p>

            {/* Organizer */}
            <p className="mb-3">
              <span className="fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>👤 Organizer</span><br />
              <span className="text-muted">{event.organizer?.name}</span><br />
              <small className="text-muted">{event.organizer?.email}</small>
            </p>

            <hr className="my-3" />

            {/* Manage button for organizer/admin */}
            {(String(user?._id) === String(event.organizer?._id) || user?.role === "admin") && (
              <Link
                to={`/events/${event._id}/dashboard`}
                className="btn btn-dark w-100 mb-2"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
                ⚙️ Manage Event
              </Link>
            )}

            {/* Action button */}
            <SidebarButton
              event={event} user={user}
              onRegister={() => registerForEvent(event._id)}
              onUnregister={() => unregisterForEvent(event._id)}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default EventDetails
