import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useEventDashboard } from "../hooks/useEventDashboard"

function EventDashboard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    event, approvedStaff, loading, error, user,
    sendCoordinatorRequest, updateEvent, 
    deleteEvent, removeAttendee, removeCoordinator, removePosterImg 
  } = useEventDashboard(id)
  
  const [activeTab, setActiveTab] = useState("attendees")
  const [selectedStaff, setSelectedStaff] = useState("")

  // Staff can only see attendees + edit tabs
  const isStaffOnly = user?.role === "staff" &&
    String(user?._id) !== String(event?.organizer?._id)

  // Form states for simple edit
  const [editData, setEditData] = useState(null)
  const [file, setFile] = useState(null)

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error || "Event not found"}</div>
        <Link to="/events" className="btn btn-outline-secondary">← Back to Events</Link>
      </div>
    )
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (editData) {
      const formData = new FormData()
      Object.keys(editData).forEach(key => {
        formData.append(key, editData[key])
      })
      if (file) {
        formData.append("poster", file)
      }
      updateEvent(formData)
    }
  }

  return (
    <div className="container mt-4 mb-5">
      <Link to={`/events/${event._id}`} className="text-decoration-none small mb-3 d-inline-block text-muted">
        ← Back to Event Page
      </Link>
      
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-brand)", color: "var(--theme-navy)" }}>
            {event.title} Dashboard
          </h2>
          <span className="badge bg-secondary">Organizer: {event.organizer?.name}</span>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4" style={{ gap: "0.5rem" }}>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "attendees" ? "active bg-dark" : "text-dark"}`}
            onClick={() => setActiveTab("attendees")}>
            👥 Attendees
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "coordinators" ? "active bg-dark" : "text-dark"}`}
            onClick={() => setActiveTab("coordinators")}>
            🛠️ Coordinators
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "edit" ? "active bg-dark" : "text-dark"}`}
            onClick={() => {
              setActiveTab("edit")
              if (!editData) {
                setEditData({ title: event.title, description: event.description, venue: event.venue, capacity: event.capacity })
              }
            }}>
            ⚙️ Edit Event
          </button>
        </li>
        {/* Danger tab — hidden for staff */}
        {!isStaffOnly && (
          <li className="nav-item ms-auto">
            <button className={`nav-link ${activeTab === "danger" ? "active bg-danger text-white" : "text-danger fw-bold"}`}
              onClick={() => setActiveTab("danger")}>
              ⚠️ Settings/Danger
            </button>
          </li>
        )}
      </ul>

      {/* Tab Content */}
      <div className="card shadow-sm p-4 border-0">
        
        {/* ATTENDEES TAB */}
        {activeTab === "attendees" && (
          <div>
            <h5 className="mb-3 fw-bold">Registered Students ({event.registeredStudents?.length || 0})</h5>
            {event.registeredStudents?.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Roll Number</th>
                      <th>Department</th>
                      {user?.role === "admin" && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {event.registeredStudents.map(student => (
                      <tr key={student._id}>
                        <td className="fw-semibold">{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.rollNumber || "N/A"}</td>
                        <td>{student.department || "N/A"}</td>
                        {user?.role === "admin" && (
                          <td>
                            <button className="btn btn-sm btn-outline-danger py-0" 
                              onClick={() => {
                                if (window.confirm(`Remove ${student.name}?`)) removeAttendee(student._id)
                              }}>
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No attendees registered yet.</p>
            )}
          </div>
        )}

        {/* COORDINATORS TAB */}
        {activeTab === "coordinators" && (
          <div>
            <h5 className="mb-3 fw-bold">Event Coordinators</h5>
            
            {/* Assign Coordinator UI */}
            <div className="card bg-light p-3 mb-4 border-0">
              <h6 className="fw-semibold mb-2">Assign New Coordinator</h6>
              <div className="d-flex gap-2">
                <select 
                  className="form-select w-50" 
                  value={selectedStaff} 
                  onChange={(e) => setSelectedStaff(e.target.value)}>
                  <option value="">Select an approved staff member...</option>
                  {approvedStaff
                    .filter(staff => !event.coordinators?.some(c => c._id === staff._id))
                    .map(staff => (
                    <option key={staff._id} value={staff._id}>{staff.name} ({staff.email})</option>
                  ))}
                </select>
                <button 
                  className="btn btn-primary"
                  disabled={!selectedStaff}
                  onClick={() => {
                    sendCoordinatorRequest(selectedStaff)
                    setSelectedStaff("")
                  }}>
                  Send Request
                </button>
              </div>
            </div>

            {/* Current Coordinators */}
            {event.coordinators?.length > 0 ? (
              <ul className="list-group">
                {event.coordinators.map(coord => (
                  <li key={coord._id} className="list-group-item d-flex align-items-center gap-3">
                    <img 
                      src={coord.profilePicture ? `http://localhost:5000/${coord.profilePicture}` : "https://placehold.co/40"} 
                      className="rounded-circle" width="40" height="40" alt="avatar" />
                    <div>
                      <h6 className="mb-0 fw-semibold">{coord.name}</h6>
                      <small className="text-muted">{coord.email}</small>
                    </div>
                    {user?.role === "admin" && (
                      <button className="btn btn-sm btn-outline-danger ms-auto py-0" 
                        onClick={() => {
                          if (window.confirm(`Remove ${coord.name} from coordinators?`)) removeCoordinator(coord._id)
                        }}>
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No coordinators assigned to this event.</p>
            )}
          </div>
        )}

        {/* EDIT TAB */}
        {activeTab === "edit" && editData && (
          <div>
            <h5 className="mb-3 fw-bold">Edit Event Details</h5>

            <div className="card p-3 bg-light border-0 mb-4 d-flex flex-row align-items-start gap-3">
              <img 
                src={event.poster ? (event.poster.includes("/") ? `http://localhost:5000/${event.poster}` : `http://localhost:5000/uploads/events/${event.poster}`) : "https://placehold.co/600x200/303b57/debc58?text=Event"} 
                alt="Event Poster" 
                style={{ width: "150px", height: "auto", objectFit: "cover", borderRadius: "8px" }} 
              />
              <div className="flex-grow-1">
                <h6 className="fw-semibold">Event Poster</h6>
                <p className="text-muted small mb-2">Upload a high-quality image for the event.</p>
                {event.poster && (
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {
                    if(window.confirm("Remove this poster?")) removePosterImg()
                  }}>
                    Remove Poster
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="mb-3">
                <label className="form-label">New Poster</label>
                <input type="file" className="form-control" name="poster" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" value={editData.title} 
                  onChange={e => setEditData({...editData, title: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={editData.description} 
                  onChange={e => setEditData({...editData, description: e.target.value})} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Venue</label>
                  <input type="text" className="form-control" value={editData.venue} 
                    onChange={e => setEditData({...editData, venue: e.target.value})} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-control" value={editData.capacity} 
                    onChange={e => setEditData({...editData, capacity: e.target.value})} required min="1" />
                </div>
              </div>
              <button type="submit" className="btn btn-dark w-100 mt-2">Save Changes</button>
            </form>
          </div>
        )}

        {/* DANGER TAB */}
        {activeTab === "danger" && (
          <div className="border border-danger rounded p-4">
            <h5 className="text-danger fw-bold mb-3">Danger Zone</h5>
            <p className="text-muted small">
              Deleting this event will permanently cancel it, and remove it from all attendees' and coordinators' schedules. This cannot be undone.
            </p>
            <button 
              className="btn btn-danger fw-bold"
              onClick={async () => {
                if (window.confirm("Are you absolutely sure you want to delete this event? This action cannot be undone.")) {
                  if (window.confirm("FINAL CONFIRMATION: Type OK to proceed or click cancel.")) {
                    const success = await deleteEvent()
                    if (success) navigate("/events")
                  }
                }
              }}>
              Delete Event
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDashboard
