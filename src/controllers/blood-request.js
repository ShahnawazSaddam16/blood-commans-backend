require("dotenv").config();
const jwt = require("jsonwebtoken");
const BloodRequests = require("../models/blood-request");

const cookieOptions = {
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite:"lax",
    maxAge:30 * 24 * 60 * 60 * 1000
};

const GenerateRequest = async(req,res) => {
    try{
        const {name, email, bloodtype, hospitalname, bloodrequirement, rememberMe} = req.body;

        if(!name || !email || !bloodtype || !hospitalname || !bloodrequirement){
            return res.status(400).json({success:false, message:"All fields are required"});
        }

        const newRequest = await BloodRequests.create({
            name,
            email,
            bloodtype,
            hospitalname,
            bloodrequirement
        });

        if(rememberMe){
            const token = jwt.sign({email:newRequest.email}, process.env.JWT_SECRET, {expiresIn:"30d"});
            res.cookie("remember_token", token, cookieOptions);
        }else{
            res.clearCookie("remember_token", {httpOnly:cookieOptions.httpOnly, secure:cookieOptions.secure, sameSite:cookieOptions.sameSite});
        }

        return res.status(201).json({success:true, message:"Blood request created successfully", data:newRequest});
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const GetRememberedInfo = async(req,res) => {
    try{
        const token = req.cookies.remember_token;

        if(!token){
            return res.status(200).json({success:true, data:null});
        }

        let decoded;
        try{
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        }catch(err){
            res.clearCookie("remember_token", {httpOnly:cookieOptions.httpOnly, secure:cookieOptions.secure, sameSite:cookieOptions.sameSite});
            return res.status(200).json({success:true, data:null});
        }

        const lastRequest = await BloodRequests.findOne({email:decoded.email}).sort({createdAt:-1});

        if(!lastRequest){
            return res.status(200).json({success:true, data:null});
        }

        return res.status(200).json({
            success:true,
            data:{
                name:lastRequest.name,
                email:lastRequest.email,
                bloodtype:lastRequest.bloodtype,
                hospitalname:lastRequest.hospitalname
            }
        });
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

module.exports = {GenerateRequest, GetRememberedInfo};