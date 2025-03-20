import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  let token = req.header("x-auth-token") || req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // If token is in "Authorization: Bearer <token>" format, extract it
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
}
