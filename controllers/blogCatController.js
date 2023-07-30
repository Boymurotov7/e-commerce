import blogCategory from "../models/blogCatModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js";

const createblogCategory = asyncHandler( async (req,res) => {
    try{
        const newblogCategory  = await blogCategory .create(req.body);
        res.json(newblogCategory );
    }
    catch(error){
        throw new Error(error);
    }
});

const updateblogCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateblogCategory = await blogCategory.findByIdAndUpdate( id, req.body, {
            new:true,
        });
        res.json(updateblogCategory); 
    }catch(error){
        throw new Error(error);
    }
});

const deleteblogCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteblogCategory = await blogCategory.findByIdAndDelete(id);
        res.json(deleteblogCategory); 
    }catch(error){
        throw new Error(error);
    }
});

const getablogCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getblogCategory = await blogCategory.findById(id);
        res.json( getblogCategory ); 
    }catch(error){
        throw new Error(error);
    }
});
const getAllblogCategory = asyncHandler( async (req,res) => {
    try{
        const getAllblogCategory = await blogCategory.find();
        res.json(getAllblogCategory); 
    }catch(error){
        throw new Error(error);
    }
});

export { createblogCategory, getablogCategory, getAllblogCategory, updateblogCategory, deleteblogCategory, }