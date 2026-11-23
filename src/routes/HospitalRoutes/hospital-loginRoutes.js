const express = require("express");
const router = express.Router();
const limiter = require("../../utils/limiter");
const HospitalMiddleware = require("../../middleware/HospitalMiddlware");
const {Login, Me, Logout} = require("../../controllers/hospital-login");
const validate = require("../../middleware/validate");
const {hospitalLoginSchema} = require("../../middleware/validationSchemas");

router.post("/login", limiter, validate({body: hospitalLoginSchema}), Login);
router.get("/me", HospitalMiddleware, limiter, Me);
router.post("/logout", limiter, Logout);

module.exports = router;