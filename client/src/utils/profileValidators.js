import * as Yup from "yup"

// Profile form validation schema
export const profileValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required"),
  role: Yup.string(),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  rollNumber: Yup.string().when('role', {
    is: 'student',
    then: (schema) => schema.trim().required("Roll number is required"),
    otherwise: (schema) => schema.notRequired()
  }),
  department: Yup.string().when('role', {
    is: (val) => val === 'student' || val === 'staff',
    then: (schema) => schema.required("Department is required"),
    otherwise: (schema) => schema.notRequired()
  }),
})

export const passwordChangeSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
    .required("Confirm new password is required"),
})
