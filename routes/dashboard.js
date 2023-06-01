const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard");
const isStaffAuth = require("../middleware/isStaffAuth");

router.get("/dashboard/stat-card", isStaffAuth, dashboardController.getStatCardData);

module.exports = router;
