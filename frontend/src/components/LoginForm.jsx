"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../utils/api"

function LoginForm({ setIsLoggedIn }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const response = await api.post("/auth/login", credentials)
      localStorage.setItem("token", response.data.token)
      setIsLoggedIn(true)
      navigate("/videos")
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <p className="login-error">{error}</p>}
      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          className="login-input"
        />
      </div>
      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="login-input"
        />
      </div>
      <button type="submit" className="btn btn-primary login-button">
        Log In
      </button>
      <p className="login-register-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  )
}

export default LoginForm

