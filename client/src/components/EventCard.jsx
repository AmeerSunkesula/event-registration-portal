import { Link, useNavigate } from "react-router-dom"

const POSTER_PH = "https://placehold.co/600x200/303b57/debc58?text=Event"
// Handle raw filename OR relative path stored in DB
const posterSrc = (poster) => poster
  ? (poster.includes("/")
      ? `http://localhost:5000/${poster}`
      : `http://localhost:5000/uploads/events/${poster}`)
  : POSTER_PH

// Smart register/unregister button
function ActionButton({ ev, user, onRegister, onUnregister }) {
  const navigate = useNavigate()
  
  if (!user) {
    return (
      <button className="btn w-100" 
        style={{ backgroundColor: "var(--theme-navy)", color: "#fff", fontFamily: "var(--font-heading)" }}
        onClick={() => navigate("/login")}>
        Login to Register
      </button>
    )
  }

  const isMain = ev.eventType === "main"
  const spotsLeft    = ev.capacity - (ev.registeredStudents?.length ?? 0)
  const isRegistered = ev.registeredStudents?.some(
    (id) => String(id) === String(user?._id)
  )
  const soldOut  = !isMain && spotsLeft <= 0 && !isRegistered
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
        style={{ backgroundColor: "var(--theme-rust)", color: "#fff",
                 fontFamily: "var(--font-heading)" }}
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
      style={{ backgroundColor: "var(--theme-navy)", color: "#fff",
               fontFamily: "var(--font-heading)" }}
      onClick={() => onRegister(ev._id)}>
      Register
    </button>
  )
}

function EventCard({ ev, user, onRegister, onUnregister }) {
  const isMain = ev.eventType === "main"
  const spotsLeft = ev.capacity - (ev.registeredStudents?.length ?? 0)
  const soldOut   = !isMain && spotsLeft <= 0

  return (
    <div className="card auth-card h-100">
      <img
        src={posterSrc(ev.poster)}
        alt={ev.title}
        className="card-img-top"
        style={{ height: 140, objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge mb-2"
          style={{ backgroundColor: "var(--theme-sage)", color: "#fff",
                   fontSize: "0.7rem", alignSelf: "flex-start" }}>
          {ev.category}
        </span>
        <h6 className="fw-bold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
          {ev.title}
        </h6>
        <small className="text-muted mb-1">📍 {ev.venue}</small>
        <small className="text-muted mb-2">
          📅 {new Date(ev.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </small>
        {!isMain && (
          <span className="badge mb-3"
            style={{
              backgroundColor: soldOut ? "var(--theme-rust)" : "var(--theme-mustard)",
              color: "var(--theme-navy)", alignSelf: "flex-start",
            }}>
            {soldOut ? "Sold Out" : `${spotsLeft} spots left`}
          </span>
        )}

        <div className="mt-auto">
          <ActionButton ev={ev} user={user}
            onRegister={onRegister} onUnregister={onUnregister} />
          <Link
            to={`/events/${ev._id}`}
            className="btn btn-outline-secondary btn-sm w-100 mt-2">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
