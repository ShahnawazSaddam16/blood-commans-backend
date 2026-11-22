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
    DeleteRequestsByStatus
} = require("../../controllers/HospitalControllers/handlingBlood-request");
const {
    CreateMyRequest,
    GetPublicRequests,
    GetMyRequests,
    UpdateMyRequest,
    DeleteMyRequest
} = require("../../controllers/HospitalControllers/hospital-blood-request");

router.get("/all-blood-requests", limiter, HospitalMiddleware, GetAllRequests);
router.delete("delelte-status/bulk/:status", limiter, HospitalMiddleware, DeleteRequestsByStatus);
router.get("blood-request/:id", limiter, HospitalMiddleware, GetRequestById);
router.put("/edit-blood-request/:id", limiter, HospitalMiddleware, EditRequest);
router.patch("/update--blood-request/:id/status", limiter, HospitalMiddleware, UpdateRequestStatus);
router.delete("/delete-blood-request/:id", limiter, HospitalMiddleware, DeleteRequest);

router.get("/public-blood-requests", limiter, GetPublicRequests);
router.post("/create-my-blood-request", limiter, HospitalMiddleware, CreateMyRequest);
router.get("/my-blood-requests", limiter, HospitalMiddleware, GetMyRequests);
router.put("/edit-my-blood-request/:id", limiter, HospitalMiddleware, UpdateMyRequest);
router.delete("/delete-my-blood-request/:id", limiter, HospitalMiddleware, DeleteMyRequest);

module.exports = router;