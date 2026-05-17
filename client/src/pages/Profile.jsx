import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../features/auth/authSlice"
import { useProfileData } from "../hooks/useProfileData"

// Profile sub-components
import ProfileDetailsForm   from "../components/profile/ProfileDetailsForm"
import ChangePasswordForm   from "../components/profile/ChangePasswordForm"
import DangerZone           from "../components/profile/DangerZone"
import MyRegisteredEvents   from "../components/profile/MyRegisteredEvents"
import MyHostedEvents       from "../components/profile/MyHostedEvents"
import CoordinatorPanel     from "../components/profile/CoordinatorPanel"

const AVATAR_BASE = "http://localhost:5000/"
const PLACEHOLDER = "https://ui-avatars.com/api/?background=303b57&color=fff&size=128&bold=true"

function Profile() {
  const {
    state, formik, fileInputRef, handleFileChange,
    removeProfileImg, changePassword, deleteAccount, user,
  } = useProfileData()

  const { eventsLoading, userEvents, organizedEvents, eventsError, avatarLoading, avatarError } = state

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Avatar src — upload or placeholder
  const avatarSrc = user?.profilePicture
    ? `${AVATAR_BASE}${user.profilePicture}`
    : `${PLACEHOLDER}&name=${encodeURIComponent(user?.name ?? "U")}`

  const handleDeleted = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row g-4">

        {/* ── Left: Avatar ───────────────────────────── */}
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

            {/* Roll number */}
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

            {/* Avatar controls */}
            <div className="d-flex gap-2 mt-3 w-100">
              <button
                className="btn btn-outline-primary flex-grow-1"
                disabled={avatarLoading}
                onClick={() => fileInputRef.current?.click()}>
                {avatarLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                    Uploading…
                  </>
                ) : "Change"}
              </button>
              {user?.profilePicture && (
                <button
                  className="btn btn-outline-danger"
                  disabled={avatarLoading}
                  onClick={removeProfileImg}>
                  Remove
                </button>
              )}
            </div>

          </div>{/* end avatar card */}

          {/* Staff hub — only for staff role */}
          {user?.role === "staff" && <CoordinatorPanel />}

        </div>{/* end col-md-4 */}

        {/* ── Right: Details ─────────────────────────── */}
        <div className="col-md-8">

          {/* Profile edit form */}
          <ProfileDetailsForm formik={formik} user={user} />

          {/* Registered events */}
          <MyRegisteredEvents
            events={userEvents}
            loading={eventsLoading}
            error={eventsError}
          />

          {/* Hosted events — hidden for staff */}
          {user?.role !== "staff" && (
            <MyHostedEvents events={organizedEvents} loading={eventsLoading} />
          )}

          {/* Change password */}
          <ChangePasswordForm changePassword={changePassword} />

          {/* Danger zone + delete modal */}
          <DangerZone
            user={user}
            deleteAccount={deleteAccount}
            onDeleted={handleDeleted}
          />

        </div>
      </div>
    </div>
  )
}

export default Profile
