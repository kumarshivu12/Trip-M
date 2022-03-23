const mongoose = require("mongoose");

const citylistSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const citylist = mongoose.model("CITYLIST", citylistSchema);

module.exports = citylist;
