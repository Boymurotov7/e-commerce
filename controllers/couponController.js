import Coupon from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js";

const createCoupon = asyncHandler( async (req,res) => {
    try{
        const newCoupon  = await Coupon .create(req.body);
        res.json(newCoupon );
    }
    catch(error){
        throw new Error(error);
    }
});

const updateCoupon = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateCoupon = await Coupon.findByIdAndUpdate( id, req.body, {
            new:true,
        });
        res.json(updateCoupon); 
    }catch(error){
        throw new Error(error);
    }
});

const deleteCoupon = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupon); 
    }catch(error){
        throw new Error(error);
    }
});

const getaCoupon = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getCoupon = await Coupon.findById(id);
        res.json( getCoupon ); 
    }catch(error){
        throw new Error(error);
    }
});
const getAllCoupon = asyncHandler( async (req,res) => {
    try{
        const getAllCoupon = await Coupon.find();
        res.json(getAllCoupon); 
    }catch(error){
        throw new Error(error);
    }
});

export { createCoupon, getaCoupon, getAllCoupon, updateCoupon, deleteCoupon, }