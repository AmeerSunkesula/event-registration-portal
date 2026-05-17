function FeatureGrid() {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <div className="fs-1 mb-3">🎓</div>
              <h5 className="fw-bold" style={{ fontFamily: "var(--font-heading)" }}>For Students</h5>
              <p className="text-muted mb-0">Seamless Registrations & Cancellations.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <div className="fs-1 mb-3">🛠️</div>
              <h5 className="fw-bold" style={{ fontFamily: "var(--font-heading)" }}>For Organizers</h5>
              <p className="text-muted mb-0">Private Command Centers.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4">
              <div className="fs-1 mb-3">🤝</div>
              <h5 className="fw-bold" style={{ fontFamily: "var(--font-heading)" }}>For Staff</h5>
              <p className="text-muted mb-0">Double-Opt-In Coordinator Workflows.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid
