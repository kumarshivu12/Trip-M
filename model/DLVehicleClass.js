const mongoose = require("mongoose");

const dlvehicleclassSchema = new mongoose.Schema({
  licenceno: {
    type: String,
    required: true,
  },
  vehicleClass: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

const dlvehicleclass = mongoose.model("DLVECHICLECLASS", dlvehicleclassSchema);

module.exports = dlvehicleclass;
