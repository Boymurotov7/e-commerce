import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtToken.js";
import validateMongoDbId from "../utils/validateMongoDbId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";
import fs from "fs";

const createBlog = asyncHandler( async (req,res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    }
    catch(error){
        throw new Error(error);
    }
});

const updateBlog = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findByIdAndUpdate( id, req.body, {
            new:true,
        });
        res.json(updateBlog); 
    }catch(error){
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog); 
    }catch(error){
        throw new Error(error);
    }
});

const getaBlog = asyncHandler( async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate( 
            id, 
            {
                $inc: { numberViews: 1 },
            },
            { new:true }
            );
        res.json( updateViews ); 
    }catch(error){
        throw new Error(error);
    }
});
const getAllBlog = asyncHandler( async (req,res) => {
    try{
        const getAllBlog = await Blog.find();
        res.json(getAllBlog); 
    }catch(error){
        throw new Error(error);
    }
});

const likeBlog = asyncHandler( async (req,res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = await req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisLiked = blog?.disLikes?.find(((userId) => userId?.toString() === loginUserId?.toString()));
    if(alreadyDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisLiked: false
        },
        {
            new: true
        });
        res.json(blog);
    };
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        },
        {
            new: true
        });
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        },
        {
            new: true
        });
        res.json(blog);
    };
});

const disLikeBlog = asyncHandler( async (req,res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = await req?.user?._id;
    const isDisLiked = blog?.isDisLiked;
    const alreadyLiked = blog?.likes?.find(((userId) => userId?.toString() === loginUserId?.toString()));
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        },
        {
            new: true
        });
        res.json(blog);
    };
    if(isDisLiked){
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isDisLiked: false
        },
        {
            new: true
        });
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisLiked: true
        },
        {
            new: true
        });
        res.json(blog);
    };
});

const uploadImages = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const uploader = (path) => cloudinaryUploadImg(path,'images');
        const urls = [];
        const files = req.files;
        for(const file of files){
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id,
            {
                images:urls.map((file)=>{
                    return file;
                }),
            },
            {
                new:true,
            }
        );
        res.json(findBlog);
    }catch(error){
        throw new Error(error)
    }
});
export { createBlog, getaBlog, getAllBlog, updateBlog, deleteBlog, likeBlog, disLikeBlog,uploadImages }