require("dotenv").config();
const mongoose = require("mongoose");
const SeedHospitals = require("../utils/hospitalData");
const SeedBloodBanks = require("../utils/bloodBankData");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅✅ MongoDB Connected");
    SeedHospitals();
    SeedBloodBanks();
  } catch (err) {
    console.log("❌❌ MongoDB Can't Connected");
    process.exit(1);
  }
};

module.exports = dbConnection;
