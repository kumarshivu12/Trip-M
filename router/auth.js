const express = require("express");
const router = express.Router();

require("../db/conn");
const User = require("../model/DriverDetails");
const DLD = require("../model/DLDetails");
const DLVC = require("../model/DLVehicleClass");

router.get("/", (req, res) => {
  res.send("home page from server router js");
});

// async-await
// signup
router.post("/register", async (req, res) => {
  const { name, email, phone, city, DLNo, password, cpassword } = req.body;
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
    const user = new User({
      name,
      email,
      phone,
      city,
      DLNo,
      password,
      cpassword,
    });
    await user.save();
  } catch (err) {
    console.log(err);
  }
});

router.post("/register/dl-details", async (req, res) => {
  const { licenceno, issueDate, validUpto, OLAuthority, dob, address } = req.body;
  if (!licenceno || !issueDate || !validUpto || !OLAuthority || !dob || !address) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {
    
    const dl = new DLD({
      licenceno,
      issueDate,
      validUpto,
      OLAuthority,
      dob,
      address,
    });
    await dl.save();
  } catch (err) {
    console.log(err);
  }
});

router.post("/register/dl-details/dl-vehicleclass", async (req, res) => {
  const { licenceno, vehicleClass, issueDate, expiryDate } = req.body;
  if (!licenceno || !vehicleClass || !issueDate || !expiryDate ) {
    return res.status(422).json({ error: "Fields are not correctly filled." });
  }
  try {

    const dlvc = new DLVC({
      licenceno,
      vehicleClass,
      issueDate,
      expiryDate,
    });
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

    if(!userLogin){
      res.status(400).json({error: "not found"});
    }else{
      res.json({message: "user signin success"});
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