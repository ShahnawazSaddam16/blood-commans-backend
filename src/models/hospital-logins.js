const mongoose = require("mongoose");

const hospitalLoginSchema = new mongoose.Schema({
    hospitalname:{
        type:String,
        required:true,
        trim:true
    },
    hospitalId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    }
},{timestamps:true});

module.exports = mongoose.model("HospitalLogin", hospitalLoginSchema);