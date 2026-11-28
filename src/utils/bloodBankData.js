const BloodBankLogin = require("../models/bloodbank-login");

const SeedBloodBanks = async () => {
  try {
    const bloodbanks = await BloodBankLogin.insertMany([
      {
        bloodbankname: "Fatimid Foundation Blood Bank",
        bloodbankId: "fatimid001",
        password: "fatimid123",
      },
      {
        bloodbankname: "Chughtai Blood Bank",
        bloodbankId: "chughtai001",
        password: "chughtai123",
      },
      {
        bloodbankname: "Shaukat Khanum Blood Bank",
        bloodbankId: "shaukat001",
        password: "shaukat123",
      },
    ]);
    console.log(`Blood banks added: ${bloodbanks.length}`);
    return { success: true, count: bloodbanks.length };
  } catch (error) {
    if (error.code === 11000) {
      console.log("Blood banks already exist");
      return { success: false, message: "Blood banks already exist" };
    }
    console.error("Failed to add blood bank details", error.message);
    return { success: false, message: "Failed to add blood bank details" };
  }
};

module.exports = SeedBloodBanks;