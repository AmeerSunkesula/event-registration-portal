import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useFormik } from "formik"
import { logout } from "../features/auth/authSlice"
import { useProfileData } from "../hooks/useProfileData"
import { passwordChangeSchema } from "../utils/profileValidators"

const AVATAR_BASE  = "http://localhost:5000/"
const PLACEHOLDER  = "https://ui-avatars.com/api/?background=303b57&color=fff&size=128&bold=true"
const DEPARTMENTS  = ["Computer Engineering", "Mechanical", "Electrical", "Civil", "Other"]

function Profile() {
  const { state, formik, fileInputRef, handleFileChange, user, handleCoordinatorReq, token } = useProfileData()
  const { eventsLoading, userEvents, organizedEvents, eventsError, avatarLoading, avatarError } = state

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [passMsg, setPassMsg] = useState({ type: "", text: "" })

  const [deletePass, setDeletePass] = useState("")
  const [deleteError, setDeleteError] = useState("")

  const isInvalid = (field) => formik.touched[field] && formik.errors[field]

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: passwordChangeSchema,
    onSubmit: async (values, { resetForm }) => {
      setPassMsg({ type: "", text: "" })
      try {
        await axios.put(
          "http://localhost:5000/api/users/change-password",
          { oldPassword: values.oldPassword, newPassword: values.newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setPassMsg({ type: "success", text: "Password updated successfully!" })
        resetForm()
      } catch (err) {
        setPassMsg({ type: "danger", text: err.response?.data?.message || "Failed to update password" })
      }
    }
  })

  const isPassInvalid = (field) => passwordFormik.touched[field] && passwordFormik.errors[field]

  const handleDeleteAccount = async () => {
    setDeleteError("")
    try {
      await axios.post(
        "http://localhost:5000/api/users/delete-account",
        { password: deletePass },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Cleanup UI
      document.querySelector('.modal-backdrop')?.remove()
      document.body.classList.remove('modal-open')
      
      dispatch(logout())
      navigate("/login")
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account")
    }
  }

  // Avatar src — filename or placeholder
  const avatarSrc = user?.profilePicture
    ? `${AVATAR_BASE}${user.profilePicture}`
    : `${PLACEHOLDER}&name=${encodeURIComponent(user?.name ?? "U")}`

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">

        {/* ── Left: Avatar ─────────────────────────────── */}
        <div className="col-md-4">
          <div className="card auth-card text-center p-4">

            <img
              src={avatarSrc}
              alt="Profile avatar"
              className="rounded-circle mx-auto d-block"
              style={{ width: 120, height: 120, objectFit: "cover",
                       border: "4px solid var(--theme-mustard)" }}
            />

            {/* Name + role */}
            <h5 className="mt-3 mb-0">{user?.name}</h5>
            <span className="badge mt-1"
              style={{ backgroundColor: "var(--theme-sage)", fontSize: "0.75rem" }}>
              {user?.role ?? "student"}
            </span>

            {/* Roll number sub-text */}
            {user?.rollNumber && (
              <p className="text-muted small mt-2 mb-0">{user.rollNumber}</p>
            )}

            {/* Avatar error */}
            {avatarError && (
              <div className="alert alert-danger py-1 small mt-3">{avatarError}</div>
            )}

            {/* Hidden file picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleFileChange}
            />

            {/* Upload trigger */}
            <button
              className="btn btn-outline-primary mt-3 w-100"
              disabled={avatarLoading}
              onClick={() => fileInputRef.current?.click()}>
              {avatarLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Uploading…
                </>
              ) : "Change Photo"}
            </button>

          </div>
        </div>

        {/* ── Right column ─────────────────────────────── */}
        <div className="col-md-8">

          {/* Profile details card */}
          <div className="card auth-card p-4 mb-4">
            <h4 className="portal-brand mb-3">Profile Details</h4>

            <form onSubmit={formik.handleSubmit} noValidate>
              <div className="row g-3">

                {/* Name */}
                <div className="col-12">
                  <label htmlFor="prof-name" className="form-label">Full name</label>
                  <input
                    id="prof-name"
                    name="name"
                    type="text"
                    className={`form-control ${isInvalid("name") ? "is-invalid" : ""}`}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {isInvalid("name") && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </div>

                {/* Email — read-only for students/staff, editable for admins */}
                <div className="col-12">
                  <label htmlFor="prof-email" className="form-label">Email address</label>
                  <input
                    id="prof-email"
                    name="email"
                    type="email"
                    className={`form-control ${isInvalid("email") ? "is-invalid" : ""}`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={user?.role !== "admin"}
                  />
                  {isInvalid("email") && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </div>

                {/* Roll number */}
                {user?.role === "student" && (
                  <div className="col-sm-6">
                    <label htmlFor="prof-roll" className="form-label">Roll number</label>
                    <input
                      id="prof-roll"
                      name="rollNumber"
                      type="text"
                      className={`form-control ${isInvalid("rollNumber") ? "is-invalid" : ""}`}
                      value={formik.values.rollNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {isInvalid("rollNumber") && (
                      <div className="invalid-feedback">{formik.errors.rollNumber}</div>
                    )}
                  </div>
                )}

                {/* Department dropdown */}
                {user?.role !== "admin" && (
                  <div className="col-sm-6">
                    <label htmlFor="prof-dept" className="form-label">Department</label>
                    <select
                      id="prof-dept"
                      name="department"
                      className={`form-select ${isInvalid("department") ? "is-invalid" : ""}`}
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}>
                      <option value="" disabled>Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    {isInvalid("department") && (
                      <div className="invalid-feedback">{formik.errors.department}</div>
                    )}
                  </div>
                )}

              </div>

              <button
                type="submit"
                className="btn btn-primary mt-4"
                disabled={formik.isSubmitting}>
                {formik.isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Saving…
                  </>
                ) : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Registered events card */}
          <div className="card auth-card p-4">
            <h4 className="portal-brand mb-3">My Registered Events</h4>

            {/* Loading */}
            {eventsLoading && (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm"
                  style={{ color: "var(--theme-navy)" }} role="status">
                  <span className="visually-hidden">Loading…</span>
                </div>
              </div>
            )}

            {/* Error */}
            {eventsError && (
              <div className="alert alert-danger py-2 small">{eventsError}</div>
            )}

            {/* Empty state */}
            {!eventsLoading && !eventsError && userEvents.length === 0 && (
              <p className="text-muted small mb-0">No registered events yet.</p>
            )}

            {/* Event list */}
            {!eventsLoading && userEvents.length > 0 && (
              <ul className="list-group list-group-flush">
                {userEvents.map((ev) => (
                  <li key={ev._id} className="list-group-item px-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="mb-0 fw-semibold"
                          style={{ fontFamily: "var(--font-heading)" }}>
                          {ev.title}
                        </p>
                        <small className="text-muted">{ev.venue}</small>
                      </div>
                      <span
                        className="badge rounded-pill"
                        style={{ backgroundColor: "var(--theme-mustard)",
                                 color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                        {new Date(ev.date).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Events I'm Hosting card (Hidden for Staff unless they organized it somehow) */}
          {user?.role !== "staff" && (
            <div className="card auth-card p-4 mt-4">
              <h4 className="portal-brand mb-3">Events I'm Hosting</h4>

              {eventsLoading && (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm"
                    style={{ color: "var(--theme-navy)" }} role="status">
                    <span className="visually-hidden">Loading…</span>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!eventsLoading && organizedEvents.length === 0 && (
                <p className="text-muted small mb-0">You aren't hosting any events.</p>
              )}

              {/* Hosted event list */}
              {!eventsLoading && organizedEvents.length > 0 && (
                <ul className="list-group list-group-flush">
                  {organizedEvents.map((ev) => (
                    <li key={ev._id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 fw-semibold"
                            style={{ fontFamily: "var(--font-heading)" }}>
                            {ev.title}
                          </p>
                          <small className="text-muted">{ev.venue}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge rounded-pill"
                            style={{ backgroundColor: "var(--theme-mustard)",
                                    color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                            {new Date(ev.date).toLocaleDateString()}
                          </span>
                          <a href={`/events/${ev._id}/dashboard`}
                            className="btn btn-sm"
                            style={{ border: "1px solid var(--theme-navy)",
                                    color: "var(--theme-navy)", fontSize: "0.75rem" }}>
                            Manage
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* STAFF SECTIONS */}
          {user?.role === "staff" && (
            <>
              {/* Coordinator Requests */}
              <div className="card auth-card p-4 mt-4">
                <h4 className="portal-brand mb-3">Coordinator Requests</h4>
                {user.coordinatorRequests?.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {user.coordinatorRequests.map(req => (
                      <li key={req._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>{req.title}</p>
                          <small className="text-muted">{req.venue}</small>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success fw-semibold" onClick={() => handleCoordinatorReq(req._id, "accept")}>
                            Accept
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleCoordinatorReq(req._id, "reject")}>
                            Reject
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">No pending coordinator requests.</p>
                )}
              </div>

              {/* Events I'm Coordinating */}
              <div className="card auth-card p-4 mt-4">
                <h4 className="portal-brand mb-3">Events I'm Coordinating</h4>
                {user.coordinatedEvents?.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {user.coordinatedEvents.map(ev => (
                      <li key={ev._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 fw-semibold" style={{ fontFamily: "var(--font-heading)" }}>{ev.title}</p>
                          <small className="text-muted">{ev.venue}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge rounded-pill bg-dark">
                            {new Date(ev.date).toLocaleDateString()}
                          </span>
                          <a href={`/events/${ev._id}`} className="btn btn-sm btn-outline-secondary">
                            View Event
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">You are not coordinating any events yet.</p>
                )}
              </div>
            </>
          )}

          {/* ── Account Settings ─────────────────────────────── */}
          <div className="card auth-card p-4 mt-4">
            <h4 className="portal-brand mb-3">Account Settings</h4>
            
            <form onSubmit={passwordFormik.handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    className={`form-control ${isPassInvalid("oldPassword") ? "is-invalid" : ""}`}
                    value={passwordFormik.values.oldPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {isPassInvalid("oldPassword") && (
                    <div className="invalid-feedback">{passwordFormik.errors.oldPassword}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className={`form-control ${isPassInvalid("newPassword") ? "is-invalid" : ""}`}
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {isPassInvalid("newPassword") && (
                    <div className="invalid-feedback">{passwordFormik.errors.newPassword}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${isPassInvalid("confirmPassword") ? "is-invalid" : ""}`}
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  {isPassInvalid("confirmPassword") && (
                    <div className="invalid-feedback">{passwordFormik.errors.confirmPassword}</div>
                  )}
                </div>
              </div>
              {passMsg.text && (
                <div className={`alert alert-${passMsg.type} mt-3 mb-0 py-2 small`}>
                  {passMsg.text}
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-outline-primary mt-3"
                disabled={passwordFormik.isSubmitting}
              >
                {passwordFormik.isSubmitting ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* ── Danger Zone ─────────────────────────────── */}
          <div className="card mt-4 border-danger">
            <div className="card-body p-4">
              <h4 className="text-danger fw-bold mb-3">Danger Zone</h4>
              <p className="text-muted small">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                className="btn btn-danger" 
                data-bs-toggle="modal" 
                data-bs-target="#deleteAccountModal"
                disabled={user?.role === "admin"}
                title={user?.role === "admin" ? "Admins cannot delete their own accounts here" : ""}>
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Account Modal */}
      <div className="modal fade" id="deleteAccountModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content auth-card">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-danger">Confirm Account Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-2">
              <div className="alert alert-warning small">
                <strong>Warning:</strong> This action is irreversible. If you are an organizer, all your hosted events will be permanently cancelled and deleted.
              </div>
              <p className="mb-2">Please enter your password to confirm:</p>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={deletePass}
                onChange={(e) => setDeletePass(e.target.value)}
              />
              {deleteError && (
                <div className="alert alert-danger py-1 mt-2 mb-0 small">{deleteError}</div>
              )}
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDeleteAccount} disabled={!deletePass}>
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Profile
