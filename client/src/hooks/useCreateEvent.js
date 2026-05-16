import * as Yup from "yup"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const API        = "http://localhost:5000/api/events"
const CATEGORIES = ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Tech Fest", "Other"]
const EVENT_TYPES = ["standalone", "main", "sub"]

const schema = Yup.object({
  title:       Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  category:    Yup.string().required("Category is required"),
  date:        Yup.date().required("Date is required").min(new Date(), "Date must be in the future"),
  venue:       Yup.string().trim().required("Venue is required"),
  capacity:    Yup.number().required("Capacity is required").min(1, "Min 1 seat"),
  rules:       Yup.string().trim(),
  eventType:   Yup.string().required("Event type is required"),
  parentEvent: Yup.string().when("eventType", {
    is: "sub",
    then: (s) => s.required("Parent event is required for sub-events"),
    otherwise: (s) => s.notRequired(),
  }),
})

export function useCreateEvent() {
  const { token }           = useSelector((s) => s.auth)
  const navigate            = useNavigate()
  const [mainEvents, setMainEvents] = useState([])
  const [serverError, setServerError] = useState("")

  // Fetch main events for parent dropdown
  useEffect(() => {
    axios
      .get(API, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setMainEvents(data.filter((e) => e.eventType === "main")))
      .catch(() => {})
  }, [token])

  const formik = useFormik({
    initialValues: {
      title: "", description: "", category: "", date: "",
      venue: "", capacity: "", eventType: "standalone", parentEvent: "",
      rules: "", poster: null,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError("")
      try {
        const fd = new FormData()
        Object.entries(values).forEach(([k, v]) => {
          if (v !== null && v !== "") fd.append(k, v)
        })
        await axios.post(`${API}/create`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        })
        navigate("/events")
      } catch (err) {
        setServerError(err.response?.data?.message || "Creation failed")
      } finally {
        setSubmitting(false)
      }
    },
  })

  const isInvalid = (f) => formik.touched[f] && formik.errors[f]

  return { formik, mainEvents, serverError, isInvalid, CATEGORIES, EVENT_TYPES }
}
