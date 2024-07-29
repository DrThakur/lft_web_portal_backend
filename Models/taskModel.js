const mongoose = require("mongoose");
const { Schema } = mongoose;


const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDetails: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "On Hold"],
    default: "Pending",
  },
  health: {
    type: String,
    enum: ["On Track", "At Risk", "Off Track"],
    default: "On Track",
  },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  performance: { type: String, required: true },
  effort: { type: Number, required: true }, // Effort in days
  dependency: { type: Schema.Types.ObjectId, ref: "Task" }, // Self-referencing for task dependency
  plannedStartDate: { type: Date, required: true },
  plannedEndDate: { type: Date, required: true },
  actualStartDate: { type: Date },
  actualEndDate: { type: Date },
  milestoneId: { type: Schema.Types.ObjectId, ref: "Milestone", required: true } // Reference to Milestone
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
