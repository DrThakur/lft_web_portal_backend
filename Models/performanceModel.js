const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  rating: Number, // Rating given for task completion
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the manager/team lead who gave the rating
  date: { type: Date, default: Date.now }, // Date when the rating was given
});

module.exports = mongoose.model("Performance", performanceSchema);
