import { Link } from "react-router-dom"
import { useCoordinatorPanel } from "../../hooks/useCoordinatorPanel"

// Staff hub component — staff role only
function CoordinatorPanel() {
  const { pendingRequests, assignedEvents, acceptRequest, rejectRequest, loading } =
    useCoordinatorPanel()

  return (
    <div className="card auth-card p-4 mt-4">
      <h4 className="portal-brand mb-4">🛠️ Staff Hub</h4>

      {/* Pending requests */}
      <h6 className="fw-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--theme-navy)" }}>
        Pending Coordinator Requests
      </h6>

      {loading && (
        <div className="text-center py-2">
          <div className="spinner-border spinner-border-sm" style={{ color: "var(--theme-navy)" }} />
        </div>
      )}

      {!loading && pendingRequests.length === 0 ? (
        <p className="text-muted small mb-4">No pending requests.</p>
      ) : (
        <ul className="list-group list-group-flush mb-4">
          {pendingRequests.map((ev) => (
            <li key={ev._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  {ev.title}
                </p>
                <small className="text-muted">{ev.venue}</small>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => acceptRequest(ev._id)}>
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => rejectRequest(ev._id)}>
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Assigned events */}
      <h6 className="fw-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--theme-navy)" }}>
        My Assigned Events
      </h6>

      {!loading && assignedEvents.length === 0 ? (
        <p className="text-muted small mb-0">Not assigned to any events yet.</p>
      ) : (
        <ul className="list-group list-group-flush">
          {assignedEvents.map((ev) => (
            <li key={ev._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                  {ev.title}
                </p>
                <small className="text-muted">{ev.venue}</small>
              </div>
              <Link
                to={`/events/${ev._id}/dashboard`}
                className="btn btn-sm btn-outline-secondary">
                Dashboard
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CoordinatorPanel
