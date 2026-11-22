const mongoose = require("mongoose");

const hospitalBloodRequestSchema = new mongoose.Schema({
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true,
        index:true
    },
    hospitalname:{
        type:String,
        required:true,
        trim:true
    },
    bloodtype:{
        type:String,
        required:true,
        enum:["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    },
    bloodrequirement:{
        type:Number,
        required:true,
        min:1
    },
    urgency:{
        type:String,
        enum:["normal","urgent","critical"],
        default:"normal"
    },
    contactnumber:{
        type:String,
        trim:true,
        default:""
    },
    description:{
        type:String,
        trim:true,
        default:""
    },
    neededBy:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        enum:["open","fulfilled","closed"],
        default:"open"
    }
},{timestamps:true});

module.exports = mongoose.model("HospitalBloodRequests", hospitalBloodRequestSchema);