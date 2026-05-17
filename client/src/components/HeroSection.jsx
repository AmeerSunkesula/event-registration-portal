import { Link } from "react-router-dom"

function HeroSection() {
  return (
    <section className="bg-light py-5 text-center">
      <div className="container py-5">
        <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
          Discover, Register, and Manage Campus Events.
        </h1>
        <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
          The all-in-one portal for students, staff, and organizers.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/events" className="btn btn-lg" style={{ backgroundColor: "var(--theme-mustard)", color: "var(--theme-navy)", fontWeight: 600 }}>
            Explore Events
          </Link>
          <Link to="/create-event" className="btn btn-lg btn-outline-dark">
            Host an Event
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
