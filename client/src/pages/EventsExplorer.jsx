import { useState } from "react"
import { useEventsData } from "../hooks/useEventsData"
import EventCard from "../components/EventCard"
import MainEventBanner from "../components/MainEventBanner"

function EventsExplorer() {
  const [activeTab, setActiveTab] = useState("day")

  const {
    loading, error,
    standaloneEvents, mainEvents,
    searchQuery, setSearch,
    selectedCategory, setCategory,
    categories, registerForEvent, unregisterForEvent, user,
  } = useEventsData()

  return (
    <div className="container mt-4 mb-5">

      {/* ── Page header ───────────────────────────── */}
      <h2 className="mb-4" style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
        Explore Events
      </h2>

      {/* ── Search + Category controls ────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input type="search" className="form-control"
            placeholder="Search by title or venue…"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select"
            value={selectedCategory}
            onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Tab pills ─────────────────────────────── */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "day" ? "active" : ""}`}
            style={activeTab === "day"
              ? { backgroundColor: "var(--theme-navy)", fontFamily: "var(--font-heading)" }
              : { color: "var(--theme-navy)", fontFamily: "var(--font-heading)" }}
            onClick={() => setActiveTab("day")}>
            🎪 Festivals &amp; Day Events
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link ${activeTab === "standalone" ? "active" : ""}`}
            style={activeTab === "standalone"
              ? { backgroundColor: "var(--theme-navy)", fontFamily: "var(--font-heading)" }
              : { color: "var(--theme-navy)", fontFamily: "var(--font-heading)" }}
            onClick={() => setActiveTab("standalone")}>
            📋 Standalone Events
          </button>
        </li>
      </ul>

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" style={{ color: "var(--theme-navy)" }}>
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {/* ── Day / Festival tab ────────────────── */}
          {activeTab === "day" && (
            <section>
              {mainEvents.length > 0
                ? mainEvents.map((main) => (
                    <MainEventBanner key={main._id} main={main} user={user}
                      onRegister={registerForEvent} onUnregister={unregisterForEvent} />
                  ))
                : (
                  <div className="text-center py-5 text-muted">
                    <p className="fs-5">No festival events found.</p>
                    <small>Try adjusting your search or filter.</small>
                  </div>
                )}
            </section>
          )}

          {/* ── Standalone tab ────────────────────── */}
          {activeTab === "standalone" && (
            <section>
              {standaloneEvents.length > 0 ? (
                <div className="row g-4">
                  {standaloneEvents.map((ev) => (
                    <div key={ev._id} className="col-sm-6 col-lg-4">
                      <EventCard ev={ev} user={user}
                        onRegister={registerForEvent} onUnregister={unregisterForEvent} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <p className="fs-5">No standalone events found.</p>
                  <small>Try adjusting your search or filter.</small>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default EventsExplorer
