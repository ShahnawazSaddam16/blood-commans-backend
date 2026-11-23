const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    bloodtype: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    hospitalname: {
      type: String,
      required: true,
      trim: true,
    },
    bloodrequirement: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "blood_available",
        "in_transit",
        "done",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
    statusNote: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Keep the newest remembered request lookup and recent listings efficient.
bloodRequestSchema.index({ email: 1, createdAt: -1 });
bloodRequestSchema.index({ createdAt: -1 });

// Hospital dashboards filter by status and/or blood type, then sort by newest.
bloodRequestSchema.index({ status: 1, createdAt: -1 });
bloodRequestSchema.index({ bloodtype: 1, createdAt: -1 });
bloodRequestSchema.index({ status: 1, bloodtype: 1, createdAt: -1 });

module.exports = mongoose.model("BloodRequests", bloodRequestSchema);
