const mongoose = require("mongoose");

const cutomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  cid: {
    type: Number,
    required: true,
  },
});

const customer = mongoose.model("CUSTOMER", customerSchema);

module.exports = customer;
