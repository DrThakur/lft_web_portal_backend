const mongoose = require("mongoose");
const { Schema } = mongoose;


const eosSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  month: { type: String }, // Format: YYYY-MM
  year: { type: Number },
  projects: [
    {
      project: {
        type: Schema.Types.ObjectId, // Change from String to ObjectId
        ref: "Project", // Ensure this is correct
        required: true,
      },

      occupancy: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  activities: [
    {
      activity: { type: Schema.Types.ObjectId, ref: "Activity" },
      occupancy: Number, // Hours or percentage involved in the activity
    },
  ],
});

const EOS = mongoose.model("EOS", eosSchema);

module.exports = EOS;
