const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

dotenv.config({ path: "./config.env" });

require("./db/conn");
app.use(express.json());
app.use(cookieParser());
// The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.

// cors error
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://6460839423d90c4bd8c69726--chipper-crepe-a7fb0e.netlify.app/"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require("./router/auth")); // router files linking
app.use(require("./router/trip"));
app.use(require("./router/adminauth"));
app.use(require("./router/agent"));
app.use(require("./router/vehicle"));

// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`shreya sharma hello ${PORT} `);
// });
