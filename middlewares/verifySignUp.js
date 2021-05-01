const db = require("../models");
const ROLES = db.ROLES;
const LEVELS =db.LEVELS;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const body = req.body;
  // Username
  User.findOne({
    username: body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    // Email
    User.findOne({
      email: body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  const body = req.body;
  if (req.body.roles) {
    for (let i = 0; i < body.roles.length; i++) {
      if (!ROLES.includes(body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignUp;