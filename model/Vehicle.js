const mongoose = require("mongoose");


const vehicleSchema = new mongoose.Schema({
  regno: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  vclass: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  cap: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  }
});

const vehicle = mongoose.model("VEHICLE", vehicleSchema);

module.exports = vehicle;
