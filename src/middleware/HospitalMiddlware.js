require("dotenv").config();

const jwt = require("jsonwebtoken");
const HospitalLogin = require("../models/hospital-logins");

const HospitalMiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.hospital_portal_token;

        if(!token){
            return res.status(401).json({message:"Not authenticated"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const hospital = await HospitalLogin.findById(decoded.id);

        if(!hospital){
            return res.status(401).json({message:"Not authenticated"});
        }

        req.hospital = hospital;
        next();
    }catch(error){
        res.status(401).json({message:"Invalid or expired token"});
    }
};

module.exports = HospitalMiddleware;