const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./src/config/dbConnection");
const cookieParser = require("cookie-parser");

const bloodRequestRoutes = require("./src/routes/blood-requestRoutes");

dotenv.config();

const app = express();
const Port = process.env.PORT || 5000;

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

app.use("/api/blood-requests", bloodRequestRoutes);

// Mongoose connect
dbConnection();

app.listen(Port, (err) => {
  if (err) {
    console.error("❌❌ Error Connecting Server", err);
  } else {
    console.log(`✅✅ Server Running at http://localhost:${Port}`);
  }
});