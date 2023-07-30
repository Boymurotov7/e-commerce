import express from "express";
import { 
    createCoupon,
    getaCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon,
}  from "../controllers/couponController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createCoupon );

router.put('/:id', authMiddleware, isAdmin, updateCoupon );
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon );
router.get('/:id', getaCoupon );
router.get('/',  authMiddleware, isAdmin, getAllCoupon );


export default router;