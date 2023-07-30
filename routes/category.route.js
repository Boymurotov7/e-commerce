import express from "express";
import { 
    createCategory,
    getaCategory,
    getAllCategory,
    updateCategory,
    deleteCategory,
}  from "../controllers/categoryController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createCategory );

router.put('/:id', authMiddleware, isAdmin, updateCategory );
router.delete('/:id', authMiddleware, isAdmin, deleteCategory );
router.get('/:id', getaCategory );
router.get('/', getAllCategory );


export default router;