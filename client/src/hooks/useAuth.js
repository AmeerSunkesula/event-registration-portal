import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginSuccess } from "../features/auth/authSlice"

export function useAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState("")

  const loginUser = async (values, setSubmitting) => {
    setServerError("")
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", values)
      dispatch(loginSuccess({ user: data.user, token: data.token }))
      navigate("/")
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed")
    } finally {
      if (setSubmitting) setSubmitting(false)
    }
  }

  const registerUser = async (values, setSubmitting) => {
    setServerError("")
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", values)
      if (data.token) {
        dispatch(loginSuccess({ user: data.user, token: data.token }))
        navigate("/")
      } else {
        alert(data.message)
        navigate("/login")
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed")
    } finally {
      if (setSubmitting) setSubmitting(false)
    }
  }

  const requestPasswordReset = async (email, setResetMsg) => {
    setResetMsg({ type: "", text: "" })
    try {
      await axios.post("http://localhost:5000/api/auth/request-reset", { email })
      setResetMsg({ type: "success", text: "Reset request submitted. Pending admin approval." })
    } catch (err) {
      setResetMsg({ type: "danger", text: err.response?.data?.message || "Failed to submit request" })
    }
  }

  return {
    serverError,
    setServerError,
    loginUser,
    registerUser,
    requestPasswordReset,
  }
}
