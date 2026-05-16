import { useState } from "react"
import { useFormik } from "formik"
import { Link } from "react-router-dom"
import { loginInitialValues, validateLogin } from "../utils/formValidators"
import { useAuth } from "../hooks/useAuth"

function Login() {
  const { serverError, loginUser, requestPasswordReset } = useAuth()
  const [resetEmail, setResetEmail] = useState("")
  const [resetMsg, setResetMsg] = useState({ type: "", text: "" })

  const handlePasswordReset = async () => {
    await requestPasswordReset(resetEmail, setResetMsg)
  }

  const formik = useFormik({
    initialValues: loginInitialValues,
    validate: validateLogin,
    onSubmit: async (values, { setSubmitting }) => {
      await loginUser(values, setSubmitting)
    },
  })

  // Helper — touched + error on field
  const isInvalid = (field) => formik.touched[field] && formik.errors[field]

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card auth-card shadow-sm border-0"
        style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="portal-brand">Event Registration Portal</h2>
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

            <div className="d-flex justify-content-end mb-4">
              <button 
                type="button" 
                className="btn btn-link p-0 text-decoration-none small" 
                data-bs-toggle="modal" 
                data-bs-target="#forgotPasswordModal">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={formik.isSubmitting}>
              {formik.isSubmitting ?
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  />
                  Signing in…
                </>
              : "Sign in"}
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

      {/* Forgot Password Modal */}
      <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content auth-card">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Request Password Reset</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-2">
              <p className="mb-3 small text-muted">Enter your account email. An admin will process the request and reset your password to the system default.</p>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              {resetMsg.text && (
                <div className={`alert alert-${resetMsg.type} py-1 mt-2 mb-0 small`}>{resetMsg.text}</div>
              )}
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handlePasswordReset} disabled={!resetEmail}>
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login
