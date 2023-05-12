const mongoose = require("mongoose");
const trip = require('./TripDetails.js');

const expenseSchema = new mongoose.Schema({
    expenseDate: {
        type: Date,
        required: true,
    },
    expenseType: {
        type: String,
        required: true,
    },
    did: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TRIP',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },

});


const expense = mongoose.model("EXPENSE", expenseSchema);
module.exports = expense;