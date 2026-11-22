const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./src/config/dbConnection");
const cookieParser = require("cookie-parser");

const bloodRequestRoutes = require("./src/routes/blood-requestRoutes");
const HospitalLoginRoutes = require("./src/routes/HospitalRoutes/hospital-loginRoutes");
const HospitalbloodRequestRoutes = require("./src/routes/HospitalRoutes/blood-requestRoutes");
const hospitalData = require("./src/utils/hospitalData");

dotenv.config();

const app = express();
const Port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cookieParser()); 


app.use(cors({
  origin: ["http://localhost:3000", "https://resume-ai.buttnetworks.com"],
  credentials: true
}));

// Routes
app.get("/", async(req,res)=>{
    res.status(200).json({success: true, message: "Server Runnin Successfully"});
});
app.use("/api/data", hospitalData);

app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/hospital-auth", HospitalLoginRoutes);
app.use("/api/hospital-blood-request", HospitalbloodRequestRoutes);

// Mongoose connect
dbConnection();

app.listen(Port, (err) => {
  if (err) {
    console.error("❌❌ Error Connecting Server", err);
  } else {
    console.log(`✅✅ Server Running at http://localhost:${Port}`);
  }
});