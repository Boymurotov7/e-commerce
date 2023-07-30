import express from "express";
import { 
    createblogCategory,
    getablogCategory,
    getAllblogCategory,
    updateblogCategory,
    deleteblogCategory,
}  from "../controllers/blogCatController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createblogCategory );
router.put('/:id', authMiddleware, isAdmin, updateblogCategory );
router.delete('/:id', authMiddleware, isAdmin, deleteblogCategory );
router.get('/:id', getablogCategory );
router.get('/', getAllblogCategory );


export default router;