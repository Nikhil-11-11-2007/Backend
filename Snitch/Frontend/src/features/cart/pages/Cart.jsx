import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart'
import { useRazorpay } from "react-razorpay";

const Cart = () => {
    const cartItems = useSelector(state => state.cart)
    const { handleGetCart, handleIncrementCartItem, handleCreateCartOrder } = useCart()
    const [quantities, setQuantities] = useState({})
    const [loading, setLoading] = useState(false)
    const { error, isLoading, Razorpay } = useRazorpay();
    const user = useSelector(state => state.user)

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            try {
                await handleGetCart()
            } catch (error) {
                console.error("Failed to fetch cart:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCart()
    }, [])

    useEffect(() => {
        if (cartItems?.length) {
            const initial = {}
            cartItems.forEach(item => {
                initial[item._id] = item.quantity ?? 1
            })
            setQuantities(initial)
        }
    }, [cartItems])

    // const freeShippingThreshold = 15000
    const totalPieces = cartItems?.items?.length ?? 0

    // Helper functions as requested
    const formatCurrency = (amount, currency = 'INR') => {
        return `${currency} ${Number(amount).toLocaleString('en-IN')}`
    }

    const getVariantDetails = (item) => {
        return item.product.variants
    }

    const getDisplayImage = (item) => {
        const variant = getVariantDetails(item)
        return variant?.images?.[0]?.url || item.product.images?.[0]?.url
    }

    async function handleCheckout() {
        const order = await handleCreateCartOrder()
        console.log(order);

        const options = {
            key: "rzp_test_ShfS7mguZ9pDu5",
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Snitch",
            description: "Test Transaction",
            order_id: order.id, // Generate order_id on server
            handler: (response) => {
                console.log(response);
                alert("Payment Successful!");
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact || "0000000000",
            },
            theme: {
                color: "#F37254",
            },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <header className="mb-10 lg:mb-16 border-b border-slate-200 pb-8">
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-2 italic">
                        Your Cart
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="h-px w-8 bg-slate-900"></span>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                            {totalPieces} {totalPieces === 1 ? 'Masterpiece' : 'Masterpieces'} Selected
                        </p>
                    </div>
                </header>
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Items List */}
                    <div className="lg:col-span-8">
                        {loading ? (
                            <div className="py-32 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                                <p className="text-xl font-medium text-slate-500 uppercase tracking-widest italic">Curating your selection...</p>
                            </div>
                        ) : cartItems?.length === 0 ? (
                            <div className="py-32 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
                                <p className="text-xl font-medium text-slate-400">Your curation is currently empty.</p>
                                <button className="mt-6 px-8 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all">
                                    Explore Collection
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.items.map((item) => {
                                    const qty = quantities[item._id] ?? item.quantity ?? 1
                                    const variant = getVariantDetails(item) || {}
                                    const displayPrice = variant?.price ?? item.price
                                    const variantPrice = variant?.price?.amount
                                    const productPrice = item.product.price?.amount
                                    const cartPrice = item.price?.amount
                                    const currentPrice = variantPrice ?? cartPrice
                                    const basePrice = productPrice

                                    return (
                                        <div key={item._id} className="group relative flex flex-col sm:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
                                            <div className="sm:w-1/3 h-75 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
                                                <img
                                                    src={getDisplayImage(item)}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                            </div>

                                            <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">
                                                            {item.product.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 line-clamp-2 max-w-md italic">
                                                            {item.product.description}
                                                        </p>
                                                    </div>
                                                    <p className="text-xl font-black text-slate-900">{formatCurrency(displayPrice?.amount)}</p>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-slate-100 my-4">
                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Color</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-3 h-3 rounded-full border border-slate-200" style={{
                                                                backgroundColor: variant?.attributes?.color
                                                                    ? variant.attributes.color.toLowerCase()
                                                                    : "#ccc"
                                                            }}></span>
                                                            <span className="text-sm font-bold">{variant?.attributes?.color}</span>
                                                        </div>
                                                        {
                                                            currentPrice < basePrice && (
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-sm font-bold text-green-600">
                                                                        {formatCurrency(currentPrice)}
                                                                    </span>

                                                                    <span className="text-xs text-slate-400 line-through">
                                                                        {formatCurrency(basePrice)}
                                                                    </span>

                                                                    <span className="text-xs font-bold text-green-600">
                                                                        ({Math.round(((basePrice - currentPrice) / basePrice) * 100)}% OFF)
                                                                    </span>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Size</span>
                                                        <span className="text-sm font-bold uppercase px-2 py-0.5 bg-slate-100 rounded text-slate-700">{variant?.attributes?.size}</span>
                                                    </div>
                                                    <div className="space-y-1 col-span-2 sm:col-span-1">
                                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">Quantity</span>
                                                        <div className="inline-flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                                                            <button
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all font-bold"
                                                            >-</button>
                                                            <span className="w-10 text-center text-sm font-black">{qty}</span>
                                                            <button
                                                                onClick={() => {
                                                                    handleIncrementCartItem({
                                                                        productId: item.product._id,
                                                                        variantId: item.variant
                                                                    })

                                                                    setQuantities(prev => ({
                                                                        ...prev,
                                                                        [item._id]: (prev[item._id] ?? item.quantity ?? 1) + 1
                                                                    }))
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-md transition-all font-bold"
                                                            >+</button>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${variant?.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${variant?.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {variant?.stock > 0 ? `${variant.stock} In Stock` : 'Out of Stock'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex gap-6">
                                                        <button className="text-[11px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 underline underline-offset-4 decoration-2 transition-colors">
                                                            Remove
                                                        </button>
                                                        <button className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                                                            Save for later
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Item Total</span>
                                                        <span className="text-lg font-black">{formatCurrency((currentPrice ?? 0) * qty)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    {/* Order Summary */}
                    <div className="mt-12 lg:mt-0 lg:col-span-4">
                        <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-3xl sticky top-25 shadow-2xl shadow-slate-900/20">
                            <h2 className="text-2xl font-black tracking-tight uppercase mb-8 italic">Order Details</h2>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 uppercase tracking-widest text-[11px] font-bold">Subtotal</span>
                                    <span className="font-black text-lg">{formatCurrency(cartItems.totalPrice)}</span>
                                </div>
                                <div className="pt-8 border-t border-slate-800">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-3xl font-black uppercase tracking-tighter italic block">Total</span>
                                        </div>
                                        <span className="text-4xl font-black tracking-tighter">{formatCurrency(cartItems.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleCheckout} className="group cursor-pointer active:scale-[0.95] relative w-full mt-10 overflow-hidden rounded-2xl bg-white p-5 transition-all active:scale-95">
                                <div className="absolute inset-0 bg-[#aa3905] group-hover:opacity-10 transition-opacity"></div>
                                <span className="relative text-slate-900 text-sm font-black uppercase tracking-[0.2em]">
                                    Proceed to Checkout
                                </span>
                            </button>

                            <div className="mt-8 flex flex-col items-center gap-4 py-6 border-t border-slate-800">
                                <div className="flex gap-4">
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
                                    <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-bold">UPI</div>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                    Encrypted Transactions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Cart
