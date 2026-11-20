const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    bloodtype:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    },
    hospitalname:{
        type:String,
        required:true,
        trim:true
    },
    bloodrequirement:{
        type:Number,
        required:true,
        min:1
    }
},{timestamps:true});

module.exports = mongoose.model("BloodRequests", bloodRequestSchema);