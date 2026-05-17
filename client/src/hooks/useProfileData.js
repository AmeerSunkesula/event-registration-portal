import { useReducer, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useFormik } from "formik"
import axios from "axios"
import { updateUser } from "../features/auth/authSlice"
import { profileValidationSchema } from "../utils/profileValidators"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000"
const API = `${API_BASE}/api/events`

// ── Reducer ───────────────────────────────────────────────
const initialState = {
  eventsLoading: true,
  userEvents: [],
  organizedEvents: [],
  eventsError: null,
  avatarLoading: false,
  avatarError: null,
}

function profileReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, eventsLoading: true, eventsError: null }
    case "FETCH_SUCCESS":
      return {
        ...state,
        eventsLoading: false,
        userEvents: action.payload.registered,
        organizedEvents: action.payload.organized,
      }
    case "FETCH_ERROR":
      return { ...state, eventsLoading: false, eventsError: action.payload }
    case "AVATAR_START":
      return { ...state, avatarLoading: true, avatarError: null }
    case "AVATAR_SUCCESS":
      return { ...state, avatarLoading: false }
    case "AVATAR_ERROR":
      return { ...state, avatarLoading: false, avatarError: action.payload }
    default:
      return state
  }
}

// ── Hook ──────────────────────────────────────────────────
export function useProfileData() {
  const reduxDispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const [state, dispatch] = useReducer(profileReducer, initialState)
  const fileInputRef = useRef(null)

  // Fetch registered + organized events concurrently
  useEffect(() => {
    dispatch({ type: "FETCH_START" })
    const headers = { Authorization: `Bearer ${token}` }
    Promise.all([
      axios.get(`${API}/my-events`, { headers }),
      axios.get(`${API}/organized-by-me`, { headers }),
    ])
      .then(([reg, org]) =>
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { registered: reg.data, organized: org.data },
        }),
      )
      .catch((err) =>
        dispatch({
          type: "FETCH_ERROR",
          payload: err.response?.data?.message || "Failed to load events",
        }),
      )
  }, [token])

  // Avatar upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    dispatch({ type: "AVATAR_START" })
    const formData = new FormData()
    formData.append("profilePicture", file)

    try {
      const { data } = await axios.put(
        `${API_BASE}/api/users/profile-picture`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      reduxDispatch(updateUser({ profilePicture: data.user.profilePicture }))
      dispatch({ type: "AVATAR_SUCCESS" })
    } catch (err) {
      dispatch({
        type: "AVATAR_ERROR",
        payload: err.response?.data?.message || "Upload failed",
      })
    } finally {
      e.target.value = ""
    }
  }

  // Formik — profile details form
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "student",
      rollNumber: user?.rollNumber ?? "",
      department: user?.department ?? "",
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.put(
          `${API_BASE}/api/users/update`,
          {
            name: values.name,
            rollNumber: values.rollNumber,
            department: values.department,
            email: values.email,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        reduxDispatch(updateUser(data.user))
      } catch (err) {
        console.error("Update failed:", err.response?.data?.message)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleCoordinatorReq = async (eventId, action) => {
    try {
      await axios.put(
        `${API_BASE}/api/staff/handle-request/${eventId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      // Re-hydrate user to update the requests list
      const { data } = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      reduxDispatch(updateUser(data))
    } catch (err) {
      alert(err.response?.data?.message || "Failed to handle request")
    }
  }

  const removeProfileImg = async () => {
    try {
      dispatch({ type: "AVATAR_START" })
      await axios.delete(
        `${API_BASE}/api/users/profile-picture`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      reduxDispatch(updateUser({ profilePicture: null }))
      dispatch({ type: "AVATAR_SUCCESS" })
    } catch (err) {
      dispatch({ type: "AVATAR_ERROR", payload: err.response?.data?.message || "Failed to remove avatar" })
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    await axios.put(
      `${API_BASE}/api/users/change-password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const deleteAccount = async (password) => {
    await axios.post(
      `${API_BASE}/api/users/delete-account`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  }

  return {
    state,
    formik,
    fileInputRef,
    handleFileChange,
    removeProfileImg,
    changePassword,
    deleteAccount,
    user,
    handleCoordinatorReq,
    token,
  }
}
