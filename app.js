const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

require("./db/conn");
app.use(express.json());
// The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.

app.use(require("./router/auth")); // router files linking
const PORT = process.env.PORT;

// middleware

const middleware = (req, res, next) => {
  console.log("middleware");
};

// app.get("/", (req, res) => {
//   res.send("home page");
// });

app.get("/trip-details", middleware, (req, res) => {
  res.send("trip page");
});

app.get("/income", middleware, (req, res) => {
  res.send("startup page");
});

app.get("/signin", (req, res) => {
  res.send("signup page");
});

app.listen(PORT, () => {
  console.log(`shreya sharma hello ${PORT} `);
});
