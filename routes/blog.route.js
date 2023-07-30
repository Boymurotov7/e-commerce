import express from "express";
import { 
    createBlog,
    getaBlog,
    getAllBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    uploadImages
}  from "../controllers/blogController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
import { uploadPhoto, blogImgResize} from "../middlewares/uploadImages.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createBlog );
router.post('/upload/:id',authMiddleware, isAdmin, uploadPhoto.array('images',2),blogImgResize,uploadImages)
router.put('/likes', authMiddleware, likeBlog );
router.put('/dislikes', authMiddleware, disLikeBlog );
router.put('/:id', authMiddleware, isAdmin, updateBlog );
router.delete('/:id', authMiddleware, isAdmin, deleteBlog );
router.get('/:id', getaBlog );
router.get('/', getAllBlog );


export default router;