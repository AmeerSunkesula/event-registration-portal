import { Link, useNavigate } from "react-router-dom"
import { getImageUrl } from "../utils/imageUrl"

const POSTER_PH = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='200' viewBox='0 0 600 200'><rect width='100%' height='100%' fill='%23303b57'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-weight='bold' font-size='32' fill='%23debc58'>EVENT</text></svg>"

// Format date helper
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric",
})

// Smart register/unregister button
function ActionButton({ ev, user, onRegister, onUnregister }) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <button className="btn btn-sm w-100"
        style={{ backgroundColor: "var(--theme-navy)", color: "#fff", fontFamily: "var(--font-heading)" }}
        onClick={() => navigate("/login")}>
        Login to Register
      </button>
    )
  }

  const spotsLeft    = ev.capacity - (ev.registeredStudents?.length ?? 0)
  const isRegistered = ev.registeredStudents?.some(
    (id) => String(id) === String(user?._id)
  )
  const soldOut  = spotsLeft <= 0 && !isRegistered
  const daysLeft = (new Date(ev.date) - Date.now()) / (1000 * 3600 * 24)

  if (isRegistered) {
    if (daysLeft <= 7) {
      return (
        <button className="btn btn-sm w-100" disabled
          style={{ backgroundColor: "#aaa", color: "#fff", fontFamily: "var(--font-heading)" }}>
          🔒 Locked (&lt; 1 Week)
        </button>
      )
    }
    return (
      <button className="btn btn-sm w-100"
        style={{ backgroundColor: "var(--theme-rust)", color: "#fff", fontFamily: "var(--font-heading)" }}
        onClick={() => onUnregister(ev._id)}>
        Unsubscribe
      </button>
    )
  }

  if (soldOut) {
    return (
      <button className="btn btn-sm w-100" disabled
        style={{ backgroundColor: "#aaa", color: "#fff", fontFamily: "var(--font-heading)" }}>
        Sold Out
      </button>
    )
  }

  return (
    <button className="btn btn-sm w-100"
      style={{ backgroundColor: "var(--theme-navy)", color: "#fff", fontFamily: "var(--font-heading)" }}
      onClick={() => onRegister(ev._id)}>
      Register
    </button>
  )
}

function EventCard({ ev, user, onRegister, onUnregister }) {
  const isMain    = ev.eventType === "main"
  const spotsLeft = ev.capacity - (ev.registeredStudents?.length ?? 0)
  const soldOut   = !isMain && spotsLeft <= 0

  return (
    <div className="card auth-card h-100">
      <img
        src={getImageUrl(ev.poster) || POSTER_PH}
        alt={ev.title}
        className="card-img-top"
        style={{ height: 140, objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        {/* Category badge */}
        <span className="badge mb-2"
          style={{ backgroundColor: "var(--theme-sage)", color: "#fff",
                   fontSize: "0.7rem", alignSelf: "flex-start" }}>
          {ev.category}
        </span>

        {/* Festival badge */}
        {isMain && (
          <span className="badge mb-2"
            style={{ backgroundColor: "var(--theme-navy)", color: "var(--theme-mustard)",
                     fontSize: "0.7rem", alignSelf: "flex-start" }}>
            🎪 Festival
          </span>
        )}

        <h6 className="fw-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          {ev.title}
        </h6>
        <small className="text-muted mb-1">📍 {ev.venue}</small>

        {/* Smart date range or single date */}
        <small className="text-muted mb-2">
          {ev.endDate
            ? <>📅 {fmt(ev.date)} – {fmt(ev.endDate)}</>
            : <>📅 {fmt(ev.date)}</>}
        </small>

        {/* Capacity badge — hidden for main events */}
        {!isMain && (
          <span className="badge mb-3"
            style={{
              backgroundColor: soldOut ? "var(--theme-rust)" : "var(--theme-mustard)",
              color: "var(--theme-navy)", alignSelf: "flex-start",
            }}>
            {soldOut ? "Sold Out" : `${spotsLeft} spots left`}
          </span>
        )}

        <div className="mt-auto d-grid gap-2">
          {isMain ? (
            // Festival CTA — no register button
            <Link
              to={`/events/${ev._id}`}
              className="btn btn-sm w-100"
              style={{ backgroundColor: "var(--theme-mustard)", color: "var(--theme-navy)",
                       fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              View Fest Details
            </Link>
          ) : (
            <>
              <ActionButton ev={ev} user={user}
                onRegister={onRegister} onUnregister={onUnregister} />
              <Link
                to={`/events/${ev._id}`}
                className="btn btn-outline-secondary btn-sm w-100">
                View Details
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventCard
