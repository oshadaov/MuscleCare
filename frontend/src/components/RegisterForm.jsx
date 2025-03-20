"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../utils/api"

function RegisterForm() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await api.post("/auth/register", userData)
      navigate("/login")
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error && <p className="register-error">{error}</p>}
      <div>
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
          className="register-input"
        />
      </div>
      <div>
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
          className="register-input"
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
          value={userData.password}
          onChange={handleChange}
          required
          className="register-input"
        />
      </div>
      <button type="submit" className="btn btn-primary register-button">
        Register
      </button>
      <p className="register-login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  )
}

export default RegisterForm

