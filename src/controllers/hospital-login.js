require("dotenv").config();

const jwt = require("jsonwebtoken");
const HospitalLogin = require("../models/hospital-logins");

const cookieOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:process.env.NODE_ENV==="production"?"none":"lax",
    maxAge:7*24*60*60*1000
};

const Login = async(req,res)=>{
    try{
        const {hospitalId,password} = req.body;

        if(!hospitalId || !password){
            return res.status(400).json({message:"hospitalId and password are required"});
        }

        const hospital = await HospitalLogin.findOne({hospitalId:hospitalId.toLowerCase().trim()}).select("+password");

        if(!hospital || hospital.password!==password){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token = jwt.sign({id:hospital._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.cookie("hospital_portal_token",token,cookieOptions);

        res.status(200).json({
            message:"Login successful",
            hospital:{
                hospitalname:hospital.hospitalname,
                hospitalId:hospital.hospitalId
            }
        });
    }catch(error){
        res.status(500).json({message:"Login failed"});
    }
};

const Me = async(req,res)=>{
    try{
        const hospital = req.hospital;

        res.status(200).json({
            hospital:{
                hospitalname:hospital.hospitalname,
                hospitalId:hospital.hospitalId
            }
        });
    }catch(error){
        res.status(500).json({message:"Failed to fetch hospital"});
    }
};

const Logout = async(req,res)=>{
    try{
        const {maxAge,...clearOptions} = cookieOptions;

        res.clearCookie("hospital_portal_token",clearOptions);

        res.status(200).json({message:"Logout successful"});
    }catch(error){
        res.status(500).json({message:"Logout failed"});
    }
};

module.exports = {Login, Me, Logout};