import jwt from "jsonwebtoken"

// Middleware to verify admin JWT token
export const adminAuth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token")

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET || "adminSecret")

    // Add admin from payload to request
    req.admin = decoded.admin
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Middleware to check if user is super admin
export const superAdminAuth = (req, res, next) => {
  if (req.admin.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied. Super admin privileges required." })
  }
  next()
}

// Default export for backward compatibility
export default adminAuth

