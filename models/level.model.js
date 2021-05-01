const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  name:String,
  lessons:Number
});

const Level = mongoose.model("Level",levelSchema);

module.exports = Level;