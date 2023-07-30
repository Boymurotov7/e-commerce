import express from "express";
import { 
    createBrand,
    getaBrand,
    getAllBrand,
    updateBrand,
    deleteBrand,
}  from "../controllers/brandController.js";
import { authMiddleware, isAdmin} from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post('/', authMiddleware, isAdmin, createBrand );

router.put('/:id', authMiddleware, isAdmin, updateBrand );
router.delete('/:id', authMiddleware, isAdmin, deleteBrand );
router.get('/:id', getaBrand );
router.get('/', getAllBrand );


export default router;