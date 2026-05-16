import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { loginSuccess } from "../features/auth/authSlice"
import {
  registerInitialValues,
  validateRegister,
} from "../utils/formValidators"

const API = "http://localhost:5000/api/auth/register"

const DEPARTMENTS = [
  "Computer Engineering",
  "Mechanical",
  "Electrical",
  "Civil",
  "Other",
]

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")

  const formik = useFormik({
    initialValues: registerInitialValues,
    validate: validateRegister,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("")
      try {
        const { data } = await axios.post(API, values)
        
        if (data.token) {
          // Store auth in Redux
          dispatch(loginSuccess({ user: data.user, token: data.token }))
          navigate("/")
        } else {
          // Staff pending approval
          alert(data.message)
          navigate("/login")
        }
      } catch (err) {
        // Show backend error message
        setServerError(err.response?.data?.message || "Registration failed")
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Touched + error on field
  const isInvalid = (field) => formik.touched[field] && formik.errors[field]

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card auth-card mt-5">
            <div className="card-body p-4 p-md-5">
              <h2 className="portal-brand">Event Registration Portal</h2>
              <h1 className="h4 fw-bold text-center mb-1">Create an account</h1>
              <p className="text-muted text-center mb-4 small">
                Student Registration Portal
              </p>

              {/* Server error alert */}
              {serverError && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {serverError}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Full name */}
                <div className="mb-3">
                  <label htmlFor="reg-name" className="form-label fw-medium">
                    Full name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    className={`form-control ${isInvalid("name") ? "is-invalid" : ""}`}
                    placeholder="e.g. Ameer"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoFocus
                  />
                  {isInvalid("name") && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="reg-email" className="form-label fw-medium">
                    Email address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    className={`form-control ${isInvalid("email") ? "is-invalid" : ""}`}
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {isInvalid("email") && (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label
                    htmlFor="reg-password"
                    className="form-label fw-medium">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    name="password"
                    className={`form-control ${isInvalid("password") ? "is-invalid" : ""}`}
                    placeholder="Min. 6 characters"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {isInvalid("password") && (
                    <div className="invalid-feedback">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Role selection */}
                <div className="mb-3">
                  <label htmlFor="reg-role" className="form-label fw-medium">Role</label>
                  <select
                    id="reg-role"
                    name="role"
                    className="form-select"
                    value={formik.values.role}
                    onChange={formik.handleChange}>
                    <option value="student">Student</option>
                    <option value="staff">Staff / Organizer</option>
                  </select>
                </div>

                {formik.values.role === "student" && (
                  <div className="mb-3">
                    <label htmlFor="reg-roll" className="form-label fw-medium">
                      Roll number
                    </label>
                    <input
                      id="reg-roll"
                      type="text"
                      name="rollNumber"
                      className={`form-control ${isInvalid("rollNumber") ? "is-invalid" : ""}`}
                      placeholder="e.g. 26000-XX-000"
                      value={formik.values.rollNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {isInvalid("rollNumber") && (
                      <div className="invalid-feedback">
                        {formik.errors.rollNumber}
                      </div>
                    )}
                  </div>
                )}

                {formik.values.role !== "admin" && (
                  <div className="mb-4">
                    <label htmlFor="reg-dept" className="form-label fw-medium">
                      Department
                    </label>
                    <select
                      id="reg-dept"
                      name="department"
                      className={`form-select ${isInvalid("department") ? "is-invalid" : ""}`}
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                      <option value="" disabled>
                        Select department
                      </option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {isInvalid("department") && (
                      <div className="invalid-feedback">
                        {formik.errors.department}
                      </div>
                    )}
                  </div>
                )}

                {formik.values.role === "staff" && (
                  <div className="form-check mb-4">
                    <input
                      className={`form-check-input ${isInvalid("acknowledgementAccepted") ? "is-invalid" : ""}`}
                      type="checkbox"
                      id="reg-ack"
                      name="acknowledgementAccepted"
                      checked={formik.values.acknowledgementAccepted}
                      onChange={formik.handleChange}
                    />
                    <label className="form-check-label small text-muted" htmlFor="reg-ack">
                      I acknowledge that staff accounts require Admin approval before I can log in.
                    </label>
                    {isInvalid("acknowledgementAccepted") && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.acknowledgementAccepted}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button */}
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
                      Creating account…
                    </>
                  : "Register"}
                </button>
              </form>

              <p className="text-center text-muted small mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
