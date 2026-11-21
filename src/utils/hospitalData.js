const express = require("express");
const router = express.Router();
const HospitalLogin = require("../models/hospital-logins");

router.get("/send-hospital-details", async(req,res)=>{
    try{
        const hospitals = await HospitalLogin.insertMany([
            {hospitalname:"Jinnah Hospital",hospitalId:"jinnah001",password:"jinnah123"},
            {hospitalname:"Mayo Hospital",hospitalId:"mayo001",password:"mayo123"},
            {hospitalname:"Services Hospital",hospitalId:"services001",password:"services123"}
        ]);
        res.status(201).json({message:"Hospitals added",count:hospitals.length});
    }catch(error){
        if(error.code===11000){
            return res.status(409).json({message:"Hospitals already exist"});
        }
        res.status(500).json({message:"Failed to add hospital details"});
    }
});

module.exports = router;