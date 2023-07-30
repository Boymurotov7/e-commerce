import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbConnect from "./config/dbConnect.js";
import errorHandlers from "./middlewares/errorHandler.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import blogRouter from "./routes/blog.route.js";
import categoryRouter from "./routes/category.route.js";
import blogCatRouter from "./routes/blogCat.route.js";
import brandRouter from "./routes/brand.route.js";
import couponRouter from "./routes/coupon.route.js";
import cookieParser from "cookie-parser";
import morgan from "morgan"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
dbConnect();
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/category',categoryRouter);
app.use('/api/blogCategory',blogCatRouter);
app.use('/api/brand',brandRouter);
app.use('/api/coupon',couponRouter);

app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);
app.listen(PORT,()=>{console.log("server is running")});