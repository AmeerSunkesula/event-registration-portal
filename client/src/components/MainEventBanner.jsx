import EventCard from "./EventCard"
import { resolveImageUrl } from "../utils/imageUrl"

const POSTER_PH = "https://placehold.co/1200x300/303b57/debc58?text=Main+Event"

function MainEventBanner({ main, user, onRegister, onUnregister }) {
  return (
    <div className="card auth-card mb-5"
      style={{ borderTop: "5px solid var(--theme-navy)" }}>

      {/* Banner poster */}
      <img
        src={resolveImageUrl(main.poster, POSTER_PH)}
        alt={main.title}
        className="card-img-top"
        style={{ height: 220, objectFit: "cover" }}
      />

      <div className="card-body">
        {/* Badges */}
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="badge"
            style={{ backgroundColor: "var(--theme-navy)", fontSize: "0.75rem" }}>
            Main Event
          </span>
          <span className="badge"
            style={{ backgroundColor: "var(--theme-sage)", fontSize: "0.7rem" }}>
            {main.category}
          </span>
        </div>

        {/* Title & meta */}
        <h4 style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
          {main.title}
        </h4>
        <p className="text-muted small mb-1">📍 {main.venue}</p>
        <p className="text-muted small mb-3">
          📅 {new Date(main.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
        <p className="mb-4" style={{ fontSize: "0.9rem" }}>{main.description}</p>

        {/* Sub-events grid */}
        {main.children?.length > 0 ? (
          <>
            <h6 className="fw-semibold mb-3"
              style={{
                fontFamily: "var(--font-heading)", color: "var(--theme-navy)",
                borderBottom: "2px solid var(--theme-mustard)", paddingBottom: 6,
              }}>
              Sub-Events ({main.children.length})
            </h6>
            <div className="row g-3">
              {main.children.map((child) => (
                <div key={child._id} className="col-sm-6 col-lg-4">
                  <EventCard ev={child} user={user}
                    onRegister={onRegister} onUnregister={onUnregister} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted small fst-italic">No sub-events added yet.</p>
        )}
      </div>
    </div>
  )
}

export default MainEventBanner
