const mongoose=require("mongoose");
const db = require("../models");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  db.exercise
    .find({})
    .then(data => res.status(200).json(data))
    .catch(err => res.status(400).send({message:err}))
  // res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.teacherBoard = (req, res) => {
  res.status(200).send("Teacher Content.");
};