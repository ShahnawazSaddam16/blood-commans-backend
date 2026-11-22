const BloodRequests = require("../../models/blood-request");

const STATUSES = ["pending", "accepted", "blood_available", "in_transit", "done", "rejected", "cancelled"];

const TRANSITIONS = {
    pending:["accepted", "rejected", "cancelled"],
    accepted:["blood_available", "cancelled"],
    blood_available:["in_transit", "done", "cancelled"],
    in_transit:["done", "cancelled"],
    done:[],
    rejected:[],
    cancelled:[]
};

const GetAllRequests = async(req,res) => {
    try{
        const {status, bloodtype, search, page = 1, limit = 20} = req.query;

        const filter = {};

        if(status){
            if(status === "active"){
                filter.status = {$in:["accepted", "blood_available", "in_transit"]};
            }else if(STATUSES.includes(status)){
                filter.status = status;
            }else{
                return res.status(400).json({success:false, message:"Invalid status filter"});
            }
        }

        if(bloodtype){
            filter.bloodtype = bloodtype;
        }

        if(search){
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [{name:regex}, {email:regex}, {hospitalname:regex}];
        }

        const pageNum = Math.max(parseInt(page) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

        const [requests, total, grouped] = await Promise.all([
            BloodRequests.find(filter).sort({createdAt:-1}).skip((pageNum - 1) * limitNum).limit(limitNum),
            BloodRequests.countDocuments(filter),
            BloodRequests.aggregate([{$group:{_id:"$status", count:{$sum:1}}}])
        ]);

        const counts = STATUSES.reduce((acc, s) => {
            acc[s] = 0;
            return acc;
        }, {});

        grouped.forEach((g) => {
            if(g._id in counts){
                counts[g._id] = g.count;
            }
        });

        counts.active = counts.accepted + counts.blood_available + counts.in_transit;
        counts.all = grouped.reduce((sum, g) => sum + g.count, 0);

        return res.status(200).json({
            success:true,
            data:requests,
            counts,
            pagination:{
                page:pageNum,
                limit:limitNum,
                total,
                pages:Math.ceil(total / limitNum)
            }
        });
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const GetRequestById = async(req,res) => {
    try{
        const {id} = req.params;

        const request = await BloodRequests.findById(id);

        if(!request){
            return res.status(404).json({success:false, message:"Request not found"});
        }

        return res.status(200).json({
            success:true,
            data:request,
            allowedNextStatuses:TRANSITIONS[request.status] || []
        });
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const EditRequest = async(req,res) => {
    try{
        const {id} = req.params;

        const request = await BloodRequests.findById(id);

        if(!request){
            return res.status(404).json({success:false, message:"Request not found"});
        }

        if(["done", "rejected", "cancelled"].includes(request.status)){
            return res.status(400).json({success:false, message:`Cannot edit a ${request.status} request`});
        }

        const editableFields = ["name", "email", "bloodtype", "hospitalname", "bloodrequirement"];
        const updates = {};

        editableFields.forEach((field) => {
            if(req.body[field] !== undefined && req.body[field] !== ""){
                updates[field] = req.body[field];
            }
        });

        if(Object.keys(updates).length === 0){
            return res.status(400).json({success:false, message:"No valid fields provided to update"});
        }

        const updated = await BloodRequests.findByIdAndUpdate(id, {$set:updates}, {new:true, runValidators:true});

        return res.status(200).json({success:true, message:"Request updated successfully", data:updated});
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const UpdateRequestStatus = async(req,res) => {
    try{
        const {id} = req.params;
        const {status, note} = req.body;

        if(!status || !STATUSES.includes(status)){
            return res.status(400).json({success:false, message:"Invalid status", allowed:STATUSES});
        }

        const request = await BloodRequests.findById(id);

        if(!request){
            return res.status(404).json({success:false, message:"Request not found"});
        }

        const allowed = TRANSITIONS[request.status] || [];

        if(!allowed.includes(status)){
            return res.status(400).json({
                success:false,
                message:`Cannot move request from ${request.status} to ${status}`,
                allowedNextStatuses:allowed
            });
        }

        request.status = status;

        if(note){
            request.statusNote = note;
        }

        if(status === "done"){
            request.completedAt = new Date();
        }

        await request.save();

        return res.status(200).json({
            success:true,
            message:`Request marked as ${status}`,
            data:request,
            allowedNextStatuses:TRANSITIONS[status]
        });
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const DeleteRequest = async(req,res) => {
    try{
        const {id} = req.params;

        const deleted = await BloodRequests.findByIdAndDelete(id);

        if(!deleted){
            return res.status(404).json({success:false, message:"Request not found"});
        }

        return res.status(200).json({success:true, message:"Request deleted successfully", data:deleted});
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

const DeleteRequestsByStatus = async(req,res) => {
    try{
        const {status} = req.params;

        if(!["done", "rejected", "cancelled"].includes(status)){
            return res.status(400).json({success:false, message:"Bulk delete is only allowed for done, rejected or cancelled requests"});
        }

        const result = await BloodRequests.deleteMany({status});

        return res.status(200).json({success:true, message:`Deleted ${result.deletedCount} ${status} requests`, deletedCount:result.deletedCount});
    }catch(error){
        return res.status(500).json({success:false, message:"Server error", error:error.message});
    }
}

module.exports = {
    GetAllRequests,
    GetRequestById,
    EditRequest,
    UpdateRequestStatus,
    DeleteRequest,
    DeleteRequestsByStatus
};