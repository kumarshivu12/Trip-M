const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

require("../db/conn");
const User = require("../model/DriverDetails");
const DLD = require("../model/DLDetails");
const DLVC = require("../model/DLVehicleClass");

router.get("/", (req, res) => {
  res.send("home page from server router js");
});

// async-await
// signup

var user, dl, dlvc;
router.post("/signup", async (req, res) => {
  var { name, email, phone, city, DLNo, password, cpassword } = req.body;
  if (!name || !email || !phone || !city || !DLNo || !password || !cpassword) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    const UserExist = await User.findOne({ email: email });
    if (UserExist) {
      return res.status(422).json({ error: "User already exist" });
    }
    const dlExist = await User.findOne({ DLNo: DLNo });
    if (dlExist) {
      return res.status(422).json({ error: "Licence already exist" });
    }
    if(password != cpassword){
      return res.status(422).json({ error: "password incorrect" });
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
    
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup/dldetails", async (req, res) => {
  const { issueDate, validUpto, OLAuthority, dob, address } = req.body;
  if ( !issueDate || !validUpto || !OLAuthority || !dob || !address) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
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
    
  } catch (err) {
    console.log(err);
  }
});

router.post("/signup/dldetails/dlvehicleclass", async (req, res) => {
  const { vehicleClass, issueDate, expiryDate } = req.body;
  if ( !vehicleClass || !issueDate || !expiryDate ) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
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
  } catch (err) {
    console.log(err);
  }
});

// signin

router.post('/signin', async (req, res) => {
  try{
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(404).json({error: "PLZ fill the data"})
    }
    const userLogin = await User.findOne({email:email});

    if(userLogin){
      const isMatch = await bycrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "not found" });
      } else {
        
        const token = await userLogin.generateAuthToken();
        res.cookie("jwtoken", token, {
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


module.exports = router;


// router.post("/register", (req, res) => {
//   const { name, email, phone, city, DLNo, password, cpassword } = req.body;
//   if (!name || !email || !phone || !city || !DLNo || !password || !cpassword) {
//     return res.status(422).json({ error: "Fields are not correctly filled." });
//   }
//   // console.log(name);
//   // console.log(email);
//   // res.json({ messege: req.body });
//   User.findOne({ email: email })
//     .then((UserExist) => {
//       if (UserExist) {
//         return res.status(422).json({ error: "User already exist" });
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
//           res.status(201).json({ message: "Registration Successfull" });
//         })
//         .catch((err) => res.status(500).json({ error: "Registration Failed" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });