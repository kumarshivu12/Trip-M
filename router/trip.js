const express = require("express");
const router = express.Router();
const authenticateDriver = require("../middleware/authenticateDriver");

require("../db/conn");

const {Customer, Trip, Agent} = require("../model/TripDetails");
const Vehicle = require("../model/Vehicle");
const EXPENSE = require("../model/Expense");

// async-await
// signup

var newtrip, newcustomer, Customerid, Driverid;

router.post("/driver/customer", authenticateDriver, async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone ) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {
    const CustomerExist = await Customer.findOne({ phone: phone }, { name: name });
    if (CustomerExist) {
      Customerid = CustomerExist._id;
    }else{
      newcustomer = new Customer({ name, phone });
      await newcustomer.save();
      Customerid = newcustomer._id;
    }

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/driver/customer/trip-details", authenticateDriver, async (req, res) => {
  Driverid = req.userid;
  const { bookingDate, tripDate, agent, vehicle, tripType, fromPlace, toPlace, totalKM, GrossIncome, Commission } = req.body;
  if (!bookingDate || !tripDate || !agent || !vehicle || !tripType ||  !fromPlace || !toPlace || !totalKM ||  !GrossIncome || !Commission) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {
    newtrip = new Trip({
      bookingDate: bookingDate,
      tripDate: tripDate,
      agent: agent,
      vehicle: vehicle,
      tripType: tripType,
      cid: Customerid,
      did: Driverid,
      fromPlace: fromPlace,
      toPlace: toPlace,
      totalKM: totalKM,
      GrossIncome: GrossIncome,
      Commission: Commission
    });
    await newtrip.save();
    if(newtrip){
      return res.status(200).json({ message: "Successfully added new trip" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/driver/customer/trip-details", async (req, res) => {
    const allagents = await Agent.find();
    const allvehicles = await Vehicle.find();
    if (!allagents) {
        res.status(502).send("No agents");
    }
    else if (!allvehicles) {
      res.status(502).send("No vehicles");
    }
    else {
      const responseData = {
        agents: allagents,
        vehicles: allvehicles
      }
      const jsonContent = JSON.stringify(responseData);
      res.status(200).send(jsonContent);
    }
});

router.post("/driver/expense", authenticateDriver, async (req, res) => {
  Driverid = req.userid;
  const { expenseDate, expenseType, trip, amount } = req.body;
  if (!expenseDate || !expenseType || !trip || !amount) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {
    const newexpense = new EXPENSE({
      expenseDate: expenseDate, expenseType: expenseType, did: Driverid, trip: trip, amount:amount
    });

    await newexpense.save();
    if(newexpense){
      return res.status(200).json({ message: "Successully added new expense" });
    }
    
  } catch (err) {
    console.log(err);
  }
});

router.get("/driver/expense", authenticateDriver, async (req, res) => {
  const id = req.userid;
  const trips = await Trip.find({ did: id });

  if (trips) {
    res.status(200).send(trips);
  }
  else {
    res.status(502).send("Driver details not found");
  }
});

router.get("/driver/trips", authenticateDriver, async (req, res) => {
  var d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  
  const id = req.userid;
  const todayTrips = await Trip.find({ "tripDate": d, "did": id }).populate('cid');
  const pastTrips = await Trip.find({ "tripDate": { "$lt": d }, "did": id }).sort({ "tripDate": -1 }).populate('cid');
  const upcomingtrip = await Trip.find({ "tripDate": { "$gt": d }, "did": id }).populate('cid').sort({ "tripDate": 1 });
  const responseData = {
    todayTrips, pastTrips, upcomingtrip
  }

  if(!responseData){
    res.status(502).send("No trips");
  }
  else{
    res.status(200).send(responseData);
  }
});

router.get("/driver/trips/:tripID", authenticateDriver, async (req, res) => {
  const trip = await Trip.findById(req.params.tripID).populate('cid').populate('agent');
  
  if (trip) {
    try {
      const vehicle = await Vehicle.findOne({ regno: trip.vehicle });
      if (vehicle) {
        const responseData = {
          trip: trip,
          vehicle: vehicle
        }
        const jsonContent = JSON.stringify(responseData);
        res.status(200).send(jsonContent);
      }
      else {
        console.log(dl);
        res.status(502).send("Vehicle details not found");
      }
    } catch (err) {
      console.log(err);
    }
  }
  else {
    res.status(502).send("Trip details not found");
  }
});



module.exports = router;
