const jwt = require("jsonwebtoken")
const Admin = require("../model/AdminDetails");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await Admin.findOne({"_id":verifyToken._id, "tokens.token" : token});
        
        if(!rootUser) {throw new Error("user not found")}

        req.token = token;
        req.rootUser = rootUser;
        req.userid = rootUser._id;

        next();
    } catch (err) {
        res.status(401).send('unauthorized');
        console.log(err);
    }
}

module.exports = authenticate 