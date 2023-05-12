const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authenticateDriver = require("../middleware/authenticateDriver");
const mongoose = require("mongoose");

require("../db/conn");
const User = require("../model/DriverDetails");
const DLD = require("../model/DLDetails");
const DLVC = require("../model/DLVehicleClass");
const {Trip} = require("../model/TripDetails");
const Admin = require("../model/AdminDetails");
const Expense = require("../model/Expense");

router.get("/", (req, res) => {
  res.send("home page from server router js");
});

// async-await
// signup
const getBeginningOfTheWeek = (now) => {
  const days = (now.getDay() + 7 - 1) % 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now;
};

var user, dl, dlvc;
router.post("/admin/add-driver", async (req, res) => {
  var { name, email, phone, city, DLNo, password, cpassword } = req.body;
  if (!name || !email || !phone || !city || !DLNo || !password || !cpassword) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {
    const UserExist = await User.findOne({ email: email });
    if (UserExist) {
      return res.status(422).json({ message: "User already exist" });
    }
    const dlExist = await User.findOne({ DLNo: DLNo });
    if (dlExist) {
      return res.status(422).json({ message: "Licence already exist" });
    }
    if(password != cpassword){
      return res.status(422).json({ message: "password incorrect" });
    }
    user = new User({
      name,
      email,
      phone,
      city,
      DLNo,
      password,
      cpassword,
    });
    if(user){
      return res.status(200).json({message : "Successfully added new Driver."});
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/admin/add-driver/dldetails", async (req, res) => {
  const { issueDate, validUpto, OLAuthority, dob, address } = req.body;
  if ( !issueDate || !validUpto || !OLAuthority || !dob || !address) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {
    
    dl = new DLD({
      licenceno: user.DLNo,
      issueDate : issueDate,
      validUpto : validUpto,
      OLAuthority : OLAuthority,
      dob : dob,
      address : address,
    });

    if (dl) {
      return res.status(200).json({ message: "success" });
    }
    
  } catch (err) {
    console.log(err);
  }
});

router.post("/admin/add-driver/dldetails/dlvehicleclass", async (req, res) => {
  const { vehicleClass, issueDate, expiryDate } = req.body;
  if ( !vehicleClass || !issueDate || !expiryDate ) {
    return res.status(422).json({ message: "Fields are not correctly filled." });
  }
  try {

    dlvc = new DLVC({
      licenceno : user.DLNo,
      vehicleClass : vehicleClass,
      issueDate : issueDate,
      expiryDate : expiryDate,
    });
    await user.save();
    await dl.save();
    await dlvc.save();
    if (dlvc) {
      return res.status(200).json({message: "Successfully added new driver."});
    }
  } catch (err) {
    console.log(err);
  }
});

// signin

router.post('/driver-login', async (req, res) => {
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(404).json({ message: "PLZ fill the data"})
    }
    const userLogin = await User.findOne({email:email});

    if(userLogin){
      const isMatch = await bycrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({message: "not found" });
      } else {
        
        const token = await userLogin.generateAuthToken();
        res.cookie("Driverjwtoken", token, {
          expires: new Date(Date.now() + 864000000),
          httpOnly: true
        });
        res.json({ message: "user signin success" });
      }
    }else{
      res.json({ message: "Invalid Credentials" });
      
    }
    
  }
  catch(err){
    console.log(err);
  }
});

router.get("/driver/driver-logout", authenticateDriver, (req, res) => {
  res.clearCookie("Driverjwtoken", { path: '/' });
  res.status(200).send("Logout");
});

router.get("/driver", authenticateDriver, async (req, res) => {
  const id = req.userid;
  var d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  const thisYear = new Date().getFullYear();
  const thismonth = new Date().getMonth();
  const trip = await Trip.aggregate([
    {
      $match: { "tripDate": { $gte: new Date(thisYear, 01, 01), $lt: new Date(thisYear, 12, 31) }, "did" : {$eq: id} }
    },
    {
      $group:
      {
        _id: { month: { $month: "$tripDate" }, year: { $year: "$tripDate" } },
        totalAmount: { $sum: "$GrossIncome" },
        commission: { $sum: "$Commission" },
        trips: { $sum: 1 }
      }

    }

  ]).exec();

  const week = await Trip.aggregate([
    {
      $match: { "tripDate": { $gte: getBeginningOfTheWeek(new Date()), $lte: new Date() }, "did": { $eq: id } }
    },
    {
      $group:
      {
        _id: null,
        total: { $sum: "$GrossIncome" }
      }
    }
  ]).exec();

  const year = await Trip.aggregate([
    {
      $match: { "tripDate": { $gte: new Date(thisYear, 01, 01), $lte: new Date(thisYear, 12, 31) }, "did": { $eq: id } }
    },
    {
      $group:
      {
        _id: null,
        total: { $sum: "$GrossIncome" }
      }
    }

  ]).exec();
  
  const expense = await Expense.aggregate([
    {
      $match: { "expenseDate": { $gte: new Date(thisYear, thismonth, 01), $lte: new Date(thisYear, thismonth, 31) }, "did": { $eq: id } }
    },
    {
      $group:
      {
        _id: "$expenseType",
        total: { $sum: "$amount" }
      }
    }

  ]).exec();

  const upcomingtrip = await Trip.find({ "tripDate": { $gte: d }, "did": id }).sort({"tripDate" : 1})
  .populate('cid').populate('agent');
  
  
  const responseData = {
    driver: req.name,
    trip: trip,
    week: week,
    year: year,
    expense: expense,
    upcomingtrip: upcomingtrip
  }

  if (!responseData) {
    res.status(502).send("No Data");
  }
  else {
    const jsonContent = JSON.stringify(responseData);
    res.status(200).send(jsonContent);
  }
})

// async-await
// signup

var admin;

router.post("/admin-register", async (req, res) => {
  var { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    const AdminExist = await Admin.findOne({ email: email });
    if (AdminExist) {
      return res.status(422).json({ error: "Admin already exist" });
    }
    if (password != cpassword) {
      return res.status(422).json({ error: "password incorrect" });
    }

    admin = new Admin({
      name,
      email,
      password,
      cpassword,
    });
    await admin.save();

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;


// router.post("/register", (req, res) => {
//   const { name, email, phone, city, DLNo, password, cpassword } = req.body;
//   if (!name || !email || !phone || !city || !DLNo || !password || !cpassword) {
//     return res.status(422).json({ message: "Fields are not correctly filled." });
//   }
//   // console.log(name);
//   // console.log(email);
//   // res.json({ messege: req.body });
//   User.findOne({ email: email })
//     .then((UserExist) => {
//       if (UserExist) {
//         return res.status(422).json({ message: "User already exist" });
//       }
//       const user = new User({
//         name,
//         email,
//         phone,
//         city,
//         DLNo,
//         password,
//         cpassword,
//       });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({message "Registration Successfull" });
//         })
//         .catch((err) => res.status(500).json({ error: "Registration Failed" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });