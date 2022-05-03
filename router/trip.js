const express = require("express");
const router = express.Router();

require("../db/conn");
const TRIP = require("../model/TripDetails");
const CUSTOMER = require("../model/Customer");


router.get("/", (req, res) => {
  res.send("home page from server router js");
});

// async-await
// signup

var newtrip, newcustomer, Customerid;
var isCustomerExist = false;

router.post("/customer", async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone ) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    const CustomerExist = await CUSTOMER.findOne({ phone: phone }, { name: name });
    if (CustomerExist) {
      isCustomerExist = true;
      Customerid = CustomerExist._id;
    }else{
      newcustomer = new CUSTOMER({ name, phone });
      await newcustomer.save();
      Customerid = newcustomer._id;
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/customer/trip-details", async (req, res) => {
  const { bookingDate, fromDate, toDate, fromPlace, fromCity, toPlace, toCity, amount } = req.body;
  if (!bookingDate || !fromDate || !toDate || !fromPlace || !fromCity || !toPlace, !toCity || !amount) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    newtrip = new TRIP({
      bookingDate: bookingDate,
      fromDate: fromDate,
      toDate: toDate,
      cid: Customerid.toString(),
      fromPlace: fromPlace,
      fromCity: fromCity,
      toPlace: toPlace,
      toCity: toCity,
      amount: amount,
    });
    await newtrip.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
