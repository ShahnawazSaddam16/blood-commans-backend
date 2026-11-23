const express = require("express");
const router = express.Router();
const limiter = require("../../utils/limiter");
const HospitalMiddleware = require("../../middleware/HospitalMiddlware");
const {
  GetAllRequests,
  GetRequestById,
  EditRequest,
  UpdateRequestStatus,
  DeleteRequest,
  DeleteRequestsByStatus,
} = require("../../controllers/HospitalControllers/handlingBlood-request");
const {
  CreateMyRequest,
  GetPublicRequests,
  GetMyRequests,
  UpdateMyRequest,
  DeleteMyRequest,
} = require("../../controllers/HospitalControllers/hospital-blood-request");
const validate = require("../../middleware/validate");
const {
  idParamsSchema,
  publicBloodRequestQuerySchema,
  hospitalMyRequestQuerySchema,
  allBloodRequestQuerySchema,
  createHospitalBloodRequestSchema,
  updateHospitalBloodRequestSchema,
  editBloodRequestSchema,
  updateBloodStatusSchema,
  deleteStatusParamsSchema,
} = require("../../middleware/validationSchemas");

router.get(
  "/all-blood-requests",
  limiter,
  HospitalMiddleware,
  validate({ query: allBloodRequestQuerySchema }),
  GetAllRequests,
);
router.delete(
  "/delete-status/bulk/:status",
  limiter,
  HospitalMiddleware,
  validate({ params: deleteStatusParamsSchema }),
  DeleteRequestsByStatus,
);
router.get(
  "/blood-request/:id",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema }),
  GetRequestById,
);
router.put(
  "/edit-blood-request/:id",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema, body: editBloodRequestSchema }),
  EditRequest,
);
router.patch(
  "/update--blood-request/:id/status",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema, body: updateBloodStatusSchema }),
  UpdateRequestStatus,
);
router.delete(
  "/delete-blood-request/:id",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema }),
  DeleteRequest,
);

router.get(
  "/public-blood-requests",
  limiter,
  validate({ query: publicBloodRequestQuerySchema }),
  GetPublicRequests,
);
router.post(
  "/create-my-blood-request",
  limiter,
  HospitalMiddleware,
  validate({ body: createHospitalBloodRequestSchema }),
  CreateMyRequest,
);
router.get(
  "/my-blood-requests",
  limiter,
  HospitalMiddleware,
  validate({ query: hospitalMyRequestQuerySchema }),
  GetMyRequests,
);
router.put(
  "/edit-my-blood-request/:id",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema, body: updateHospitalBloodRequestSchema }),
  UpdateMyRequest,
);
router.delete(
  "/delete-my-blood-request/:id",
  limiter,
  HospitalMiddleware,
  validate({ params: idParamsSchema }),
  DeleteMyRequest,
);

module.exports = router;
