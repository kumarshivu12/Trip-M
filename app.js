const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');


dotenv.config({ path: "./config.env" });

require("./db/conn");
app.use(express.json());
app.use(cookieParser())
// The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.

app.use(require("./router/auth")); // router files linking
app.use(require("./router/trip"));
app.use(require("./router/adminauth"));


const PORT = process.env.PORT;

// middleware

const middleware = (req, res, next) => {
  console.log("middleware");
};

// app.get("/", (req, res) => {
//   res.send("home page");
// });

app.get("/cutomer",  (req, res) => {
  res.send("trip page");
});

app.get("/income", (req, res) => {
  res.send("startup page"); 
});

app.get("/signin", (req, res) => {
  res.send("signup page");
});



app.listen(PORT, () => {
  console.log(`shreya sharma hello ${PORT} `);
});
