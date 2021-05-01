const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db={};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.level = require("./level.model");
db.exercise = require("./exercise.model");

db.ROLES = ["user", "admin","teacher"];
db.LEVELS = [
  {name:"introductory",lessons:16},
  {name:"basic",lessons:15},
  {name:"intermediate",lessons:10},
  {name:"pre-advanced",lessons:20},
  {name:"advanced",lessons:20},
  {name:"summit I",lessons:20},
  {name:"summit II",lessons:20}
]
module.exports = db;