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
    },
    status:{
        type:String,
        enum:["pending","accepted","blood_available","in_transit","done","rejected","cancelled"],
        default:"pending"
    },
    statusNote:{
        type:String,
        default:""
    },
    completedAt:{
        type:Date,
        default:null
    }
},{timestamps:true});

module.exports = mongoose.model("BloodRequests", bloodRequestSchema);