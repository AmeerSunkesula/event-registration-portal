import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"

import "./Register.css"

const Register = () => {
  const [message, setMessage] = useState("")

  const registerSchema = Yup.object({
    name: Yup.string().required("Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

 password: Yup.string()
  .min(6, "Minimum 6 characters")

  .matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@._]+$/,
    
    "Password must contain letters and numbers"
  )

  .required("Password is required"),

    rollNumber: Yup.string().when("role", {
      is: "student",
      then: (schema) => schema.required("Roll Number is required"),
    }),

    department: Yup.string().when("role", {
      is: "student",
      then: (schema) => schema.required("Department is required"),
    }),
  })

  return (
    <div className="register-page">

      <div className="register-card">

        <h2 className="register-title">
          Register
        </h2>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            role: "student",
            rollNumber: "",
            department: "",
          }}

          validationSchema={registerSchema}

          onSubmit={async (values, { resetForm }) => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                  method: "POST",

                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify(values),
                }
              )

              const data = await response.json()

              if (response.ok) {
                setMessage(data.message)
                resetForm()
              } else {
                setMessage(data.message)
              }

            } catch (error) {
              console.log(error)
              setMessage("Server Error")
            }
          }}
        >
          {({ values }) => (
            <Form>

              {/* Name */}
             <div className="mb-3 form-group">

  <label className="form-label">
    Name
  </label>

  <Field
    type="text"
    name="name"
    className="form-control"
    placeholder="Enter your name"
  />

                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-text"
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-text"
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-text"
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">
                  Role
                </label>

                <Field
                  as="select"
                  name="role"
                  className="form-select"
                >
                  <option value="student">
                    Student
                  </option>

                  <option value="organizer">
                    Organizer
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </Field>
              </div>

              {/* Student Fields */}
              {values.role === "student" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">
                      Roll Number
                    </label>

                    <Field
                      type="text"
                      name="rollNumber"
                      className="form-control"
                      placeholder="Enter roll number"
                    />

                    <ErrorMessage
                      name="rollNumber"
                      component="div"
                      className="error-text"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Department
                    </label>

                    <Field
                      as="select"
                      name="department"
                      className="form-select"
                    >
                      <option value="">
                        Select Department
                      </option>

                      <option value="Computer Engineering">
                        Computer Engineering
                      </option>

                      <option value="Mechanical">
                        Mechanical
                      </option>

                      <option value="Electrical">
                        Electrical
                      </option>

                      <option value="Civil">
                        Civil
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </Field>

                    <ErrorMessage
                      name="department"
                      component="div"
                      className="error-text"
                    />
                  </div>
                </>
              )}

              {/* Button */}
              <button
                type="submit"
                className="register-btn"
              >
                Register
              </button>

              {/* Message */}
              <p className="success-message">
                {message}
              </p>

            </Form>
          )}
        </Formik>

      </div>

    </div>
  )
}

export default Register