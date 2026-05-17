import { Link } from "react-router-dom"

// Registered events list card
function MyRegisteredEvents({ events, loading, error }) {
  return (
    <div className="card auth-card p-4">
      <h4 className="portal-brand mb-3">My Registered Events</h4>

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm"
            style={{ color: "var(--theme-navy)" }} role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <p className="text-muted small mb-0">No registered events yet.</p>
      )}

      {!loading && events.length > 0 && (
        <ul className="list-group list-group-flush">
          {events.map((ev) => (
            <li key={ev._id} className="list-group-item px-0">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                    {ev.title}
                  </p>
                  <small className="text-muted">{ev.venue}</small>
                </div>
                <span className="badge rounded-pill"
                  style={{ backgroundColor: "var(--theme-mustard)",
                           color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                  {new Date(ev.date).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyRegisteredEvents
