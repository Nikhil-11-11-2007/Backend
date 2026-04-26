import mongoose from "mongoose"
import { stockOfVariant } from "../dao/product.dao.js"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import { createOrder } from "../services/payment.service.js"
import { getCartDetails } from "../dao/cart.dao.js"
import paymentModel from "../models/payment.model.js"


export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params

    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    // Check if the requested quantity is available in stock
    const stock = await stockOfVariant(productId, variantId)

    const cart = await cartModel.findOne({ user: req.user._id }) || (await cartModel.create({ user: req.user._id }))

    const isProductInAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId)

    if (isProductInAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId).quantity
        if (quantityInCart + req.body.quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock and you already have ${quantityInCart} in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

// Get cart details
export const getCart = async (req, res) => {

    const user = req.user

    let cart = await getCartDetails(user._id)

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart retrieved successfully",
        success: true,
        cart
    })
}

export const incremnentCartQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock and you already have ${itemQuantityInCart} in your cart`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": 1 } },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item quantity updated successfully",
        success: true
    })

}

export const decrementCartQuantity = async (req, res) => {
    const { productId, variantId } = req.params
}

export const createOrderController = async (req, res) => {

    const cart = await getCartDetails(req.user._id)

    if(!cart){
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            variantId: item.variant._id,
            quantity: item.quantity,
            images: item.product.variants.images || item.product.images,
            description: item.product.description,
            price: {
                amount: item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    })

}

export const verifyOrderController = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const payment = await paymentModel.findOne({ "razorpay.orderId": razorpay_order_id, status: "pending" })

    if(!payment){
        return res.status(400).json({
            message: "Payment not found",
            success: false
        })
    }

    const isValid = paymentModel.verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })

    if(!isValid){
        return res.status(400).json({
            message: "Invalid payment signature",
            success: false
        })
    }

}