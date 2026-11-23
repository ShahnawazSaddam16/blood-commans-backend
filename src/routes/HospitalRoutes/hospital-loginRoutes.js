const express = require("express");
const router = express.Router();
const limiter = require("../../utils/limiter");
const HospitalMiddleware = require("../../middleware/HospitalMiddlware");
const {Login, Me, Logout} = require("../../controllers/hospital-login");

router.post("/login", limiter, Login);
router.get("/me", HospitalMiddleware, limiter, Me);
router.post("/logout", limiter, Logout);

module.exports = router;