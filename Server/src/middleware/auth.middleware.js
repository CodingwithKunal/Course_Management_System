import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

 
export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization; 

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Please contact support." });
        }
        
        req.user = user; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}




export const authorizeRoles = (...roles) => {  
    return (req, res, next) => {  
        if (!roles.includes(req.user.role)) {  
            return res.status(403).json({ message: "You don't have permission to access this resource" });
        }
        next();
    }

}



export const authorizeSuperAdmin = (req, res, next) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
    }
    next();
}