const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./userModel")

const teamSchema = new mongoose.Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  name: { type: String, required: true },
  members: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true  },
      role: {type:String,}, // e.g., Developer, Tester
    },
  ],
});

const Team = mongoose.model("team", teamSchema);

module.exports = Team;
