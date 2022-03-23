const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  regno: {
    type: String,
    required: true,
  },
  ownername: {
    type: String,
    required: true,
  },
  regDate: {
    type: Date,
    required: true,
  },
  engineno: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
});

const vechicle = mongoose.model("VEHICLE", vehicleSchema);

module.exports = vehicle;
