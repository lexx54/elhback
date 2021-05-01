const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Level = db.level;
const Exercise = db.exercise;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const body=req.body;
  const user = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    username: body.username,
    email: body.email,
    password: bcrypt.hashSync(body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (body.roles) {
      console.log("getting in roles", body.roles)
      Role.find(
        {
          name: { $in: body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      console.log("user in roles", body.roles)
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];

        Level.findOne(
          {
            name: { $in:body.level }
          },
          (err,lvl)=> {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            if (lvl) user.level=[lvl._id];
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
    
              res.send({ message: "User was registered successfully!" });
            });
          })
      });
    }
  });
};

exports.signin = (req, res) => {
  const body = req.body;
  User.findOne({
    username: body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      

      const authorities = [];
      

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      if (user.level) {
        Level.findOne({_id:user.level})
        .exec((err,lvl)=>{

          // const levelInfo=`You are in ${lvl.name} and it has ${lvl.lessons} Lessons`;

          res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            level:{id:lvl._id,name:lvl.name,lessons:lvl.lessons}
          });
        })
      } else{
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      }
    });
};

//testing
exports.saveExercise = (req , res)=>{
  const body = req.body;
  const exercise = new Exercise({
    lesson: body.lesson,
    answers: body.answers
  })

  exercise.save((err,exer)=>{
    if(err){
      res.status(500).send({message:500});
      return;
    }

    Level.findOne({name:{$in:body.level}})
      .then(lvl =>{
        exercise.level=lvl.id;
        
        exercise.save(err=>{
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Exercise was registered successfully!" });
        });
        })
        .catch(err=>{
          res.status(500).send({message:err});
        return;
      })
  })
}