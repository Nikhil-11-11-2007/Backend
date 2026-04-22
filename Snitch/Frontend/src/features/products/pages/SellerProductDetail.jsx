import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct';
import { useParams, Link } from 'react-router';

// Premium Icons
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const BoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8440A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

const SellerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [localVariants, setLocalVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'new'
  const [selectedImage, setSelectedImage] = useState(null);

  // New variant state
  const [attributeInputs, setAttributeInputs] = useState([{ key: '', value: '' }]);
  const [newVariant, setNewVariant] = useState({
    images: [],
    stock: 0,
    attributes: {},
    price: { amount: '', currency: 'INR' }
  });

  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();

  async function fetchProductDetails() {
    setLoading(true);
    try {
      const data = await handleGetProductById(productId);
      const prod = data?.product || data;
      setProduct(prod);
      if (prod?.variants) {
        setLocalVariants(prod.variants);
      }
      if (prod?.images?.[0]) {
        setSelectedImage(prod.images[0].url);
      }
    } catch (error) {
      console.error("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Handlers
  const handleStockChange = (index, newStock) => {
    const updatedVariants = [...localVariants];
    updatedVariants[index] = { ...updatedVariants[index], stock: Number(newStock) };
    setLocalVariants(updatedVariants);
  };

  const handleAddNewVariant = async () => {
    const hasValidAttribute = attributeInputs.some(attr => attr.key.trim() && attr.value.trim());
    if (!hasValidAttribute) {
      alert("At least one valid attribute is required.");
      return;
    }

    const cleanImages = newVariant.images.map(img => ({ url: img.previewUrl, file: img.file }));
    const cleanAttributes = { ...newVariant.attributes };

    const variantToSave = {
      images: cleanImages,
      stock: Number(newVariant.stock),
      attributes: cleanAttributes,
      price: newVariant.price.amount ? Number(newVariant.price.amount) : undefined
    };

    setLocalVariants([...localVariants, variantToSave]);
    setActiveTab('inventory');

    await handleAddProductVariant(productId, variantToSave)

    setAttributeInputs([{ key: '', value: '' }]);
    setNewVariant({
      images: [],
      stock: 0,
      attributes: {},
      price: { amount: '', currency: 'INR' }
    });
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedInputs = [...attributeInputs];
    updatedInputs[index][field] = value;
    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        newAttrsObj[attr.key.trim()] = attr.value;
      }
    });

    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleRemoveAttribute = (index) => {
    const updatedInputs = attributeInputs.filter((_, i) => i !== index);
    setAttributeInputs(updatedInputs);

    const newAttrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        newAttrsObj[attr.key.trim()] = attr.value;
      }
    });

    setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const availableSlots = 7 - newVariant.images.length;
    const filesToAdd = files.slice(0, availableSlots);
    const newImageObjects = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setNewVariant(prev => ({
      ...prev,
      images: [...prev.images, ...newImageObjects]
    }));
    e.target.value = '';
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-[#1b1c1a]/60 tracking-widest font-light">REFRESHING GALLERY...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-[#1b1c1a] font-serif">Product Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-[#E8440A]/10">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Media & Overview */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Image */}
            <div className="bg-white rounded-[2rem] p-2.5 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] relative bg-[#f9f9f9]">
                {selectedImage ? (
                  <img src={selectedImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-in fade-in duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#c4c4c4]"><BoxIcon /></div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex gap-2.5 sm:gap-3 mt-3 sm:mt-4 px-1 pb-1 overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img.url)}
                      className={`w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img.url ? 'border-[#E8440A] scale-95 shadow-inner' : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#f1f1f1]'}`}
                    >
                      <img src={img.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5 capitalize">{product.title}</h1>
                <div className="text-xl sm:text-2xl font-black text-[#E8440A] tracking-tight">
                  ₹{product.price?.amount || '---'} <span className="text-[10px] font-medium text-[#8e8e8e] ml-1 uppercase tracking-wider">{product.price?.currency || 'INR'}</span>
                </div>
              </div>

              <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed font-light">{product.description}</p>

              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#f8f9fa] mt-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f9fa] text-[9px] font-bold text-[#64748b] uppercase tracking-wider">
                  <CalendarIcon /> {new Date(product.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f8f9fa] text-[9px] font-bold text-[#64748b] uppercase tracking-wider">
                  <TagIcon /> {localVariants.length} variants
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Management Interface */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden pb-6 sm:pb-0">
              {/* Tabs Header */}
              <div className="flex border-b border-[#f1f1f1] px-6 sm:px-10 overflow-x-auto no-scrollbar whitespace-nowrap">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`py-6 sm:py-8 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] relative transition-all duration-300 ${activeTab === 'inventory' ? 'text-[#E8440A]' : 'text-[#8e8e8e] hover:text-[#1a1a1a]'}`}
                >
                  Stock & Variants
                  {activeTab === 'inventory' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E8440A] rounded-full shadow-[0_2px_10px_rgba(232,68,10,0.4)] animate-in fade-in slide-in-from-bottom-1" />}
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`py-6 sm:py-8 px-6 sm:px-10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] relative transition-all duration-300 ${activeTab === 'new' ? 'text-[#E8440A]' : 'text-[#8e8e8e] hover:text-[#1a1a1a]'}`}
                >
                  New Variant
                  {activeTab === 'new' && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E8440A] rounded-full shadow-[0_2px_10px_rgba(232,68,10,0.4)] animate-in fade-in slide-in-from-bottom-1" />}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-6 sm:p-10">
                {activeTab === 'inventory' ? (
                  localVariants.length === 0 ? (
                    <div className="py-16 sm:py-24 h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-2">
                        <BoxIcon />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">No variants yet</h3>
                        <p className="text-[#8e8e8e] text-xs sm:text-sm max-w-[280px] leading-relaxed mx-auto">Add your first variant to manage stock levels and custom pricing.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('new')}
                        className="bg-[#E8440A] text-white px-8 py-3.5 sm:py-4 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_15px_30px_rgba(232,68,10,0.3)] hover:shadow-[0_20px_40px_rgba(232,68,10,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer"
                      >
                        <PlusIcon /> Add Variant
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {localVariants.map((variant, idx) => (
                        <div
                          key={idx}
                          onClick={() => variant.images?.[0] && setSelectedImage(variant.images[0].url)}
                          className={`bg-[#fcfdff] border rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-center gap-4 sm:gap-5 transition-all cursor-pointer group ${selectedImage === variant.images?.[0]?.url ? 'border-[#E8440A]/40 shadow-[0_10px_25px_rgba(232,68,10,0.05)]' : 'border-[#f1f4f9] hover:shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:border-[#E8440A]/20'}`}
                        >
                          <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white rounded-xl overflow-hidden shadow-sm shrink-0 border border-[#f1f1f1] group-hover:scale-95 transition-transform duration-300">
                            {variant.images?.[0] ? (
                              <img src={variant.images[0].url} alt="V" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#e5e5e5] bg-[#fafafa] p-4"><BoxIcon /></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(variant.attributes || {}).map(([k, v]) => (
                                <span key={k} className="px-2 py-0.5 rounded-md bg-white border border-[#f1f1f1] text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#64748b]">
                                  <span className="opacity-40">{k}:</span> {v}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                              <div className="text-xs sm:text-sm font-bold truncate">₹{variant.price?.amount || product.price?.amount}</div>
                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <label className="text-[8px] sm:text-[10px] font-bold text-[#8e8e8e] uppercase tracking-wider">STOCK</label>
                                <input
                                  type="number"
                                  value={variant.stock || 0}
                                  onChange={(e) => handleStockChange(idx, e.target.value)}
                                  className="w-12 sm:w-16 bg-white border border-[#f1f1f1] rounded-lg py-1 px-1.5 sm:px-2 text-center text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E8440A]/10 focus:border-[#E8440A] transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8 gap-2">
                      <h4 className="text-lg sm:text-xl font-bold tracking-tight">Create New Variant</h4>
                      <button onClick={() => setActiveTab('inventory')} className="text-[#8e8e8e] hover:text-[#1a1a1a] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer text-left sm:text-right">Back to list</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                      <div className="space-y-6 sm:space-y-8">
                        {/* Attributes Section */}
                        <div className="space-y-3 sm:space-y-4">
                          <label className="text-[9px] sm:text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] block">Attributes</label>
                          <div className="space-y-3">
                            {attributeInputs.map((attr, index) => (
                              <div key={index} className="flex gap-2 sm:gap-3 items-center group">
                                <input
                                  type="text"
                                  placeholder="Type (e.g., Size)"
                                  value={attr.key}
                                  onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                  className="flex-1 bg-[#f8f9fa] border-none rounded-xl py-3 px-3 sm:px-4 text-xs font-medium focus:ring-2 focus:ring-[#E8440A]/10 transition-all placeholder:opacity-30"
                                />
                                <input
                                  type="text"
                                  placeholder="Value (M)"
                                  value={attr.value}
                                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                  className="flex-1 bg-[#f8f9fa] border-none rounded-xl py-3 px-3 sm:px-4 text-xs font-medium focus:ring-2 focus:ring-[#E8440A]/10 transition-all placeholder:opacity-30"
                                />
                                {attributeInputs.length > 1 && (
                                  <button onClick={() => handleRemoveAttribute(index)} className="p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-[#ff4d4d] hover:bg-[#ff4d4d]/10 rounded-lg transition-all cursor-pointer">
                                    <TrashIcon />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => setAttributeInputs([...attributeInputs, { key: '', value: '' }])}
                              className="text-[9px] sm:text-[10px] font-bold text-[#E8440A] uppercase tracking-widest flex items-center gap-2 pt-1 hover:translate-x-1 transition-transform cursor-pointer"
                            >
                              <PlusIcon /> Add another
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2.5 sm:space-y-3">
                            <label className="text-[9px] sm:text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] block">Initial Stock</label>
                            <input
                              type="number"
                              value={newVariant.stock}
                              onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                              className="w-full bg-[#f8f9fa] border-none rounded-xl py-3 sm:py-4 px-4 text-xs font-bold focus:ring-2 focus:ring-[#E8440A]/10"
                            />
                          </div>
                          <div className="space-y-2.5 sm:space-y-3">
                            <label className="text-[9px] sm:text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] block">Custom Price</label>
                            <input
                              type="number"
                              placeholder={`₹${product.price?.amount || ''}`}
                              value={newVariant.price.amount}
                              onChange={(e) => setNewVariant({ ...newVariant, price: { ...newVariant.price, amount: e.target.value } })}
                              className="w-full bg-[#f8f9fa] border-none rounded-xl py-3 sm:py-4 px-4 text-xs font-bold focus:ring-2 focus:ring-[#E8440A]/10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5 sm:space-y-6">
                        <label className="text-[9px] sm:text-[10px] font-bold text-[#1a1a1a] uppercase tracking-[0.2em] block flex justify-between items-center">
                          Variant Media
                          <span className="font-medium text-[#8e8e8e] lowercase">{newVariant.images.length}/7</span>
                        </label>

                        <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#f1f1f1] flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#fdfdfd] relative overflow-hidden transition-all hover:bg-[#fbfbfb] hover:border-[#E8440A]/20 group">
                          {newVariant.images.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 w-full h-full p-2">
                              {newVariant.images.map((img, i) => (
                                <div key={i} className="rounded-lg overflow-hidden relative shadow-sm border border-white aspect-square">
                                  <img src={img.previewUrl} alt="P" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {newVariant.images.length < 7 && (
                                <label className="flex items-center justify-center bg-[#f8f9fa] rounded-lg cursor-pointer hover:bg-[#f1f1f1] transition-colors"><PlusIcon /></label>
                              )}
                            </div>
                          ) : (
                            <>
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform"><PlusIcon /></div>
                              <p className="text-[10px] sm:text-xs text-[#8e8e8e] font-medium leading-relaxed max-w-[150px] sm:max-w-[180px]">Drag images or click to select variant media</p>
                            </>
                          )}
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>

                        <div className="pt-2 sm:pt-4">
                          <button
                            onClick={handleAddNewVariant}
                            className="w-full bg-[#1a1a1a] text-white py-4 sm:py-5 rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:bg-[#000000] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer"
                          >
                            Add To Inventory
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SellerProductDetails