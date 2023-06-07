import jwt from "jsonwebtoken";
import User from "../models/User.js";

//protect endpoint in middleware
const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User
            .findById(decoded.id)
            .select('-password -success -token -createdAt -updatedAt -__v');
            
            return next();
        }catch(error){
            return res.status(404).json({ msg: "Error" });
        }
    }

    if (!token) {
        const error = new Error("Invalid Token");
        return res.status(401).json({ msg: error.message });
      }

    next();
}

export default checkAuth;