const mongoose = require("mongoose");
const { Schema } = mongoose;
const Milestone = require("./milestoneModel");
const Team = require("./teamModel");
const User = require("./userModel");

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
  },
  projectName: {
    type: String,
  },
  keywords: {
    type: String,
  },
  smLeadId: {
   type: Schema.Types.ObjectId, ref: "User"
  },
  smLeadName: {
    type: String,
  },
  loaction: {
    type: String,
  },
  projectDescription: {
    type: String,
  },
  clientName: {
    type: String,
  },
  clientLogoUrl: {
    type: String,
    default: "/images/profile_image.jpg",
  },
  clientAddress: {
    type: String,
  },
  pointOfContact: {
    type: String,
  },
  conatctPersonPhone: {
    type: String,
  },
  conatctPersonemail: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  duration: {
    type: Number,
  },
  softwareBQ: {
    type: Number,
  },
  hardwareBQ: {
    type: Number,
  },
  fpgaBQ: {
    type: Number,
  },
  qaBQ: {
    type: Number,
  },
  totalBQ: {
    type: Number,
  },
  projectManager: { type: Schema.Types.ObjectId, ref: "User" },
  projectRepository: {
    type: String,
  },
  milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  status:{
    type:String
  },
  lastUpdatedStatus:{
    type:String
  }
});

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
