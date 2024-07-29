const mongoose = require("mongoose");
const { Schema } = mongoose;

const teamMemberSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true }
})

const TeamMember = mongoose.model("teamMember", teamMemberSchema);

module.exports = TeamMember;
