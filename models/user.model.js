const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname:String,
  lastname:String,
  username:String,
  email:String,
  password:String,
  roles:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Role"
    }
  ],
  level:
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Level"
    }
  
})

const User = mongoose.model("user",userSchema);

module.exports= User;