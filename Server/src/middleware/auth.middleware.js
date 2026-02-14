import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";


export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization; // Authorization Header Read Karna

    // Check if token is provided and starts with "Bearer " because bearer se header start hota hai to uske baad token aata hai
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1]; // ["Bearer", "abcdefgh123"] is tarah token ko split karna or index 1 se token ko lena
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is blocked. Please contact support." });
        }
        
        req.user = user; // attach user to request object
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}



// authorizeRoles middleware function to check if user has required role(s) to access a route. 
export const authorizeRoles = (...roles) => {  // ...roles means we can pass multiple roles as arguments like authorizeRoles("ADMIN", "INSTRUCTOR") to check if user has either ADMIN or INSTRUCTOR role
    return (req, res, next) => {  // middleware function return karna
        if (!roles.includes(req.user.role)) {  
            return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
        }
        next();
    }

}


// authorizeSuperAdmin middleware function to check if user is super admin
export const authorizeSuperAdmin = (req, res, next) => {
    if (!req.user.isSuperAdmin) {
        return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
    }
    next();
}