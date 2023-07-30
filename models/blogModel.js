import mongoose from "mongoose";
import bcrypt from "bcrypt";

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    numberViews:{
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Number,
        default: false,
    },
    isDisLiked:{
        type:Number,
        default:false,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User" 
        }
    ],
    dislikes:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"User" 
        }
    ],
    images:[],
    author:{
        type:String,
        default:"Admin",
    },
    
},
{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true, 
    },
    timestamps:true,
});

export default mongoose.model('Blog',blogSchema);