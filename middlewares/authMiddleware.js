import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler( async (req,res,next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findById(decoded?.id);
            req.user = user;
            next();
        }catch(e){
            throw new Error("Not authorized token expired, Please Login again");
        }
    }else{
        throw new Error("there is no token attaches to header");
    }
})

const isAdmin = asyncHandler( async(req,res,next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "admin" ){
        throw new Error("You are not an admin");
    }else{
        next();
    }
});
export { authMiddleware, isAdmin };