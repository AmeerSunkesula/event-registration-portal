// Shared email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Login ────────────────────────────────────────────────

export const loginInitialValues = { email: "", password: "" }

// Login field validation
export const validateLogin = (values) => {
  const errors = {}
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = "Enter a valid email"
  }
  if (!values.password) errors.password = "Password is required"
  return errors
}

// ── Register ─────────────────────────────────────────────

export const registerInitialValues = {
  name: "",
  email: "",
  password: "",
  role: "student",
  rollNumber: "",
  department: "",
  acknowledgementAccepted: false,
}

// Register field validation
export const validateRegister = (values) => {
  const errors = {}
  if (!values.name.trim()) errors.name = "Name is required"
  if (!values.email) {
    errors.email = "Email is required"
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = "Enter a valid email"
  }
  if (!values.password) {
    errors.password = "Password is required"
  } else if (values.password.length < 6) {
    errors.password = "Minimum 6 characters"
  }
  
  if (values.role === "student") {
    if (!values.rollNumber.trim()) errors.rollNumber = "Roll number is required"
  }
  
  if (values.role === "student" || values.role === "staff") {
    if (!values.department) errors.department = "Select a department"
  }
  
  if (values.role === "staff") {
    if (!values.acknowledgementAccepted) errors.acknowledgementAccepted = "You must accept the acknowledgement"
  }
  
  return errors
}
