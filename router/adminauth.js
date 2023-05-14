const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");


require("../db/conn");
const Admin = require("../model/AdminDetails");
const Drivers = require("../model/DriverDetails");
const DL = require("../model/DLDetails");
const DLVC = require("../model/DLVehicleClass");
const {Trip} = require("../model/TripDetails");

const getBeginningOfTheWeek = (now) => {
    const days = (now.getDay() + 7 - 1) % 7;
    now.setDate(now.getDate() - days);
    now.setHours(0, 0, 0, 0);
    return now;
};

router.get("/admin", authenticate, async (req, res) => {
    const thisYear = new Date().getFullYear();

    const trip = await Trip.aggregate([
        {
            $match: { "tripDate": { $gte: new Date(thisYear, 0o1, 0o1), $lt: new Date(thisYear, 12, 31) } }
        },
        {
            $group:
            {
                _id: { month: { $month: "$tripDate" }, year: {$year: "$tripDate"} },
                totalAmount: { $sum: "$GrossIncome" },
                commission: { $sum: "$Commission" },
                trips: {$sum: 1}
            }
            
        }
        
    ]).exec();

    const week = await Trip.aggregate([
        {
            $match: {"tripDate": { $gte: getBeginningOfTheWeek(new Date()), $lt: new Date() }}
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
            $match: { "tripDate": { $gte: new Date(thisYear, 0o1, 0o1), $lt: new Date(thisYear, 12, 31) } }
        },
        {
            $group:
            {
                _id: null,
                total: { $sum: "$GrossIncome" }
            }
        }
        
    ]).exec();

    const responseData = {
        admin: req.name,
        trip: trip,
        week: week,
        year: year
    }
    
    if (!trip) {
        res.status(502).send("No trips");
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


// signin

router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ error: "PLZ fill the data" })
        }
        const adminLogin = await Admin.findOne({ email: email });

        if (adminLogin) {
            const isMatch = await bycrypt.compare(password, adminLogin.password);

            if (!isMatch) {
                res.status(400).json({ error: "not found" });
            } else {
                const token = await adminLogin.generateAuthToken();
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 864000000),
                    httpOnly: true
                });
                res.json({ message: "admin signin success" });
            }
        } else {
            res.json({ message: "Invalid Credentials" });

        }

    }
    catch (err) {
        console.log(err);
    }
});

router.get("/admin", authenticate, (req, res) => {
    
});

router.get("/admin-logout", authenticate, (req, res) => {
    res.clearCookie("jwtoken", {path: '/'});
    res.status(200).send("Logout")
});

router.get("/admin/drivers", authenticate, async (req, res) => {
    const alldrivers = await Drivers.find();
    if (!alldrivers) {
        res.status(502).send("No drivers");
    }
    else{
        req.alldrivers = alldrivers
        res.status(200).send(req.alldrivers);
    }
});

router.get("/admin/profile/:driverID", authenticate, async (req, res) => {
    const Onedriver = await Drivers.findById(req.params.driverID);

    if(Onedriver){
        try {
            const dl = await DL.findOne({ licenceno: Onedriver.DLNo });
            const dlvc = await DLVC.find({ licenceno: Onedriver.DLNo });
            if (dl) {
                const responseData = {
                    name: Onedriver.name,
                    email: Onedriver.email,
                    phone: Onedriver.phone,
                    city: Onedriver.city,
                    dl: Onedriver.DLNo,
                    iD: dl.issueDate,
                    valid: dl.validUpto,
                    ol: dl.OLAuthority,
                    dob: dl.dob,
                    address: dl.address,
                    vc : dlvc
                }
                const jsonContent = JSON.stringify(responseData);
                res.status(200).send(jsonContent);
            }
            else {
                console.log(dl);
                res.status(502).send("Licence details not found");
            }
        } catch (err) {
            console.log(err);
        }
        
    }
    else{
        res.status(502).send("Driver details not found");
    }
});

// const requestListener = (req, res) => {
//     console.log("Request is Incoming");

//     const responseData = {
//         message: "Hello, GFG Learner",
//         articleData: {
//             articleName: "How to send JSON response from NodeJS",
//             category: "NodeJS",
//             status: "published"
//         },
//         endingMessage: "Visit Geeksforgeeks.org for more"
//     }

//     const jsonContent = JSON.stringify(responseData);
//     res.end(jsonContent);
// };
//  try to use findbyId and do reset the rest. Hope this works.

module.exports = router;


