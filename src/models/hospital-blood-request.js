const mongoose = require("mongoose");

const hospitalBloodRequestSchema = new mongoose.Schema({
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
        required:true
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

// Hospital pages list and filter requests owned by a hospital.
hospitalBloodRequestSchema.index({hospital:1,createdAt:-1});
hospitalBloodRequestSchema.index({hospital:1,status:1,createdAt:-1});

// Public listings always start with open requests and may add blood type or urgency.
hospitalBloodRequestSchema.index({status:1,createdAt:-1});
hospitalBloodRequestSchema.index({status:1,bloodtype:1,createdAt:-1});
hospitalBloodRequestSchema.index({status:1,urgency:1,createdAt:-1});

module.exports = mongoose.model("HospitalBloodRequests", hospitalBloodRequestSchema);