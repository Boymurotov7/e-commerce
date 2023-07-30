import express from "express";
import { 
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
}  from "../controllers/productController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import { uploadPhoto, productImgResize} from "../middlewares/uploadImages.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createProduct );
router.post('/upload/:id',authMiddleware, isAdmin, uploadPhoto.array('images',10),productImgResize,uploadImages)
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, rating);
router.put('/:id', authMiddleware, isAdmin, updateProduct );
router.delete('/:id', authMiddleware, isAdmin, deleteProduct );
router.get('/:id', getaProduct );
router.get('/', getAllProduct );

export default router;