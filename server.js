const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./models");
const Role = db.role;
const Level =db.level;

// const dbConfig = require("./config/db.config");
// `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`

var corsOption ={
  port:"http://localhost:8081"
};

//middlewares
app.use(cors(corsOption));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//database connection
db.mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Lexx application." });
});

//routes
require('./routes/auth.route')(app);
require('./routes/user.route')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      for (const role of db.ROLES){
        new Role({
          name: role
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log(`added '${role}' to roles collection`);
        });
      }

      for (const level of db.LEVELS){
        new Level({
          name:level.name,
          lessons:level.lessons
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log(`added '${level.name}' to levels collection`);
        });
      }
    }
  });
}