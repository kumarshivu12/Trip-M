const jwt = require("jsonwebtoken")
const Driver = require("../model/DriverDetails");

const authenticateDriver = async (req, res, next) => {
    try {
        const token = req.cookies.Driverjwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await Driver.findOne({ "_id": verifyToken._id, "tokens.token": token });

        if (!rootUser) { throw new Error("user not found") }

        req.token = token;
        req.rootUser = rootUser;
        req.userid = rootUser._id;
        req.name = rootUser.name;

        next();
    } catch (err) {
        res.status(401).send('unauthorized');
        console.log(err);
    }
}

module.exports = authenticateDriver