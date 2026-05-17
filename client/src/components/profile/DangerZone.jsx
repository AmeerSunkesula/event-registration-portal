import { useState } from "react"

// Danger zone card + delete account modal
function DangerZone({ user, deleteAccount, onDeleted }) {
  const [deletePass, setDeletePass] = useState("")
  const [deleteError, setDeleteError] = useState("")

  const handleDelete = async () => {
    setDeleteError("")
    try {
      await deleteAccount(deletePass)
      // Cleanup Bootstrap modal
      document.querySelector(".modal-backdrop")?.remove()
      document.body.classList.remove("modal-open")
      onDeleted()
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account")
    }
  }

  return (
    <>
      {/* Danger zone card */}
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

      {/* Confirmation modal */}
      <div className="modal fade" id="deleteAccountModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content auth-card">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold text-danger">Confirm Account Deletion</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
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
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={!deletePass}>
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DangerZone
