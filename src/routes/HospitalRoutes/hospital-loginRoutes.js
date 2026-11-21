const express = require("express");
const router = express.Router();
const limiter = require("../../utils/limiter");
const HospitalMiddleware = require("../../middleware/HospitalMiddlware");
const {Login, Me} = require("../../controllers/hospital-login");

router.post("/hospital-login", limiter, Login);

module.exports = router;