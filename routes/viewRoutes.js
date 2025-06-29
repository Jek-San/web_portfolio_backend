// routes/viewRoutes.js
const express = require("express")
const router = express.Router()
const { trackView, getAnalytics } = require("../controllers/viewController")

// POST /api/views/:slug
router.post("/:slug", trackView)
router.get("/analytics", getAnalytics)
module.exports = router
