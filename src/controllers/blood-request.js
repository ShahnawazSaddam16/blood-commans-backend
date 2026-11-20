const BloodRequests = require("../models/blood-request");

const GenerateRequest = async(req,res) => {
    try{
        const {name, email, bloodtype, hospitalname, bloodrequirement} = req.body;

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

        return res.status(201).json({success:true, message:"Blood request created successfully", data:newRequest});
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

module.exports = {GenerateRequest};