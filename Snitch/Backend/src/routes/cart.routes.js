import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateIncrementQuantity } from '../validator/cart.validator.js';
import { addToCart, getCart, incremnentCartQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)

// Get cart details
router.get("/", authenticateUser, getCart)

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementQuantity, incremnentCartQuantity)

export default router;