import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct'

/* ── helpers ── */
const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }
const CURR = ['INR', 'USD', 'EUR', 'GBP', 'JPY']
const fmt = (a, c) => `${SYM[c] || ''}${a} ${c}`
const attrs = (v) => Object.entries(
  v.attributes instanceof Map ? Object.fromEntries(v.attributes) : (v.attributes || {})
)
const badge = (n) =>
  n === 0 ? 'bg-red-50 text-red-600'
    : n <= 5 ? 'bg-amber-50 text-amber-600'
      : 'bg-emerald-50 text-emerald-600'
const badgeLabel = (n) =>
  n === 0 ? 'Out of Stock' : n <= 5 ? 'Low Stock' : 'In Stock'

export default function SellerProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleGetProductById } = useProduct()

  /* ── state ── */
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [tab, setTab] = useState('list')   // 'list' | 'add'

  /* stock management */
  const [edits, setEdits] = useState({})    // { variantId: number }
  const [saving, setSaving] = useState(null)

  /* add-variant form */
  const fileRef = useRef()
  const [attrRows, setAttrRows] = useState([{ k: '', v: '' }])
  const [price, setPrice] = useState({ amount: '', currency: 'INR' })
  const [stock, setStock] = useState(0)
  const [previews, setPreviews] = useState([])   // local preview data-URLs
  const [files, setFiles] = useState([])   // File objects
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  /* ── fetch product ── */
  useEffect(() => {
    setLoading(true)
    handleGetProductById(productId)
      .then(setProduct).catch(console.error)
      .finally(() => setLoading(false))
  }, [productId])

  /* ── stock helpers (UI only, handlers passed as props from outside) ── */
  const stockVal = (v) => edits[v._id] ?? v.stock
  const nudge = (id, d) =>
    setEdits(p => ({ ...p, [id]: Math.max(0, (p[id] ?? product.variants.find(x => x._id === id)?.stock ?? 0) + d) }))
  const typeStock = (id, val) => {
    const n = parseInt(val)
    if (!isNaN(n) && n >= 0) setEdits(p => ({ ...p, [id]: n }))
  }

  /* ── file pick ── */
  function pickFiles(e) {
    const picked = Array.from(e.target.files || [])
    setFiles(f => [...f, ...picked])
    picked.forEach(f => {
      const r = new FileReader()
      r.onload = (ev) => setPreviews(p => [...p, ev.target.result])
      r.readAsDataURL(f)
    })
  }
  function removeFile(i) {
    setFiles(f => f.filter((_, x) => x !== i))
    setPreviews(p => p.filter((_, x) => x !== i))
  }

  /* ── form submit (UI triggers — wire your service here) ── */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!price.amount) return setMsg({ type: 'err', text: 'Price is required.' })
    setBusy(true); setMsg({ type: '', text: '' })

    const payload = {
      price: { amount: +price.amount, currency: price.currency },
      stock: +stock,
      attributes: Object.fromEntries(attrRows.filter(a => a.k && a.v).map(a => [a.k.trim(), a.v.trim()])),
      files,       // File[] — pass to your service / FormData
    }
    console.log('Create variant payload →', payload)
    // TODO: call your service here, e.g. await handleCreateVariant(productId, payload)

    setBusy(false)
    setMsg({ type: 'ok', text: 'Variant created! (wire your service to persist)' })
    setAttrRows([{ k: '', v: '' }]); setPrice({ amount: '', currency: 'INR' })
    setStock(0); setFiles([]); setPreviews([])
    setTab('list')
  }

  /* ── loading / not found ── */
  if (loading) return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 border-[3px] border-[#e5beb4] border-t-[#E8440A] rounded-full animate-spin" />
      <p className="text-[#907067] text-xs uppercase tracking-widest">Loading…</p>
    </div>
  )
  if (!product) return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <p className="text-[#191c1d] font-semibold">Product not found.</p>
    </div>
  )

  /* ═══════════ JSX ═══════════ */
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Inter',sans-serif]">

      {/* ── Breadcrumb ── */}
      <nav className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-[#e5beb4]/30 px-8 h-12 flex items-center gap-2 text-[11px] uppercase tracking-widest">
        <span className="text-[#907067] cursor-pointer hover:text-[#E8440A] transition-colors" onClick={() => navigate('/')}>Home</span>
        <span className="text-[#e5beb4]">/</span>
        <span className="text-[#907067] cursor-pointer hover:text-[#E8440A] transition-colors" onClick={() => navigate('/seller/view-products')}>My Products</span>
        <span className="text-[#e5beb4]">/</span>
        <span className="text-[#191c1d] font-semibold">{product.title}</span>
      </nav>

      {/* ── Body ── */}
      <div className="max-w-[1160px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

        {/* ══ LEFT ══ */}
        <div className="flex flex-col gap-4">

          {/* Main image */}
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#edeeef] flex items-center justify-center">
            {product.images?.[activeImg]?.url
              ? <img src={product.images[activeImg].url} alt={product.title} className="w-full h-full object-cover" />
              : <span className="text-[#907067] text-sm">No image</span>}
          </div>

          {/* Thumbs */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-14 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer
                    ${i === activeImg ? 'border-[#E8440A] scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Meta card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-2">
            <h1 className="text-xl font-bold text-[#191c1d] tracking-tight">{product.title}</h1>
            <p className="text-lg font-bold text-[#E8440A]">{fmt(product.price?.amount, product.price?.currency)}</p>
            <p className="text-sm text-[#5c4039] leading-relaxed">{product.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] bg-[#f3f4f5] text-[#5c4039] px-3 py-1 rounded-full">
                📅 {new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[11px] bg-[#f3f4f5] text-[#5c4039] px-3 py-1 rounded-full">
                🔖 {product.variants?.length || 0} variants
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-[#f0f0f0]">
            {[['list', 'Stock & Variants'], ['add', 'New Variant']].map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`relative px-6 py-4 text-[13px] font-semibold tracking-wide transition-colors cursor-pointer
                  ${tab === k ? 'text-[#E8440A]' : 'text-[#907067] hover:text-[#191c1d]'}`}>
                {label}
                {tab === k && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8440A] rounded-t" />}
              </button>
            ))}
          </div>

          {/* ── TAB: Stock & Variants ── */}
          {tab === 'list' && (
            <div className="p-5 flex flex-col gap-3">
              {msg.text && tab === 'list' && (
                <div className={`text-sm px-4 py-2.5 rounded-lg ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {msg.text}
                </div>
              )}

              {!product.variants?.length ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <span className="text-4xl">📦</span>
                  <p className="font-semibold text-[#191c1d]">No variants yet</p>
                  <p className="text-sm text-[#907067]">Add your first variant to manage stock.</p>
                  <button onClick={() => setTab('add')}
                    className="mt-2 px-5 py-2.5 bg-gradient-to-br from-[#E8440A] to-[#d73b00] text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(232,68,10,0.28)] cursor-pointer">
                    + Add Variant
                  </button>
                </div>
              ) : product.variants.map((v, idx) => {
                const qty = stockVal(v)
                const dirty = edits[v._id] !== undefined
                return (
                  <div key={v._id} className={`flex flex-wrap items-center gap-3 p-4 rounded-xl transition-shadow hover:shadow-md ${idx % 2 === 0 ? 'bg-[#f8f9fa]' : 'bg-white border border-[#f0f0f0]'}`}>

                    {/* Attributes */}
                    <div className="flex flex-wrap gap-1.5 flex-1 min-w-[120px]">
                      {attrs(v).map(([k, val]) => (
                        <span key={k} className="text-[11px] bg-[#edeeef] text-[#191c1d] px-2.5 py-1 rounded-full">
                          <span className="font-semibold text-[#907067]">{k}:</span> {val}
                        </span>
                      ))}
                      {!attrs(v).length && <span className="text-xs text-[#c4b5a5]">—</span>}
                    </div>

                    {/* Price */}
                    <span className="text-sm font-semibold text-[#191c1d] whitespace-nowrap">
                      {fmt(v.price?.amount, v.price?.currency)}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => nudge(v._id, -1)} disabled={qty <= 0}
                        className="w-7 h-7 rounded-lg border border-[#e5beb4] bg-white text-[#5c4039] text-base font-bold flex items-center justify-center hover:border-[#E8440A] transition-colors cursor-pointer disabled:opacity-40">−</button>
                      <input type="number" value={qty} min="0"
                        onChange={e => typeStock(v._id, e.target.value)}
                        className="w-12 text-center border border-[#e5beb4] rounded-lg py-1 text-sm font-semibold text-[#191c1d] outline-none focus:border-[#E8440A]" />
                      <button onClick={() => nudge(v._id, 1)}
                        className="w-7 h-7 rounded-lg border border-[#e5beb4] bg-white text-[#5c4039] text-base font-bold flex items-center justify-center hover:border-[#E8440A] transition-colors cursor-pointer">+</button>
                      {dirty && (
                        <button onClick={() => { setSaving(v._id); /* wire your service here */ setSaving(null); setEdits(p => { const n = { ...p }; delete n[v._id]; return n }) }}
                          className="w-7 h-7 rounded-lg border border-emerald-400 bg-emerald-50 text-emerald-600 text-sm font-bold flex items-center justify-center cursor-pointer">✓</button>
                      )}
                    </div>

                    {/* Status badge */}
                    <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${badge(qty)}`}>
                      {badgeLabel(qty)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── TAB: New Variant ── */}
          {tab === 'add' && (
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              {msg.text && (
                <div className={`text-sm px-4 py-2.5 rounded-lg ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {msg.text}
                </div>
              )}

              {/* Attributes */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#907067] mb-2">Attributes</p>
                {attrRows.map((a, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input placeholder="Key (e.g. Color)" value={a.k}
                      onChange={e => setAttrRows(p => p.map((x, j) => j === i ? { ...x, k: e.target.value } : x))}
                      className="flex-1 px-3 py-2 text-sm border border-[#e5beb4] rounded-lg bg-[#f8f9fa] text-[#191c1d] outline-none focus:border-[#E8440A] transition-colors" />
                    <input placeholder="Value (e.g. Blue)" value={a.v}
                      onChange={e => setAttrRows(p => p.map((x, j) => j === i ? { ...x, v: e.target.value } : x))}
                      className="flex-1 px-3 py-2 text-sm border border-[#e5beb4] rounded-lg bg-[#f8f9fa] text-[#191c1d] outline-none focus:border-[#E8440A] transition-colors" />
                    {attrRows.length > 1 && (
                      <button type="button" onClick={() => setAttrRows(p => p.filter((_, j) => j !== i))}
                        className="w-8 h-9 flex items-center justify-center rounded-lg border border-[#e5beb4] text-red-400 hover:bg-red-50 text-lg font-bold cursor-pointer shrink-0">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setAttrRows(p => [...p, { k: '', v: '' }])}
                  className="text-[12px] font-semibold text-[#E8440A] border border-dashed border-[#f4b8a5] rounded-lg px-4 py-1.5 hover:bg-[#fff8f6] transition-colors cursor-pointer">
                  + Add Attribute
                </button>
              </div>

              {/* Price */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#907067] mb-2">Price</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Amount" min="0" required value={price.amount}
                    onChange={e => setPrice(p => ({ ...p, amount: e.target.value }))}
                    className="flex-1 px-3 py-2 text-sm border border-[#e5beb4] rounded-lg bg-[#f8f9fa] text-[#191c1d] outline-none focus:border-[#E8440A] transition-colors" />
                  <select value={price.currency} onChange={e => setPrice(p => ({ ...p, currency: e.target.value }))}
                    className="px-3 py-2 text-sm border border-[#e5beb4] rounded-lg bg-[#f8f9fa] text-[#191c1d] outline-none focus:border-[#E8440A] cursor-pointer">
                    {CURR.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Stock */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#907067] mb-2">Stock Quantity</p>
                <input type="number" min="0" value={stock}
                  onChange={e => setStock(e.target.value)}
                  className="w-28 px-3 py-2 text-sm border border-[#e5beb4] rounded-lg bg-[#f8f9fa] text-[#191c1d] outline-none focus:border-[#E8440A] transition-colors" />
              </div>

              {/* Image upload */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#907067] mb-2">Images</p>
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-[#e5beb4] rounded-xl p-8 text-center cursor-pointer hover:border-[#E8440A] hover:bg-[#fff8f6] transition-all">
                  <p className="text-2xl mb-1">📁</p>
                  <p className="text-sm text-[#907067]">Click to upload images from your machine</p>
                  <p className="text-xs text-[#c4b5a5] mt-1">PNG, JPG, WEBP supported</p>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={pickFiles} />
                </div>

                {/* Previews */}
                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#e5beb4] group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeFile(i)}
                          className="absolute inset-0 bg-black/40 text-white text-lg font-bold hidden group-hover:flex items-center justify-center cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={busy}
                className="w-full py-3 bg-gradient-to-br from-[#E8440A] to-[#d73b00] text-white font-bold text-sm rounded-xl shadow-[0_4px_16px_rgba(232,68,10,0.28)] hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
                {busy ? 'Creating…' : 'Add Variant'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}