import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"

function AdminDashboard() {
  const { token } = useSelector((s) => s.auth)
  const [pendingStaff, setPendingStaff] = useState([])
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [resets, setResets] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const headers = { Authorization: `Bearer ${token}` }

  const fetchData = async () => {
    setLoading(true)
    try {
      const [staffRes, eventsRes, usersRes, resetsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/staff/pending", { headers }),
        axios.get("http://localhost:5000/api/events", { headers }),
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/users/password-resets", { headers })
      ])
      setPendingStaff(staffRes.data)
      setEvents(eventsRes.data)
      setUsers(usersRes.data)
      setResets(resetsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const approveStaff = async (staffId) => {
    try {
      await axios.put(`http://localhost:5000/api/staff/approve/${staffId}`, {}, { headers })
      fetchData()
    } catch (err) {
      alert("Failed to approve staff")
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? Their events will be deleted as well.")) return
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, { headers })
      fetchData()
    } catch (err) {
      alert("Failed to delete user")
    }
  }

  const revokeStaff = async (staffId) => {
    if (!window.confirm("Revoke this staff member's permissions?")) return
    try {
      await axios.put(`http://localhost:5000/api/staff/revoke/${staffId}`, {}, { headers })
      fetchData()
    } catch (err) {
      alert("Failed to revoke staff")
    }
  }

  const approveReset = async (userId) => {
    if (!window.confirm("Approve reset? Password will become PortalReset123!")) return
    try {
      await axios.put(`http://localhost:5000/api/users/approve-reset/${userId}`, {}, { headers })
      fetchData()
    } catch (err) {
      alert("Failed to approve reset")
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center pt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold" style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
        Admin Dashboard
      </h2>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4" style={{ gap: "0.5rem" }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "overview" ? "active bg-dark" : "text-dark"}`}
            onClick={() => setActiveTab("overview")}>
            📊 Global Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "users" ? "active bg-dark" : "text-dark"}`}
            onClick={() => setActiveTab("users")}>
            👥 User Management
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "security" ? "active bg-danger text-white" : "text-danger fw-bold"}`}
            onClick={() => setActiveTab("security")}>
            🛡️ Security & Resets
          </button>
        </li>
      </ul>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Pending Staff Approvals */}
          <div className="card border-0 shadow-sm mb-5 p-4 bg-white">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark rounded-circle px-2 py-1">{pendingStaff.length}</span>
              Pending Staff Approvals
            </h5>
            {pendingStaff.length > 0 ? (
              <ul className="list-group list-group-flush">
                {pendingStaff.map(staff => (
                  <li key={staff._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-semibold">{staff.name}</h6>
                      <small className="text-muted">{staff.email}</small>
                    </div>
                    <button className="btn btn-sm btn-success fw-semibold" onClick={() => approveStaff(staff._id)}>
                      ✓ Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0 small">No pending staff approvals.</p>
            )}
          </div>

          {/* Global Events Overview */}
          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold mb-3">Global Events Overview</h5>
            {events.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Event Title</th>
                      <th>Organizer</th>
                      <th>Date</th>
                      <th>Capacity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => {
                      const spotsTaken = ev.registeredStudents?.length || 0
                      const spotsTotal = ev.capacity
                      const percentage = spotsTotal > 0 ? (spotsTaken / spotsTotal) * 100 : 0
                      
                      return (
                        <tr key={ev._id}>
                          <td className="fw-semibold text-truncate" style={{ maxWidth: "200px" }}>{ev.title}</td>
                          <td>{ev.organizer?.name || "Unknown"}</td>
                          <td>{new Date(ev.date).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className="small">{spotsTaken}/{spotsTotal}</span>
                              <div className="progress w-100" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Link to={`/events/${ev._id}/dashboard`} className="btn btn-sm btn-outline-dark">
                              View
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted mb-0 small">No events found.</p>
            )}
          </div>
        </>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="card border-0 shadow-sm p-4 bg-white">
          <h5 className="fw-bold mb-3">User Management</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'staff' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                        {u.role}
                      </span>
                      {u.role === 'staff' && !u.isApproved && <span className="ms-1 badge bg-dark">Pending</span>}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {u.role === 'staff' && u.isApproved && (
                          <button className="btn btn-sm btn-outline-warning" onClick={() => revokeStaff(u._id)}>
                            Revoke Staff
                          </button>
                        )}
                        {u.role === 'staff' && !u.isApproved && (
                          <button className="btn btn-sm btn-outline-success" onClick={() => approveStaff(u._id)}>
                            Approve Staff
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(u._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <div className="card border-0 shadow-sm p-4 bg-white border-top border-danger border-4">
          <h5 className="fw-bold mb-3 text-danger">Password Reset Requests</h5>
          {resets.length > 0 ? (
            <ul className="list-group list-group-flush">
              {resets.map(r => (
                <li key={r._id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0 fw-semibold">{r.name}</h6>
                    <small className="text-muted">{r.email}</small>
                  </div>
                  <button className="btn btn-sm btn-danger fw-semibold" onClick={() => approveReset(r._id)}>
                    Approve Reset
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted mb-0 small">No pending password reset requests.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
