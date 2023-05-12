const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const {Agent} = require("../model/TripDetails");

router.post("/admin/add-agent", async (req, res) => {
    var { name, email, phone} = req.body;
    if (!name || !email || !phone) {
        return res.status(422).json({ message: "Fields are not correctly filled." });
    }
    try {
        const AgentExist = await Agent.findOne({ email: email });
        if (AgentExist) {
            return res.status(422).json({ message: "Agent already exist" });
        }

        const agent = new Agent({
            name,
            email,
            phone
        });
        await agent.save();

        if (agent) {
            return res.status(200).json({ message: "Successfully added agent" });
        }

    } catch (err) {
        console.log(err);
    }
});

router.get("/admin/agents", authenticate, async (req, res) => {
    const allagents = await Agent.find();
    if (!allagents) {
        res.status(502).send("No Agents");
    }
    else {
        req.allagents = allagents
        res.status(200).send(req.allagents);
    }
});

module.exports = router;