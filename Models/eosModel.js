const mongoose = require('mongoose');

const eosSchema = new mongoose.Schema({
employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Projects: [{
    ProjectName: {
      type: String,
      required: true
    },
    ProjectManager: {
      type: String,
      required: true
    },
    Contribution: {  
      type: Number,
      required: true,
      default: 0
    },
    projectRole:{
        type:String,
    },
    projectDuration:{
        type:Number
    }
  }]
});

const EOS = mongoose.model('EOS', eosSchema);

module.exports = EOS;
