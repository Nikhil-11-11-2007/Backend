import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../../cart/hook/useCart'

const ProductDetail = () => {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [activeImage, setActiveImage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAttributes, setSelectedAttributes] = useState({})
    const [selectedVariant, setSelectedVariant] = useState(null)
    const { handleGetProductById } = useProduct()
    const { handleAddToCart } = useCart()

    async function fetchProductDetail() {
        setIsLoading(true)
        try {
            const data = await handleGetProductById(productId)
            setProduct(data)
        } catch (err) {
            console.error('Failed to fetch product:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetail()
    }, [productId])

    // Extract unique attribute options
    const attributeOptions = {}
    if (product?.variants) {
        product.variants.forEach(variant => {
            Object.entries(variant.attributes).forEach(([key, value]) => {
                if (!attributeOptions[key]) attributeOptions[key] = new Set()
                attributeOptions[key].add(value)
            })
        })
    }

    // Match selectedVariant when attributes change
    useEffect(() => {
        if (!product?.variants) return

        const match = product.variants.find(variant => {
            return Object.entries(selectedAttributes).every(([key, value]) => {
                return variant.attributes[key] === value
            })
        })

        let finalVariant = match

        if (!match) {
            const lastKey = Object.keys(selectedAttributes).slice(-1)[0]
            const lastValue = selectedAttributes[lastKey]
            finalVariant = product.variants.find(variant => {
                return variant.attributes[lastKey] === lastValue && variant.stock > 0
            })
        }

        setSelectedVariant(finalVariant || null)

        if (finalVariant) {
            setSelectedAttributes(finalVariant.attributes)
        }

        setActiveImage(0)
    }, [selectedAttributes, product])

    const handleAttributeSelect = (key, value) => {
        const updated = { ...selectedAttributes, [key]: value }

        // Exact match
        let match = product.variants.find(variant =>
            Object.entries(updated).every(([k, v]) => variant.attributes[k] === v)
        )

        // Fallback
        if (!match) {
            match = product.variants.find(variant =>
                variant.attributes[key] === value && variant.stock > 0
            )
        }

        if (match) {
            setSelectedAttributes(match.attributes)
            setSelectedVariant(match)
            setActiveImage(0)
        }
    }

    // Initialize default attributes from first variant
    useEffect(() => {
        if (product?.variants?.length > 0 && Object.keys(selectedAttributes).length === 0) {
            setSelectedAttributes(product.variants[0].attributes)
        }
    }, [product])

    const displayImages = selectedVariant?.images?.length > 0 ? selectedVariant.images : product?.images || []
    const displayPrice = selectedVariant?.price || product?.price
    const displayStock = selectedVariant ? selectedVariant.stock : (product?.variants?.length > 0 ? 0 : null)

    const handlePrevImage = () => {
        if (displayImages.length === 0) return
        setActiveImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        if (displayImages.length === 0) return
        setActiveImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
    }

    /* ── Loading ── */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#e5beb4] border-t-[#E8440A] rounded-full animate-spin" />
                    <p className="text-[#907067] text-xs uppercase tracking-widest font-medium">
                        Loading product…
                    </p>
                </div>
            </div>
        )
    }

    /* ── Not found ── */
    if (!product) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <p className="text-[#191c1d] text-lg font-semibold">Product not found.</p>
            </div>
        )
    }


    console.log(product);

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-['Inter',sans-serif]">

            {/* ── Sticky breadcrumb nav ── */}
            <div className="bg-white/80 backdrop-blur-md border-b border-[#e5beb4]/30 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-2 text-xs text-[#907067] uppercase tracking-widest">
                    <span className="hover:text-[#E8440A] cursor-pointer transition-colors">Home</span>
                    <span>/</span>
                    <span className="hover:text-[#E8440A] cursor-pointer transition-colors">Products</span>
                    <span>/</span>
                    <span className="text-[#191c1d] font-semibold">{product.title}</span>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-1 items-start">

                    {/* ─────────── LEFT — Image gallery ─────────── */}
                    <div className="space-y-4">

                        {/* Main image */}
                        <div className="relative w-full sm:w-full lg:w-[77%] bg-white rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(25,28,29,0.06)] group">
                            <img
                                key={activeImage}
                                src={displayImages[activeImage]?.url}
                                alt={`${product.title} — view ${activeImage + 1}`}
                                className="w-full h-full object-cover transition-all duration-500"
                            />

                            {/* Left arrow */}
                            <button
                                id="img-prev-btn"
                                onClick={handlePrevImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-md"
                                aria-label="Previous image"
                            >
                                <svg className="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Right arrow */}
                            <button
                                id="img-next-btn"
                                onClick={handleNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-md"
                                aria-label="Next image"
                            >
                                <svg className="w-5 h-5 text-[#191c1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Image counter pill */}
                            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-[#191c1d] text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
                                {activeImage + 1} / {displayImages.length}
                            </div>
                        </div>

                        {/* Thumbnail strip */}
                        <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {displayImages.map((img, idx) => (
                                <button
                                    key={img._id}
                                    id={`thumb-${idx}`}
                                    onClick={() => setActiveImage(idx)}
                                    className={`shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden transition-all duration-300 ${activeImage === idx
                                        ? 'ring-2 ring-[#E8440A] ring-offset-2 scale-105'
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ─────────── RIGHT — Product info ─────────── */}
                    <div className="flex flex-col gap-7 lg:pt-4">

                        {/* Title & badges */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] bg-[#ffdbd1] text-[#ac2d00] px-3 py-1 rounded-full">
                                    New Arrival
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] bg-[#edeeef] text-[#5c4039] px-3 py-1 rounded-full">
                                    Men's
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-[#191c1d] tracking-tight leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-[#E8440A] tracking-tight">
                                ₹{displayPrice?.amount}
                            </span>
                            <span className="text-sm text-[#907067] uppercase tracking-wider font-medium">
                                {displayPrice?.currency}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#907067]">
                                Description
                            </p>
                            <p className="text-[#5c4039] text-sm leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Variant Selection */}
                        {Object.keys(attributeOptions).length > 0 && (
                            <div className="space-y-6 py-2">
                                {Object.entries(attributeOptions).map(([attrKey, values]) => (
                                    <div key={attrKey} className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#907067]">
                                                Select {attrKey}
                                            </p>
                                            {selectedAttributes[attrKey] && (
                                                <span className="text-[#191c1d] text-[11px] font-medium capitalize">
                                                    {selectedAttributes[attrKey]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from(values).map((value) => {
                                                const isSelected = selectedAttributes[attrKey] === value
                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => handleAttributeSelect(attrKey, value)}
                                                        className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 border-2 ${isSelected
                                                            ? 'bg-[#191c1d] border-[#191c1d] text-white shadow-md scale-105'
                                                            : 'bg-white border-[#edeeef] text-[#5c4039] hover:border-[#191c1d]'
                                                            }`}
                                                    >
                                                        {value}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stock Status */}
                        {displayStock !== null && (
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${displayStock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                                <p className={`text-xs font-medium ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {displayStock > 0 ? `${displayStock} units available` : 'Out of stock'}
                                </p>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-2">
                            {/* Add to Cart */}
                            <button
                                id="add-to-cart-btn"
                                className="flex-1 h-14 cursor-pointer flex items-center justify-center gap-2.5 rounded-xl border-2 border-[#191c1d] text-[#191c1d] text-sm font-bold uppercase tracking-widest hover:bg-[#191c1d] hover:text-white transition-all duration-300 group"
                                onClick={() => handleAddToCart({ productId: product._id, variantId: selectedVariant._id })}
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Add to Cart
                            </button>

                            {/* Buy Now */}
                            <button
                                id="buy-now-btn"
                                className="flex-1 h-14 flex items-center justify-center gap-2.5 rounded-xl bg-[#E8440A] text-white text-sm font-bold uppercase tracking-widest shadow-[0_8px_24px_rgba(232,68,10,0.35)] hover:shadow-[0_12px_32px_rgba(232,68,10,0.5)] hover:bg-[#d73b00] transition-all duration-300 group"
                            >
                                <svg className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail