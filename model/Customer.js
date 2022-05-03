const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
});

const customer = mongoose.model("CUSTOMER", customerSchema);

module.exports = customer;
