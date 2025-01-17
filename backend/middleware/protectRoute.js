import jwt from "jsonwebtoken"
import {User} from '../models/userModel.js';
import { ENV_VARS } from "../config/envVars.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-netflix"]

        if(!token) {
            return res.status(401).json({success: false, message: "Unauthorized - No token Provided"});
        }

        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({success: false, message: "Unauthorized - Inavalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({success: false, message: "Unauthorized - User Not Found"});
        }
        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute Middleware :", error.message);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}