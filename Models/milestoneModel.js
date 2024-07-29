const mongoose = require("mongoose");
const { Schema } = mongoose;

const milestoneSchema = new mongoose.Schema({
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    milestoneName: {type:String,},
    plannedStartDate:{
        type:Date,
    },
    plannedEndDate:{
        type:Date,
    },
    actualStartDate:{
        type:Date,
    },
    actualEndDate:{
        type:Date,
    },
    invoiceValue:{
        type:Number,
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:["Pending","In Progress","Completed","On Hold"],
        default:"Pending",
    },
    health:{
        type:String,
        enum:["On Track","At Risk","Off Track",],
        default:"On Track",
    },
    tasks: [{type:Schema.Types.ObjectId, ref:"Task"}]
})

const Milestone = mongoose.model("milestone", milestoneSchema);

module.exports = Milestone;
