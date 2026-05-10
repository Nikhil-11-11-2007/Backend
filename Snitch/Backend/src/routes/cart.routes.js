import express from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart, validateDecrementQuantity, validateIncrementQuantity } from '../validator/cart.validator.js';
import { addToCart, createOrderController, decrementCartQuantity, getCart, incremnentCartQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)

// Get cart details
router.get("/", authenticateUser, getCart)

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementQuantity, incremnentCartQuantity)
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementQuantity, decrementCartQuantity)

router.post("/payment/create/order", authenticateUser, createOrderController)

router.post("/payment/verify/order", authenticateUser,)

export default router;