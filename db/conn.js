const mongoose = require("mongoose");

const DB = process.env.DATABASE; // can't give key directly to variable DB = DATABASE;

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // maybe this thing not needed anymore due to updation DB const will allow env parsing instead of
    // string
  })
  .then(() => console.log("success"))
  .catch((err) => console.log(err));
