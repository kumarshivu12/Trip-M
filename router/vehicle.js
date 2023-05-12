const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const Vehicle = require("../model/Vehicle");

router.post("/admin/add-vehicle", authenticate, async (req, res) => {
    var { regno, color, vclass, model, fuel, cap, owner } = req.body;
    if (!regno || !color || !vclass || !model || !fuel || !cap || !owner) {
        return res.status(400).json({ message: "Fields are not correctly filled." });
    }
    try {
        const VehicleExist = await Vehicle.findOne({ regno: regno });
        if (VehicleExist) {
            return res.status(400).json({ message: "Vehicle already exist" });
        }

        const vehicle = new Vehicle({
            regno,
            color,
            vclass,
            model,
            fuel,
            cap,
            owner
        });
        await vehicle.save();

        return res.status(200).json({message: "Vehicle successfully added"});
    } catch (err) {
        console.log(err);
    }
});

router.get("/admin/vehicles", authenticate, async (req, res) => {
    const allvehicles = await Vehicle.find();
    if (!allvehicles) {
        res.status(502).send("No Vehicles");
    }
    else {
        req.allvehicles = allvehicles
        res.status(200).send(req.allvehicles);
    }
});

router.get("/admin/vehicles/profile/:vehicleID", authenticate, async (req, res) => {
    const OneVehicle = await Vehicle.findById(req.params.vehicleID);

    if (OneVehicle) {
        const jsonContent = JSON.stringify(OneVehicle);
        res.status(200).send(jsonContent);
    }
    else {
        res.status(502).send("Vehicle details not found");
    }
});

module.exports = router;