const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const {GenerateRequest, GetRememberedInfo, GetAllBloodRequests} = require("../controllers/blood-request");

router.post("/generate-request", limiter, GenerateRequest);
router.get("/remembered-info", limiter, GetRememberedInfo);
router.get("/all-blood-request", limiter, GetAllBloodRequests);

module.exports = router;