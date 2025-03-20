import express from "express"
import { submitFeedback, getFeedback } from "../controllers/feedback.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/", auth, submitFeedback)
router.get("/", getFeedback)

export default router

