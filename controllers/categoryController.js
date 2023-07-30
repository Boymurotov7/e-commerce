import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongoDbId.js";

const createCategory = asyncHandler( async (req,res) => {
    try{
        const newCategory  = await Category .create(req.body);
        res.json(newCategory );
    }
    catch(error){
        throw new Error(error);
    }
});

const updateCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateCategory = await Category.findByIdAndUpdate( id, req.body, {
            new:true,
        });
        res.json(updateCategory); 
    }catch(error){
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory); 
    }catch(error){
        throw new Error(error);
    }
});

const getaCategory = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getCategory = await Category.findById(id);
        res.json( getCategory ); 
    }catch(error){
        throw new Error(error);
    }
});
const getAllCategory = asyncHandler( async (req,res) => {
    try{
        const getAllCategory = await Category.find();
        res.json(getAllCategory); 
    }catch(error){
        throw new Error(error);
    }
});

export { createCategory, getaCategory, getAllCategory, updateCategory, deleteCategory, }