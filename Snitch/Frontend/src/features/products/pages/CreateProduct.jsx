import React, { useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const CreateProduct = () => {
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { handleCreateProduct } = useProduct()
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const remainingSlots = 7 - images.length;
            const filesToAdd = selectedFiles.slice(0, remainingSlots);
            setImages((prev) => [...prev, ...filesToAdd]);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="bg-[#0D0D0D] text-[#E5E2E1] font-sans selection:bg-[#E8440A] selection:text-white min-h-screen pb-12">
            <div className="max-w-6xl w-full mx-auto px-4 pt-8">

                <header className="mb-8">
                    <div className="w-8 h-1 bg-[#E8440A] mb-3"></div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E5E2E1] -ml-0.5 leading-tight">
                        INITIALIZE <span className="text-[#E8440A]">NEW LISTING</span>
                    </h1>
                    <p className="mt-2 text-[#9A9A9A] text-sm max-w-xl">
                        Provide the necessary intel to catalog your product. Use clear images and precise details.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-0 lg:gap-x-12">

                    {/* Images Section (Left Sidebar on Desktop, Second on mobile) */}
                    <section className="order-2 lg:order-1 lg:col-span-5 flex flex-col space-y-4">
                        <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-[#201F1F] flex items-center justify-center mr-3">
                                <span className="text-[#E8440A] text-[10px] font-bold">01</span>
                            </div>
                            <h2 className="text-[#E5E2E1] text-xs uppercase tracking-widest font-semibold flex items-center">
                                Visual Evidence
                            </h2>
                            <span className="ml-auto text-[#9A9A9A] text-[10px] font-mono">{images.length} / 7</span>
                        </div>

                        <div className="bg-[#141414] rounded-lg p-4 relative group border border-transparent transition-colors duration-300 hover:border-[#2A2A2A]">
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#2A2A2A] rounded-lg transition-colors duration-300 group-hover:border-[#E8440A] group-hover:bg-[#E8440A]/5">
                                <div className="w-12 h-12 rounded-full bg-[#201F1F] flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm">
                                    <svg className="w-6 h-6 text-[#9A9A9A] group-hover:text-[#E8440A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                </div>
                                <p className="text-[#E5E2E1] text-sm font-medium mb-1 tracking-wide">Select or drag up to 7 images</p>
                                <p className="text-[#5C4039] text-xs max-w-sm text-center mt-1">High resolution required. The first image will be used as the primary cover.</p>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={images.length >= 7}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                />
                            </div>

                            {/* Image Preview Grid */}
                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group/img aspect-square rounded-lg overflow-hidden bg-[#201F1F] border border-[#2A2A2A]">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 transition-opacity"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-[#131313]/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white hover:text-[#E8440A] z-20"
                                            >
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 7 && (
                                        <div className="aspect-square rounded-lg border border-dashed border-[#2A2A2A] flex items-center justify-center text-[#5C4039]">
                                            <span className="text-xl font-light">+</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Details Section (Right Content on Desktop, First on mobile) */}
                    <section className="order-1 lg:order-2 lg:col-span-7 flex flex-col space-y-6">
                        <div className="flex items-center pt-2 lg:pt-0">
                            <div className="w-6 h-6 rounded bg-[#201F1F] flex items-center justify-center mr-3">
                                <span className="text-[#E8440A] text-[10px] font-bold">02</span>
                            </div>
                            <h2 className="text-[#E5E2E1] text-xs uppercase tracking-widest font-semibold flex items-center">
                                Core Details
                            </h2>
                        </div>

                        <div className="space-y-6 bg-[#141414] p-5 rounded-lg border border-[#201F1F] lg:border-none">
                            <div className="relative group">
                                <label htmlFor="title" className="block text-[#9A9A9A] text-[10px] uppercase tracking-widest font-medium mb-2 transition-colors group-focus-within:text-[#E8440A]">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="What are you snitchin' on?"
                                    className="w-full bg-[#1A1A1A] text-[#E5E2E1] border border-[#2A2A2A] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#E8440A] focus:ring-1 focus:ring-[#E8440A] transition-all placeholder-[#5C4039] text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <label htmlFor="description" className="block text-[#9A9A9A] text-[10px] uppercase tracking-widest font-medium mb-2 transition-colors group-focus-within:text-[#E8440A]">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Provide context, condition, and any crucial intel..."
                                    className="w-full bg-[#1A1A1A] text-[#E5E2E1] border border-[#2A2A2A] rounded-md px-4 py-2.5 focus:outline-none focus:border-[#E8440A] focus:ring-1 focus:ring-[#E8440A] transition-all placeholder-[#5C4039] resize-none text-sm leading-relaxed"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 relative group">
                                    <label htmlFor="priceAmount" className="block text-[#9A9A9A] text-[10px] uppercase tracking-widest font-medium mb-2 transition-colors group-focus-within:text-[#E8440A]">
                                        Bounty Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E8440A] text-base font-medium">$</span>
                                        <input
                                            type="number"
                                            id="priceAmount"
                                            name="priceAmount"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.priceAmount}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="w-full bg-[#1A1A1A] text-[#E5E2E1] border border-[#2A2A2A] rounded-md pl-8 pr-4 py-2.5 focus:outline-none focus:border-[#E8440A] focus:ring-1 focus:ring-[#E8440A] transition-all placeholder-[#5C4039] text-base font-mono tracking-tight"
                                        />
                                    </div>
                                </div>

                                <div className="relative group flex flex-col justify-end">
                                    <label htmlFor="priceCurrency" className="block text-[#9A9A9A] text-[10px] uppercase tracking-widest font-medium mb-2 transition-colors group-focus-within:text-[#E8440A]">
                                        Currency
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="priceCurrency"
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#1A1A1A] text-[#E5E2E1] border border-[#2A2A2A] rounded-md px-4 h-[2.87rem] focus:outline-none focus:border-[#E8440A] focus:ring-1 focus:ring-[#E8440A] transition-all appearance-none cursor-pointer text-sm font-mono tracking-widest"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                            <option value="INR">INR</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#5C4039]">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Action Area (Bottom of the screen on mobile, below details on desktop) */}
                    <div className="order-3 lg:col-span-7 lg:col-start-6 pt-6 border-t border-[#201F1F] flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto cursor-pointer md:min-w-[200px] flex items-center justify-center bg-[#E8440A] hover:bg-[#FF5722] text-[#131313] font-bold text-xs tracking-[0.2em] uppercase px-8 border border-transparent py-4 md:py-3.5 rounded-md shadow-[0_10px_20px_rgba(232,68,10,0.15)] hover:shadow-[0_10px_20px_rgba(232,68,10,0.3)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E8440A]"
                        >
                            {isSubmitting ? "Submitting..." : "Initialize Listing"}
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateProduct;
