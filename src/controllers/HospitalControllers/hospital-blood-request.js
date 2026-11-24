const HospitalBloodRequests = require("../../models/hospital-blood-request");

const getHospitalId = (req) =>
  req.hospital?._id || req.hospitalId || req.user?._id;

const CreateMyRequest = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);

    if (!hospitalId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      hospitalname,
      bloodtype,
      bloodrequirement,
      urgency,
      contactnumber,
      description,
      neededBy,
    } = req.body;

    if (!hospitalname || !bloodtype || !bloodrequirement) {
      return res
        .status(400)
        .json({
          success: false,
          message: "hospitalname, bloodtype and bloodrequirement are required",
        });
    }

    const newRequest = await HospitalBloodRequests.create({
      hospital: hospitalId,
      hospitalname,
      bloodtype,
      bloodrequirement,
      urgency,
      contactnumber,
      description,
      neededBy,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Request created successfully",
        data: newRequest,
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const GetPublicRequests = async (req, res) => {
  try {
    const { bloodtype, urgency, search, page = 1, limit = 20 } = req.query;

    const filter = { status: { $eq: "open", $ne: "accepted" } };

    if (bloodtype) {
      filter.bloodtype = bloodtype;
    }

    if (urgency) {
      filter.urgency = urgency;
    }

    if (search) {
      const regex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
      filter.$or = [{ hospitalname: regex }, { description: regex }];
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const [requests, total] = await Promise.all([
      HospitalBloodRequests.aggregate([
        { $match: filter },
        {
          $addFields: {
            urgencyRank: {
              $switch: {
                branches: [
                  { case: { $eq: ["$urgency", "critical"] }, then: 0 },
                  { case: { $eq: ["$urgency", "urgent"] }, then: 1 },
                  { case: { $eq: ["$urgency", "normal"] }, then: 2 },
                ],
                default: 2,
              },
            },
          },
        },
        { $sort: { urgencyRank: 1, createdAt: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum },
        { $project: { hospital: 0, urgencyRank: 0 } },
      ]),
      HospitalBloodRequests.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const GetMyRequests = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);

    if (!hospitalId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const filter = { hospital: hospitalId };

    if (status) {
      if (!["open", "fulfilled", "closed"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status filter" });
      }
      filter.status = status;
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const [requests, total, grouped] = await Promise.all([
      HospitalBloodRequests.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      HospitalBloodRequests.countDocuments(filter),
      HospitalBloodRequests.aggregate([
        { $match: { hospital: hospitalId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    const counts = { open: 0, fulfilled: 0, closed: 0 };

    grouped.forEach((g) => {
      if (g._id in counts) {
        counts[g._id] = g.count;
      }
    });

    counts.all = counts.open + counts.fulfilled + counts.closed;

    return res.status(200).json({
      success: true,
      data: requests,
      counts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const UpdateMyRequest = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);

    if (!hospitalId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    const editableFields = [
      "hospitalname",
      "bloodtype",
      "bloodrequirement",
      "urgency",
      "contactnumber",
      "description",
      "neededBy",
      "status",
    ];
    const optionalFields = ["contactnumber", "description", "neededBy"];
    const updates = {};

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (req.body[field] !== "" || optionalFields.includes(field)) {
          updates[field] =
            field === "neededBy" && req.body[field] === ""
              ? null
              : req.body[field];
        }
      }
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No valid fields provided to update",
        });
    }

    const updated = await HospitalBloodRequests.findOneAndUpdate(
      { _id: id, hospital: hospitalId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Request updated successfully",
        data: updated,
      });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request id" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const DeleteMyRequest = async (req, res) => {
  try {
    const hospitalId = getHospitalId(req);

    if (!hospitalId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    const deleted = await HospitalBloodRequests.findOneAndDelete({
      _id: id,
      hospital: hospitalId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Request deleted successfully",
        data: deleted,
      });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request id" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  CreateMyRequest,
  GetPublicRequests,
  GetMyRequests,
  UpdateMyRequest,
  DeleteMyRequest,
};