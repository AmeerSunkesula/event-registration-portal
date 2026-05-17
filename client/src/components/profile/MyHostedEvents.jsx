import { Link } from "react-router-dom"

// Hosted/organized events card — hidden for staff
function MyHostedEvents({ events, loading }) {
  return (
    <div className="card auth-card p-4 mt-4">
      <h4 className="portal-brand mb-3">Events I'm Hosting</h4>

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm"
            style={{ color: "var(--theme-navy)" }} role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      )}

      {!loading && events.length === 0 && (
        <p className="text-muted small mb-0">You aren't hosting any events.</p>
      )}

      {!loading && events.length > 0 && (
        <ul className="list-group list-group-flush">
          {events.map((ev) => (
            <li key={ev._id} className="list-group-item px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                    {ev.title}
                  </p>
                  <small className="text-muted">{ev.venue}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge rounded-pill"
                    style={{ backgroundColor: "var(--theme-mustard)",
                             color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                    {new Date(ev.date).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/events/${ev._id}/dashboard`}
                    className="btn btn-sm"
                    style={{ border: "1px solid var(--theme-navy)",
                             color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                    Manage
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyHostedEvents
