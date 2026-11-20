const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const {GenerateRequest} = require("../controllers/blood-request");

router.post("/generate-request", limiter, GenerateRequest);

module.exports = router;