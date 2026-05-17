import { useState } from "react"
import { useEventsData } from "../hooks/useEventsData"
import EventCard from "../components/EventCard"

function EventsExplorer() {
  const [activeTab, setActiveTab] = useState("all")

  const {
    loading, error,
    allEvents, standaloneEvents, mainEvents,
    searchQuery, setSearch,
    selectedCategory, setCategory,
    categories, registerForEvent, unregisterForEvent, user,
  } = useEventsData()

  // Resolve displayed list per active tab
  const displayEvents =
    activeTab === "festivals"  ? mainEvents :
    activeTab === "standalone" ? standaloneEvents :
    allEvents

  return (
    <div className="container mt-4 mb-5">

      {/* Page header */}
      <h2 className="mb-4" style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
        Explore Events
      </h2>

      {/* Search + Category controls */}
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

      {/* Tab pills */}
      <ul className="nav nav-pills mb-4">
        {[
          { key: "all",        label: "🌐 All Events" },
          { key: "festivals",  label: "🎪 Festivals" },
          { key: "standalone", label: "📋 Standalone" },
        ].map(({ key, label }) => (
          <li key={key} className="nav-item me-2">
            <button
              className={`nav-link ${activeTab === key ? "active" : ""}`}
              style={activeTab === key
                ? { backgroundColor: "var(--theme-navy)", fontFamily: "var(--font-heading)" }
                : { color: "var(--theme-navy)", fontFamily: "var(--font-heading)" }}
              onClick={() => setActiveTab(key)}>
              {label}
            </button>
          </li>
        ))}
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

      {/* Events grid */}
      {!loading && !error && (
        <>
          {displayEvents.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {displayEvents.map((ev) => (
                <div key={ev._id} className="col">
                  <EventCard ev={ev} user={user}
                    onRegister={registerForEvent}
                    onUnregister={unregisterForEvent} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <p className="fs-5">No events found.</p>
              <small>Try adjusting your search or filter.</small>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default EventsExplorer
