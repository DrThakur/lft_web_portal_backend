const mongoose = require("mongoose");
const { Schema } = mongoose; 
const TeamMember = require("./teamMemberModel")

const teamSchema = new mongoose.Schema({
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true } ,
    name: { type: String, required: true },
    members: [{type:Schema.Types.ObjectId, ref:"TeamMember"}] // Array of team member subdocuments
})

const Team = mongoose.model("team", teamSchema);

module.exports = Team;
