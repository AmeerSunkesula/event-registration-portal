const DEPARTMENTS = ["Computer Engineering", "Mechanical", "Electrical", "Civil", "Other"]

// Profile details edit form — receives Formik bag and user
function ProfileDetailsForm({ formik, user }) {
  const isInvalid = (f) => formik.touched[f] && formik.errors[f]

  return (
    <div className="card auth-card p-4 mb-4">
      <h4 className="portal-brand mb-3">Profile Details</h4>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="row g-3">

          {/* Name */}
          <div className="col-12">
            <label htmlFor="prof-name" className="form-label">Full name</label>
            <input
              id="prof-name" name="name" type="text"
              className={`form-control ${isInvalid("name") ? "is-invalid" : ""}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isInvalid("name") && <div className="invalid-feedback">{formik.errors.name}</div>}
          </div>

          {/* Email — read-only for students/staff */}
          <div className="col-12">
            <label htmlFor="prof-email" className="form-label">Email address</label>
            <input
              id="prof-email" name="email" type="email"
              className={`form-control ${isInvalid("email") ? "is-invalid" : ""}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={user?.role !== "admin"}
            />
            {isInvalid("email") && <div className="invalid-feedback">{formik.errors.email}</div>}
          </div>

          {/* Roll number — students only */}
          {user?.role === "student" && (
            <div className="col-sm-6">
              <label htmlFor="prof-roll" className="form-label">Roll number</label>
              <input
                id="prof-roll" name="rollNumber" type="text"
                className={`form-control ${isInvalid("rollNumber") ? "is-invalid" : ""}`}
                value={formik.values.rollNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {isInvalid("rollNumber") && <div className="invalid-feedback">{formik.errors.rollNumber}</div>}
            </div>
          )}

          {/* Department — non-admins */}
          {user?.role !== "admin" && (
            <div className="col-sm-6">
              <label htmlFor="prof-dept" className="form-label">Department</label>
              <select
                id="prof-dept" name="department"
                className={`form-select ${isInvalid("department") ? "is-invalid" : ""}`}
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}>
                <option value="" disabled>Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {isInvalid("department") && <div className="invalid-feedback">{formik.errors.department}</div>}
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
  )
}

export default ProfileDetailsForm
