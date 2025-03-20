import axios from "axios"

const api = axios.create({
  baseURL:  "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token in the header
api.interceptors.request.use(
  (config) => {
    // IMPORTANT: For multipart form data, don't set Content-Type as axios will set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers["x-auth-token"] = token
    }

    // Log the request for debugging
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data instanceof FormData ? "FormData (not displayed)" : config.data,
    })

    return config
  },
  (error) => Promise.reject(error),
)

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log("API Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    })
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken")
      window.location.href = "/login"
    }

    // Log error details
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        endpoint: error.config.url,
        method: error.config.method,
      })
    } else if (error.request) {
      console.error("No response received:", error.request)
    } else {
      console.error("Request error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api

