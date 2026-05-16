import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../features/auth/authSlice"

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav
      className="navbar navbar-expand-md shadow-sm sticky-top"
      style={{ backgroundColor: "var(--theme-navy)", zIndex: 1050 }}>
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold brand-logo"
          style={{
            fontFamily: "var(--font-brand)",
            color: "var(--theme-mustard)",
            letterSpacing: "0.05em",
            fontSize: "1rem",
          }}
          to="/">
          Event Registration Portal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          aria-controls="navMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "var(--theme-mustard)" }}>
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMain">
          {/* Left links */}
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--font-heading)",
                    }}
                    to="/events">
                    Explore
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "var(--font-heading)",
                    }}
                    to="/create-event">
                    Create Event
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right controls */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {isAuthenticated ?
              <>
                <li className="nav-item">
                  <span
                    className="navbar-text small me-1"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "var(--font-body)",
                    }}>
                    Welcome,{" "}
                    <strong style={{ color: "var(--theme-mustard)" }}>
                      {user?.name?.split(" ")[0]}
                    </strong>
                  </span>
                </li>
                {user?.role === "admin" && (
                  <li className="nav-item">
                    <Link
                      className="btn btn-sm me-2"
                      style={{
                        backgroundColor: "var(--theme-sage)",
                        color: "var(--theme-navy)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                      }}
                      to="/admin">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link
                    className="btn btn-sm"
                    style={{
                      border: "1px solid var(--theme-mustard)",
                      color: "var(--theme-mustard)",
                      fontFamily: "var(--font-heading)",
                    }}
                    to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "var(--theme-mustard)",
                      color: "var(--theme-navy)",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                    }}
                    onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            : <>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm btn-outline-light"
                    to="/login"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "var(--theme-mustard)",
                      color: "var(--theme-navy)",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                    }}
                    to="/register">
                    Register
                  </Link>
                </li>
              </>
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
