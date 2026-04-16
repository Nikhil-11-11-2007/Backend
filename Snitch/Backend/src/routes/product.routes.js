import express from 'express';
import { createProduct, deleteProduct, getSellerProducts } from '../controllers/product.controller.js';
import { authenticateSeller } from '../middlewares/auth.middleware.js';
import multer from "multer"
import { validateCreateProduct } from '../validator/product.validator.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

const router = express.Router();

router.post("/", authenticateSeller, upload.array("images", 7), validateCreateProduct, createProduct)

router.get("/seller", authenticateSeller, getSellerProducts)

router.delete("/:id", authenticateSeller, deleteProduct)


export default router;