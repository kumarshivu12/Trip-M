const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

});

const Agent = mongoose.model("AGENT", agentSchema);

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

const Customer = mongoose.model("CUSTOMER", customerSchema);

const tripSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: true,
  },
  tripDate: {
    type: Date,
    required: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AGENT',
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    required: true,
  },
  cid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CUSTOMER',
    required: true,
  },
  did: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fromPlace: {
    type: String,
    required: true,
  },
  toPlace: {
    type: String,
    required: true,
  },
  totalKM: {
    type: Number,
    required: true,
  },
  GrossIncome: {
    type: Number,
    required: true,
  },
  Commission: {
    type: Number,
    required: true,
  },
  
});

const Trip = mongoose.model("TRIP", tripSchema);

module.exports = {Trip, Customer, Agent};
