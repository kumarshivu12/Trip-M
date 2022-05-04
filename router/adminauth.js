const express = require("express");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const Admin = require("../model/AdminDetails");


router.get("/", (req, res) => {
    res.send("home page from server router js");
});

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

router.get("/admin-dashboard", authenticate, (req, res) => {
    res.send(req.rootUser);
});

module.exports = router;


