import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

// Redux Imports
import { store } from "./app/store"
import { Provider } from "react-redux"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
