import { useState } from "react"
import { useFormik } from "formik"
import { passwordChangeSchema } from "../../utils/profileValidators"

// Change password + danger zone card
function ChangePasswordForm({ changePassword }) {
  const [passMsg, setPassMsg] = useState({ type: "", text: "" })

  const formik = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema: passwordChangeSchema,
    onSubmit: async (values, { resetForm }) => {
      setPassMsg({ type: "", text: "" })
      try {
        await changePassword(values.oldPassword, values.newPassword)
        setPassMsg({ type: "success", text: "Password updated successfully!" })
        resetForm()
      } catch (err) {
        setPassMsg({ type: "danger", text: err.response?.data?.message || "Failed to update password" })
      }
    },
  })

  const isInvalid = (f) => formik.touched[f] && formik.errors[f]

  return (
    <div className="card auth-card p-4 mt-4">
      <h4 className="portal-brand mb-3">Account Settings</h4>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="row g-3">

          <div className="col-12">
            <label className="form-label">Old Password</label>
            <input
              type="password" name="oldPassword"
              className={`form-control ${isInvalid("oldPassword") ? "is-invalid" : ""}`}
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isInvalid("oldPassword") && (
              <div className="invalid-feedback">{formik.errors.oldPassword}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">New Password</label>
            <input
              type="password" name="newPassword"
              className={`form-control ${isInvalid("newPassword") ? "is-invalid" : ""}`}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isInvalid("newPassword") && (
              <div className="invalid-feedback">{formik.errors.newPassword}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password" name="confirmPassword"
              className={`form-control ${isInvalid("confirmPassword") ? "is-invalid" : ""}`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {isInvalid("confirmPassword") && (
              <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
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
          disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  )
}

export default ChangePasswordForm
