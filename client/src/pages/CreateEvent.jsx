import { useCreateEvent } from "../hooks/useCreateEvent"

function CreateEvent() {
  const { formik, mainEvents, selectedParent, serverError, isInvalid, CATEGORIES, EVENT_TYPES } =
    useCreateEvent()

  const isSub      = formik.values.eventType === "sub"
  const isMultiDay = formik.values.eventType === "main" || formik.values.eventType === "standalone"

  // Calendar min/max for sub-events
  const dateMin = isSub && selectedParent ? selectedParent.date?.slice(0, 10) : undefined
  const dateMax = isSub && selectedParent?.endDate ? selectedParent.endDate.slice(0, 10) : undefined

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: 680 }}>
      <div className="card auth-card p-4 p-md-5">
        <h2 className="portal-brand mb-1">Host an Event</h2>
        <p className="text-muted small mb-4">Fill in the details to publish your event.</p>

        {serverError && (
          <div className="alert alert-danger py-2 small">{serverError}</div>
        )}

        <form onSubmit={formik.handleSubmit} noValidate encType="multipart/form-data">
          <div className="row g-3">

            {/* Title */}
            <div className="col-12">
              <label htmlFor="ce-title" className="form-label">Event title</label>
              <input id="ce-title" name="title" type="text"
                className={`form-control ${isInvalid("title") ? "is-invalid" : ""}`}
                value={formik.values.title}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {isInvalid("title") && <div className="invalid-feedback">{formik.errors.title}</div>}
            </div>

            {/* Description */}
            <div className="col-12">
              <label htmlFor="ce-desc" className="form-label">Description</label>
              <textarea id="ce-desc" name="description" rows={3}
                className={`form-control ${isInvalid("description") ? "is-invalid" : ""}`}
                value={formik.values.description}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {isInvalid("description") && <div className="invalid-feedback">{formik.errors.description}</div>}
            </div>

            {/* Category + Event Type */}
            <div className="col-sm-6">
              <label htmlFor="ce-cat" className="form-label">Category</label>
              <select id="ce-cat" name="category"
                className={`form-select ${isInvalid("category") ? "is-invalid" : ""}`}
                value={formik.values.category}
                onChange={formik.handleChange} onBlur={formik.handleBlur}>
                <option value="" disabled>Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {isInvalid("category") && <div className="invalid-feedback">{formik.errors.category}</div>}
            </div>

            <div className="col-sm-6">
              <label htmlFor="ce-type" className="form-label">Event type</label>
              <select id="ce-type" name="eventType"
                className={`form-select ${isInvalid("eventType") ? "is-invalid" : ""}`}
                value={formik.values.eventType}
                onChange={formik.handleChange} onBlur={formik.handleBlur}>
                {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {isInvalid("eventType") && <div className="invalid-feedback">{formik.errors.eventType}</div>}
            </div>

            {/* Parent event — sub-events only */}
            {isSub && (
              <div className="col-12">
                <label htmlFor="ce-parent" className="form-label">Parent event</label>
                <select id="ce-parent" name="parentEvent"
                  className={`form-select ${isInvalid("parentEvent") ? "is-invalid" : ""}`}
                  value={formik.values.parentEvent}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}>
                  <option value="" disabled>Select parent event</option>
                  {mainEvents.map((e) => (
                    <option key={e._id} value={e._id}>{e.title}</option>
                  ))}
                </select>
                {isInvalid("parentEvent") && <div className="invalid-feedback">{formik.errors.parentEvent}</div>}
              </div>
            )}

            {/* Start Date + Venue */}
            <div className="col-sm-6">
              <label htmlFor="ce-date" className="form-label">Start Date</label>
              <input id="ce-date" name="date" type="date"
                className={`form-control ${isInvalid("date") ? "is-invalid" : ""}`}
                value={formik.values.date}
                min={dateMin}
                max={dateMax}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {isInvalid("date") && <div className="invalid-feedback">{formik.errors.date}</div>}
            </div>

            {/* End Date — main/standalone only */}
            {isMultiDay && (
              <div className="col-sm-6">
                <label htmlFor="ce-enddate" className="form-label">End Date <span className="text-muted small">(optional)</span></label>
                <input id="ce-enddate" name="endDate" type="date"
                  className="form-control"
                  value={formik.values.endDate}
                  min={formik.values.date || undefined}
                  onChange={formik.handleChange} onBlur={formik.handleBlur} />
              </div>
            )}

            <div className="col-sm-6">
              <label htmlFor="ce-venue" className="form-label">Venue</label>
              <input id="ce-venue" name="venue" type="text"
                className={`form-control ${isInvalid("venue") ? "is-invalid" : ""}`}
                value={formik.values.venue}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {isInvalid("venue") && <div className="invalid-feedback">{formik.errors.venue}</div>}
            </div>

            {/* Capacity */}
            <div className="col-sm-6">
              <label htmlFor="ce-cap" className="form-label">Capacity</label>
              <input id="ce-cap" name="capacity" type="number" min={1}
                className={`form-control ${isInvalid("capacity") ? "is-invalid" : ""}`}
                value={formik.values.capacity}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {isInvalid("capacity") && <div className="invalid-feedback">{formik.errors.capacity}</div>}
            </div>

            {/* Poster upload */}
            <div className="col-12">
              <label htmlFor="ce-poster" className="form-label">Event poster (optional)</label>
              <input id="ce-poster" name="poster" type="file" accept="image/*"
                className="form-control"
                onChange={(e) => formik.setFieldValue("poster", e.currentTarget.files[0])} />
            </div>

            {/* Rules & Guidelines */}
            <div className="col-12">
              <label htmlFor="ce-rules" className="form-label">Rules &amp; Guidelines (optional)</label>
              <textarea id="ce-rules" name="rules" rows={4}
                className="form-control"
                placeholder="List any rules, requirements, or guidelines for participants…"
                value={formik.values.rules}
                onChange={formik.handleChange} onBlur={formik.handleBlur} />
            </div>

          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4"
            disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Publishing…
              </>
            ) : "Publish Event"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent
