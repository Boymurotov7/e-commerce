import express from "express";
import { 
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
    
}  from "../controllers/userController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/register', createUser );
router.post('/forgot-password-token', forgotPasswordToken );
router.post('/reset-password/:token', resetPassword );
router.put('/password', authMiddleware, updateaPassword)
router.post('/login', loginUserCtrl );
router.post('/cart', authMiddleware,userCart );
router.post('/cart/applycoupon', authMiddleware, applyCoupon );
router.post('/admin-login', loginAdmin );
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get('/all-users', getallUser );
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getAllOrders);
router.get('/refresh', handleRefreshToken );
router.get('/logout', logout);
router.get('/wishlist',authMiddleware, getWishlist );
router.get('/cart',authMiddleware, getUserCart );
router.get('/:id',authMiddleware, isAdmin, getaUser );
router.delete('/empty-cart', authMiddleware, emptyCart );
router.delete('/:id', deleteaUser );

router.put('/edit-user',authMiddleware, updateaUser );
router.put(
    "/order/update-order/:id",
    authMiddleware,
    isAdmin,
    updateOrderStatus
  );
router.put('/save-address',authMiddleware, saveAddress );
router.put('/block-user/:id',authMiddleware, isAdmin, blockaUser );
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockaUser );

export default router;