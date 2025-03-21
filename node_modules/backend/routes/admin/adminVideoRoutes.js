import express from "express"
import { adminAuth } from "../../middleware/adminAuth.js"
import { getVideos, getAdminVideos, createVideo, updateVideo, deleteVideo} from "../../controllers/adminVideoController.js"

const router = express.Router()


// Public routes
router.get("/", getVideos)

// Admin routes
router.route("/admin").get( adminAuth, getAdminVideos).post(adminAuth, createVideo)

router.route("/admin/:id").put(adminAuth, updateVideo).delete( adminAuth, deleteVideo)

export default  router;

