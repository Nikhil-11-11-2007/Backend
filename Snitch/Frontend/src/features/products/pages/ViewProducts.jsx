import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const ViewProducts = () => {
    const { handleGetSellerProduct, handleDeleteProduct } = useProduct();
    const sellerProducts = useSelector((state) => state.product?.sellerProducts) || []
    const [isLoading, setIsLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const onDelete = async (id) => {
        try {
            await handleDeleteProduct(id);
            setOpenMenuId(null);
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                await handleGetSellerProduct();
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-[#0D0D0D] text-[#E5E2E1] font-sans w-full min-h-screen lg:min-h-screen pb-12 overflow-x-hidden selection:bg-[#E8440A] selection:text-white flex flex-col">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 md:pt-16 flex-1">
                <header className="mb-12 flex flex-col items-start md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="w-12 h-1 brand-gradient mb-4"></div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#E5E2E1] leading-tight break-all">
                            YOUR <span className="brand-gradient-text">LISTINGS</span>
                        </h1>
                        <p className="mt-3 text-[#9A9A9A] text-sm md:text-base max-w-xl font-light leading-relaxed">
                            Manage your active intel and cataloged items. Ensure all data is up-to-date and descriptions are precise.
                        </p>
                    </div>
                    <Link
                        to="/seller/create-product"
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-[#141414] hover:bg-[#201F1F] text-[#E5E2E1] font-semibold text-xs tracking-[0.15em] uppercase px-6 py-4 rounded-md border border-[#2A2A2A] hover:border-[#E8440A] transition-all duration-300 group whitespace-nowrap"
                    >
                        <span className="mr-3 text-[#E8440A] group-hover:scale-125 transition-transform duration-300">+</span>
                        Initialize New
                    </Link>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <div className="w-10 h-10 border-4 border-[#201F1F] border-t-[#E8440A] rounded-full animate-spin"></div>
                        <p className="text-[#9A9A9A] text-xs uppercase tracking-widest font-mono">Syncing Catalog...</p>
                    </div>
                ) : sellerProducts.length === 0 ? (
                    <div className="bg-[#141414] border border-[#201F1F] rounded-xl p-8 sm:p-12 md:p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#201F1F] flex items-center justify-center mb-6 custom-shadow">
                            <svg className="w-8 h-8 text-[#5C4039]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium text-[#E5E2E1] mb-2 tracking-wide">No Active Listings</h3>
                        <p className="text-[#9A9A9A] text-sm max-w-sm sm:max-w-md mb-8 leading-relaxed">
                            Your catalog is currently empty. Initialize a new listing to start tracking your items on the grid.
                        </p>
                        <Link
                            to="/seller/create-product"
                            className="w-full sm:w-auto inline-flex items-center justify-center btn-gradient hover:opacity-90 text-[#131313] font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-md shadow-[0_10px_20px_rgba(232,68,10,0.2)] hover:shadow-[0_10px_30px_rgba(232,68,10,0.4)] transition-all duration-300"
                        >
                            Create First Listing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {sellerProducts.map((product) => (
                            <div
                                key={product._id || product.id}
                                className="group cursor-pointer relative bg-[#141414] rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                            >
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E8440A]/20 rounded-xl transition-colors duration-500 z-10 pointer-events-none"></div>

                                <div className="relative aspect-[0.9] bg-[#201F1F] overflow-hidden flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:-none] [scrollbar-width:none]">
                                    {product.images && product.images.length > 0 ? (
                                        product.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="relative w-full h-full shrink-0 snap-center"
                                            >
                                                <img
                                                    src={img?.url || img}
                                                    alt={`${product.title} - ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />

                                                {/* ✅ PRICE PER IMAGE */}
                                                <div className="absolute top-4 right-4 z-10 bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2A2A2A] px-3 py-1.5 rounded text-[10px] font-mono tracking-wider text-[#E5E2E1]">
                                                    {product.price?.amount} {product.price?.currency}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#181818] text-[#3A3939] w-full shrink-0">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 card-overlay-gradient opacity-90 z-0 h-1/2 mt-auto"></div>

                                    <div className="absolute top-4 right-4 z-10 bg-[#0D0D0D]/90 backdrop-blur-sm border border-[#2A2A2A] px-3 py-1.5 rounded text-[10px] font-mono tracking-wider text-[#E5E2E1] group-hover:border-[#E8440A]/50 group-hover:text-[#E8440A] transition-colors">
                                        {product.price?.amount} {product.price?.currency}
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6 relative z-10 bg-[#141414]">
                                    <h3 className="text-base sm:text-lg font-semibold text-[#E5E2E1] truncate mb-2 group-hover:text-[#E8440A] transition-colors">
                                        {product.title || "Untitled Product"}
                                    </h3>
                                    <p className="text-[#9a9a9a] text-xs sm:text-sm line-clamp-2 leading-relaxed h-8 sm:h-10">
                                        {product.description || "No description provided."}
                                    </p>

                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-[#201F1F] flex items-center justify-between relative">
                                        <span className="text-[#5C4039] text-[10px] uppercase font-mono tracking-widest">
                                            ID: {(product._id || product.id)?.slice(-6) || 'N/A'}
                                        </span>
                                        <button
                                            onClick={() => toggleMenu(product._id || product.id)}
                                            className="more text-[#5C4039] hover:text-[#E8440A] p-2 -mr-2 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                        </button>

                                        {openMenuId === (product._id || product.id) && (
                                            <div className="absolute bottom-full right-0 mb-2 w-32 bg-[#201F1F] border border-[#2A2A2A] rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 py-1 overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(product._id || product.id);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-xs tracking-wider uppercase font-semibold text-[#E8440A] hover:bg-[#2A2A2A] transition-colors flex items-center gap-3"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewProducts;