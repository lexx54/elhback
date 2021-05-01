const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  level:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Level"
  },
  lesson:String,
  answers:[{type:String}]
})

const Exercise = mongoose.model("exercise",exerciseSchema);

module.exports = Exercise;