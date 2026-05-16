import { Link } from "react-router-dom"

function PortalFooter() {
  return (
    <footer className="mt-auto py-4" style={{ backgroundColor: "var(--theme-navy)", color: "#fff" }}>
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-3 mb-md-0">
          <h5 className="fw-bold mb-1" style={{ fontFamily: "var(--font-brand)" }}>Event Registration Portal</h5>
          <p className="small text-white-50 mb-0" style={{ maxWidth: "400px" }}>
            A centralized platform for seamless event discovery, secure registrations, and transparent coordinator management.
          </p>
        </div>
        <div className="d-flex gap-4">
          <Link to="/" className="text-white text-decoration-none small">Home</Link>
          <Link to="/events" className="text-white text-decoration-none small">Explore</Link>
          <Link to="/profile" className="text-white text-decoration-none small">Dashboard</Link>
        </div>
      </div>
    </footer>
  )
}

export default PortalFooter
