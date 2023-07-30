import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import Coupon from "../models/couponModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtToken.js";
import validateMongoDbId from "../utils/validateMongoDbId.js";
import { generateRefreshToken } from "../config/jwtRefreshToken.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import uniqid from "uniqid";

const createUser = asyncHandler( async (req,res) => {
        const email = req.body.email;
        const findUser = await User.findOne({email});
        if(!findUser){
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else{
            throw new Error("user already exists");
        }
    
});

const loginUserCtrl = asyncHandler( async (req,res) => {
    const { email, password } = await req.body;
    const findUser = await User.findOne({email});

    if(findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {
                new:true,
            });
        res.cookie("refreshToken", refreshToken, {
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000,
        }
        )
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error("Invalid credentials");
    }
});
const loginAdmin = asyncHandler( async (req,res) => {
    const { email, password } = await req.body;
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== "admin") throw new Error("Not authorized")  
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            {
                new:true,
            });
        res.cookie("refreshToken", refreshToken, {
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000,
        }
        )
        res.json({
            _id:findAdmin?._id,
            firstname:findAdmin?.firstname,
            lastname:findAdmin?.lastname,
            email:findAdmin?.email,
            mobile:findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    }else{
        throw new Error("Invalid credentials");
    }
});

const updateaUser = asyncHandler( async (req,res) => {
    try{
        const _id = req.user;
        validateMongoDbId(_id);
        const updatedUser = await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lastname:req?.body?.lastname,
            email:req?.body?.email,
            mobile:req?.body?.mobile,
        },{
            new:true
        });
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }
});

const saveAddress = asyncHandler( async (req,res) => {
    try{
        const _id = req.user;
        validateMongoDbId(_id);
        const updatedUser = await User.findByIdAndUpdate(_id,{
            address: req?.body?.address,
            
        },{
            new:true,
        });
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }
});

const getallUser = asyncHandler( async (req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

const getaUser = asyncHandler( async (req,res) => {
    try{
        const _id = req.params.id;
        validateMongoDbId(_id);
        const getUser = await User.findOne({_id});
        res.json(getUser);
    }catch(error){
        throw new Error(error);
    }
});

const deleteaUser = asyncHandler( async (req,res) => {
    try{
        const _id = req.params.id;
        validateMongoDbId(_id);
        const deletedUser = await User.findByIdAndDelete({_id});
        res.json(deletedUser);
    }catch(error){
        throw new Error(error);
    }
});

const blockaUser = asyncHandler( async (req,res) => {
    const _id = req.params.id;
    validateMongoDbId(_id);
    try{
        const block = await User.findByIdAndUpdate(
            _id,
            {
                isBlock:true,
            },
            {
                new:true,
            }
        );
        res.json({
            message:"User blocked"
        });
    }catch(error){
        throw new Error(error);
    }
});

const unblockaUser = asyncHandler( async (req,res) => {
    const _id = req.params.id;
    validateMongoDbId(_id);
    try{
        const unblock = await User.findByIdAndUpdate(
            _id,
            {
                isBlock:false,
            },
            {
                new:true,
            }
        );
        res.json({
            message:"User unblocked"
        });
    }catch(error){
        throw new Error(error);
    }
});

const handleRefreshToken = asyncHandler( async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error("No refresh token present on db not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if( err || user.id !== decoded.id) {
            throw new Error("This is something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
});

const logout = asyncHandler( async (req,res) => {
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const {refreshToken} = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken:"",
    })
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    res.sendStatus(204);
});
 const updateaPassword = asyncHandler( async(req,res) => {
    const { _id } = req.user;
    const { password } = req.body;

    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }else{
        res.json(user);
    }
 });

const forgotPasswordToken = asyncHandler( async(req,res) => {
    const {email} = req.body;
    const user = await User.findOne({ email });
    if(!user) throw new Error("User not found with this email")
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetUrl = `Hi, Please fallow this link to reset your Password. This link is valid till 10 minutes from now.<a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetUrl,
        }
        sendEmail(data);
        res.json(token);
    }catch(error){
        throw new Error(error);
    }
 });

const resetPassword = asyncHandler( async(req,res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },

    });
    if(!user) throw new Error(" Token expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
 });

const getWishlist = asyncHandler( async(req,res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    }catch(error){
        throw new Error(error);
    }
});

const userCart = asyncHandler( async(req,res) => {
    const { cart } = req.body;
    const {_id} = req.user;
    console.log(req.user)
    validateMongoDbId(_id);
    try{
        const products = [];
        const user = await User.findById(_id);

        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if(alreadyExistCart) {
            alreadyExistCart.remove(); 
        }

        for(let i = 0; i < cart.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.color = cart[i].color;
            object.count = cart[i].count;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0;
        for(let i = 0; i < products.length; i++){
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        const newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id
        }).save()
        res.json(newCart);
    }catch(error){
        throw new Error(error);
    }
});

const getUserCart = asyncHandler( async(req,res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});

const emptyCart = asyncHandler( async(req,res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const user = await User.findOne({_id})
        const cart = await Cart.findOneAndRemove({orderby: user._id});
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler( async(req,res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);

    try{
        const validCoupon = await Coupon.findOne({ name: coupon });
        if( validCoupon === null ){
            throw new Error("Invalid coupon");
        }
        const user = await User.findOne({ _id });
        let { cartTotal } = await Cart.findOne({
            orderby: user._id,
        }).populate("products.product");
        let totalAfterDiscount = ( cartTotal - ( cartTotal * validCoupon.discount)/ 100).toFixed(2);
        await Cart.findOneAndUpdate( { orderby: user._id }, { totalAfterDiscount }, { new: true });
        res.json(totalAfterDiscount);
    }catch(error){
        throw new Error(error);
    }
});
const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      if (!COD) throw new Error("Create cash order failed");
      const user = await User.findById(_id);
      let userCart = await Cart.findOne({ orderby: user._id });
      let finalAmout = 0;
      if (couponApplied && userCart.totalAfterDiscount) {
        finalAmout = userCart.totalAfterDiscount;
      } else {
        finalAmout = userCart.cartTotal;
      }
  
      let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
          id: uniqid(),
          method: "COD",
          amount: finalAmout,
          status: "Cash on Delivery",
          created: Date.now(),
          currency: "usd",
        },
        orderby: user._id,
        orderStatus: "Cash on Delivery",
      }).save();
      let update = userCart.products.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        };
      });
      const updated = await Product.bulkWrite(update, {});
      res.json({ message: "success" });
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const userorders = await Order.findOne({ orderby: _id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });
  
  const getAllOrders = asyncHandler(async (req, res) => {
    try {
      const alluserorders = await Order.find()
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(alluserorders);
    } catch (error) {
      throw new Error(error);
    }
  });
  const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const userorders = await Order.findOne({ orderby: id })
        .populate("products.product")
        .populate("orderby")
        .exec();
      res.json(userorders);
    } catch (error) {
      throw new Error(error);
    }
  });
  const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateOrderStatus = await Order.findByIdAndUpdate(
        id,
        {
          orderStatus: status,
          paymentIntent: {
            status: status,
          },
        },
        { new: true }
      );
      res.json(updateOrderStatus);
    } catch (error) {
      throw new Error(error);
    }
  });
export { 
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updateaUser,
    blockaUser,
    unblockaUser,
    handleRefreshToken,
    logout,
    updateaPassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderByUserId,
};