import mongoose from "mongoose";

const dbConnect = () => {
    try{
       const conn = mongoose.connect(process.env.MONGO_DB_URL);
       console.log("Db connected");
    }catch(e){
        console.log("Server error",e);
    }
} 

export default dbConnect;
