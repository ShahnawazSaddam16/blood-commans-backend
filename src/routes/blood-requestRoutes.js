const express = require("express");
const router = express.Router();
const limiter = require("../utils/limiter");
const {
  GenerateRequest,
  GetRememberedInfo,
  GetAllBloodRequests,
} = require("../controllers/blood-request");
const validate = require("../middleware/validate");
const {
  generateBloodRequestSchema,
} = require("../middleware/validationSchemas");

router.post(
  "/generate-request",
  limiter,
  validate({ body: generateBloodRequestSchema }),
  GenerateRequest,
);
router.get("/remembered-info", limiter, GetRememberedInfo);
router.get("/all-blood-request", limiter, GetAllBloodRequests);

module.exports = router;
