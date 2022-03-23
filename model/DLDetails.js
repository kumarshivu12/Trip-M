const mongoose = require("mongoose");

const dlSchema = new mongoose.Schema({
  licenceno: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  validUpto: {
    type: Date,
    required: true,
  },
  OLAuthority: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const dl = mongoose.model("DL", dlSchema);

module.exports = dl;
