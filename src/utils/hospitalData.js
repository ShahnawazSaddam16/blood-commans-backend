const HospitalLogin = require("../models/hospital-logins");

const SeedHospitals = async () => {
  try {
    const hospitals = await HospitalLogin.insertMany([
      {
        hospitalname: "Jinnah Hospital",
        hospitalId: "jinnah001",
        password: "jinnah123",
      },
      {
        hospitalname: "Mayo Hospital",
        hospitalId: "mayo001",
        password: "mayo123",
      },
      {
        hospitalname: "Services Hospital",
        hospitalId: "services001",
        password: "services123",
      },
    ]);
    console.log(`Hospitals added: ${hospitals.length}`);
    return { success: true, count: hospitals.length };
  } catch (error) {
    if (error.code === 11000) {
      console.log("Hospitals already exist");
      return { success: false, message: "Hospitals already exist" };
    }
    console.error("Failed to add hospital details", error.message);
    return { success: false, message: "Failed to add hospital details" };
  }
};

module.exports = SeedHospitals;
