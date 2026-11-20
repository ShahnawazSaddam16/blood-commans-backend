const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const {GenerateRequest, GetRememberedInfo} = require("../controllers/blood-request");

router.post("/generate-request", limiter, GenerateRequest);
router.get("/remembered-info", limiter, GetRememberedInfo);

module.exports = router;