const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  cid: {
    type: String,
    required: true,
  },
  fromPlace: {
    type: String,
    required: true,
  },
  fromCity: {
    type: String,
    required: true,
  },
  toPlace: {
    type: String,
    required: true,
  },
  toCity: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const trip = mongoose.model("TRIP", tripSchema);

module.exports = trip;
