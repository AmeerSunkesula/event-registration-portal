import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useState } from "react"

import "./Register.css"

const Login = () => {

  const [message, setMessage] = useState("")

  // Validation
  const loginSchema = Yup.object({

    email: Yup.string()
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required"),

  })

  return (

    <div className="register-page">

      <div className="register-card">

        <h2 className="register-title">
          Login
        </h2>

        <Formik

          initialValues={{
            email: "",
            password: "",
          }}

          validationSchema={loginSchema}

          onSubmit={async (values, { resetForm }) => {

            try {

              const response = await fetch(
                "http://localhost:5000/api/auth/login",
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

                // Store token
                localStorage.setItem("token", data.token)

                // Store user info
                localStorage.setItem(
                  "user",
                  JSON.stringify(data.user)
                )

                setMessage("Login Successful ✅")

                console.log(data)

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

          <Form>

            {/* Email */}

            <div className="mb-3 form-group">

              <label className="form-label">
                Email
              </label>

              <Field
                type="text"
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

            <div className="mb-3 form-group">

              <label className="form-label">
                Password
              </label>

              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter your password"
              />

              <ErrorMessage
                name="password"
                component="div"
                className="error-text"
              />

            </div>

            {/* Login Button */}

            <button
              type="submit"
              className="register-btn"
            >
              Login
            </button>

            {/* Message */}

            <p className="success-message">
              {message}
            </p>

          </Form>

        </Formik>

      </div>

    </div>

  )
}

export default Login