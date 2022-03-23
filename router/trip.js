const express = require("express");
const router = express.Router();

require("../db/conn");
const trip = require("../model/TripDetails");
router.get("/", (req, res) => {
  res.send("home page from server router js");
});

// async-await
router.post("/trip-details", async (req, res) => {
  const { bookingDate, fromDate, toDate, cid, fromPlace, fromCity, toPlace, toCity, amount } = req.body;
  if (!bookingDate || !fromDate || !toDate || !cid || !fromPlace || !fromCity || !toPlace, !toCity || !amount) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    const newtrip = new trip({
      bookingDate,
      fromDate,
      toDate,
      cid,
      fromPlace,
      fromCity,
      toPlace,
      toCity,
      amount,
    });
    await newtrip.save();
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
