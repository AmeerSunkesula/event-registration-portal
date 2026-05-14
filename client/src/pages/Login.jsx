import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { loginSuccess } from "../features/auth/authSlice"

const API = "http://localhost:5000/api/auth/login"

// Basic email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")

  // Inline validate — no Yup
  const validate = (values) => {
    const errors = {}
    if (!values.email) {
      errors.email = "Email is required"
    } else if (!EMAIL_RE.test(values.email)) {
      errors.email = "Enter a valid email"
    }
    if (!values.password) {
      errors.password = "Password is required"
    }
    return errors
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("")
      try {
        const { data } = await axios.post(API, values)
        // Store auth in Redux
        dispatch(loginSuccess({ user: data.user, token: data.token }))
        navigate("/")
      } catch (err) {
        // Show backend error message
        setServerError(err.response?.data?.message || "Login failed")
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Helper — touched + error on field
  const isInvalid = (field) =>
    formik.touched[field] && formik.errors[field]

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-sm border-0"
        style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold text-center mb-1">Welcome back</h1>
          <p className="text-muted text-center mb-4 small">
            Sign in to your portal account
          </p>

          {/* Server error alert */}
          {serverError && (
            <div className="alert alert-danger py-2 small" role="alert">
              {serverError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-medium">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className={`form-control ${isInvalid("email") ? "is-invalid" : ""}`}
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoFocus
              />
              {isInvalid("email") && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="login-password" className="form-label fw-medium">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                className={`form-control ${isInvalid("password") ? "is-invalid" : ""}`}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {isInvalid("password") && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-muted small mt-4 mb-0">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
